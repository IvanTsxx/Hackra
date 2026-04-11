import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { HackathonStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/shared/lib/prisma";

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
      location: data.location ?? "",
      locationMode: data.locationMode,
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
