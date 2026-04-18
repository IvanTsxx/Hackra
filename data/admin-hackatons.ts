import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { HackathonStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/shared/lib/prisma";
import { SIMILARITY_CONFIG, isSimilarHackathon } from "@/shared/lib/similarity";
import type { SimilarHackathon } from "@/shared/lib/similarity";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export interface CreateHackathonDTO {
  title: string;
  slug: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  locationMode: string;
  isOnline: boolean;
  tags: string[];
  techs: string[];
  requiresApproval: boolean;
  maxParticipants?: number;
  maxTeamSize?: number;
  organizerId: string;
  // Status
  status?: HackathonStatus;
  // Luma fields
  source?: string;
  externalId?: string;
  externalUrl?: string;
  // Geocoordinates
  latitude?: number | null;
  longitude?: number | null;
}

export async function getAdminHackathons() {
  "use cache";
  cacheLife(CACHE_LIFE.ADMIN_ALL_HACKATHONS);
  cacheTag(CACHE_TAGS.ADMIN_ALL_HACKATHONS);

  return prisma.hackathon.findMany({
    include: {
      organizer: {
        select: {
          name: true,
          username: true,
        },
      },
      participants: true,
      teams: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminHackathon(id: string) {
  "use cache";
  cacheLife(CACHE_LIFE.ADMIN_HACKATHON_STATS);
  cacheTag(CACHE_TAGS.ADMIN_HACKATHON_STATS);

  return prisma.hackathon.findUnique({
    include: {
      organizer: {
        select: {
          name: true,
          username: true,
        },
      },
      participants: true,
      prizes: true,
      sponsors: true,
      teams: true,
    },
    where: { id },
  });
}

export async function getHackathonByExternalUrl(externalUrl: string) {
  return await prisma.hackathon.findFirst({
    where: { externalUrl },
  });
}

export async function createHackathon(data: CreateHackathonDTO) {
  return await prisma.hackathon.create({
    data: {
      description: data.description,
      endDate: data.endDate,
      externalId: data.externalId,
      externalUrl: data.externalUrl,
      image: data.image,
      isOnline: data.isOnline,
      latitude: data.latitude,
      location: data.location ?? "",
      locationMode: data.locationMode,
      longitude: data.longitude,
      maxParticipants: data.maxParticipants,
      maxTeamSize: data.maxTeamSize ?? 4,
      organizerId: data.organizerId,
      requiresApproval: data.requiresApproval,
      slug: data.slug,
      source: data.source,
      startDate: data.startDate,
      status: data.status ?? HackathonStatus.DRAFT,
      tags: data.tags,
      techs: data.techs,
      title: data.title,
    },
  });
}

export async function updateHackathon(
  id: string,
  data: Partial<CreateHackathonDTO>
) {
  const { source, externalId, externalUrl, ...rest } = data;

  return await prisma.hackathon.update({
    data: {
      ...rest,
      externalId,
      externalUrl,
      lastSyncedAt: source ? new Date() : undefined,
      source,
    },
    where: { id },
  });
}

export async function deleteHackathon(id: string) {
  return await prisma.hackathon.delete({
    where: { id },
  });
}

export async function publishHackathon(id: string) {
  return await prisma.hackathon.update({
    data: { status: "UPCOMING" },
    where: { id },
  });
}

/**
 * Update hackathon statuses based on dates.
 * UPCOMING → LIVE when startDate is reached
 * LIVE → ENDED when endDate is reached
 * This should be called periodically (e.g., on app startup or via cron)
 */
export async function updateHackathonStatuses() {
  const now = new Date();

  // Find hackathons that will change to LIVE
  const toLive = await prisma.hackathon.findMany({
    select: { id: true, organizerId: true, slug: true },
    where: {
      startDate: { lte: now },
      status: HackathonStatus.UPCOMING,
    },
  });

  // Find hackathons that will change to ENDED
  const toEnded = await prisma.hackathon.findMany({
    select: { id: true, organizerId: true, slug: true },
    where: {
      endDate: { lte: now },
      status: HackathonStatus.LIVE,
    },
  });

  // UPCOMING → LIVE: startDate <= now
  await prisma.hackathon.updateMany({
    data: { status: HackathonStatus.LIVE },
    where: {
      startDate: { lte: now },
      status: HackathonStatus.UPCOMING,
    },
  });

  // LIVE → ENDED: endDate <= now
  await prisma.hackathon.updateMany({
    data: { status: HackathonStatus.ENDED },
    where: {
      endDate: { lte: now },
      status: HackathonStatus.LIVE,
    },
  });

  return {
    ended: toEnded.length,
    started: toLive.length,
    toEnded,
    toLive,
  };
}

export interface HackathonStats {
  total: number;
  bySource: { source: string | null; count: number }[];
  byStatus: { status: string; count: number }[];
}

export async function getHackathonStats(): Promise<HackathonStats> {
  "use cache";
  cacheLife(CACHE_LIFE.ADMIN_HACKATHON_STATS);
  cacheTag(CACHE_TAGS.ADMIN_HACKATHON_STATS);

  const [total, bySource, byStatus] = await Promise.all([
    prisma.hackathon.count(),
    prisma.hackathon.groupBy({
      _count: true,
      by: ["source"],
    }),
    prisma.hackathon.groupBy({
      _count: true,
      by: ["status"],
    }),
  ]);

  return {
    bySource: bySource.map((row) => ({
      count: row._count,
      source: row.source,
    })),
    byStatus: byStatus.map((row) => ({
      count: row._count,
      status: row.status,
    })),
    total,
  };
}

/**
 * Find hackathons similar to the given title/description.
 * Uses title pre-filtering + application-layer Dice coefficient scoring.
 */
export async function findSimilarHackathons(
  title: string,
  description: string,
  opts?: { threshold?: number; limit?: number }
): Promise<SimilarHackathon[]> {
  const threshold = opts?.threshold ?? SIMILARITY_CONFIG.DESCRIPTION_THRESHOLD;
  const limit = opts?.limit ?? SIMILARITY_CONFIG.MAX_RESULTS;

  // Fetch all hackathons with required fields for comparison
  const allHackathons = await prisma.hackathon.findMany({
    select: {
      description: true,
      id: true,
      slug: true,
      title: true,
    },
  });

  // Score each hackathon
  const scored = allHackathons
    .map((h) => {
      const result = isSimilarHackathon(title, description, h, { threshold });
      return {
        description: h.description,
        descriptionScore: result.descriptionScore,
        id: h.id,
        isBlocked: result.isBlocked,
        slug: h.slug,
        title: h.title,
        titleMatch: result.titleMatch,
      };
    })
    .filter((h) => h.isBlocked);

  // Sort by description score descending (most similar first)
  scored.sort((a, b) => b.descriptionScore - a.descriptionScore);

  // Return top N results
  return scored.slice(0, limit);
}
