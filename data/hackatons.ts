import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { HackathonStatus } from "@/app/generated/prisma/enums";
import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export const HACKATHON_INITIAL_SIZE = 6;
export const HACKATHON_LOAD_MORE_SIZE = 3;

export const hackathonExploreInclude = {
  participants: true,
  prizes: true,
} as const;

export const hackathonMapInclude = {
  prizes: {
    orderBy: {
      sortOrder: "asc" as const,
    },
    select: {
      amount: true,
    },
  },
} as const;

type ExploreHackathon = HackathonGetPayload<{
  include: typeof hackathonExploreInclude;
}>;

export interface MapHackathon {
  id: string;
  slug: string;
  title: string;
  location: string;
  locationMode: string;
  isOnline: boolean;
  latitude: number | null;
  longitude: number | null;
  status: string;
  tags: string[];
  techs: string[];
  startDate: Date;
  endDate: Date;
  topPrize: number | null;
  participantCount: number;
  maxParticipants: number | null;
  image: string | null;
}

export async function getFeaturedHackatons() {
  "use cache";
  cacheLife(CACHE_LIFE.FEATURED_HACKATHONS);
  cacheTag(CACHE_TAGS.FEATURED_HACKATHONS);

  return prisma.hackathon.findMany({
    include: {
      participants: true,
      prizes: true,
    },
    orderBy: {
      participants: {
        _count: "desc",
      },
    },
    take: 3,
    where: {
      OR: [{ status: "LIVE" }, { status: "UPCOMING" }],
    },
  });
}

export async function getHackathon(slug: string) {
  "use cache";
  cacheLife(CACHE_LIFE.HACKATHON_BY_SLUG);
  cacheTag(CACHE_TAGS.HACKATHON_BY_SLUG(slug));

  return prisma.hackathon.findUnique({
    include: {
      organizer: true,
      participants: {
        include: {
          user: true,
        },
      },
      prizes: true,
    },
    where: { slug },
  });
}

interface ExploreFilters {
  q?: string;
  location?: string;
  tags?: string[];
  techs?: string[];
  cursor?: string;
}

interface ExploreResult {
  hackathons: ExploreHackathon[];
  totalCount: number;
  nextCursor: string | null;
  hasMore: boolean;
}

function buildExploreCacheTag(
  q?: string,
  location?: string,
  tags?: string[],
  techs?: string[]
): string {
  const parts = [
    q ?? "none",
    location ?? "none",
    tags?.join(",") ?? "none",
    techs?.join(",") ?? "none",
  ];
  return `EXPLORE-${parts.join("-")}`;
}

export async function getHackathonsForExplore(
  params: ExploreFilters
): Promise<ExploreResult> {
  "use cache";
  cacheLife(CACHE_LIFE.HACKATHONS_LIST);
  cacheTag(
    buildExploreCacheTag(params.q, params.location, params.tags, params.techs)
  );

  const { q, location, tags, techs, cursor } = params;

  const where: {
    status?: { in: HackathonStatus[] };
    tags?: { hasSome: string[] };
    techs?: { hasSome: string[] };
    location?: string;
    isOnline?: boolean;
    OR?: {
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
    }[];
  } = {
    status: { in: ["LIVE", "UPCOMING"] },
  };

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  if (techs && techs.length > 0) {
    where.techs = { hasSome: techs };
  }

  if (location) {
    if (location === "Online") {
      where.isOnline = true;
    } else {
      where.location = location;
    }
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const take = cursor ? HACKATHON_LOAD_MORE_SIZE : HACKATHON_INITIAL_SIZE;

  const [hackathons, totalCount] = await Promise.all([
    prisma.hackathon.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      include: hackathonExploreInclude,
      orderBy: { createdAt: "desc" },
      skip: cursor ? 1 : 0,
      take: take + 1,
      where,
    }),
    prisma.hackathon.count({ where }),
  ]);

  const hasMore = hackathons.length > take;
  const items = hasMore ? hackathons.slice(0, -1) : hackathons;
  const nextCursor = hasMore ? (items.at(-1)?.id ?? null) : null;

  return {
    hackathons: items,
    hasMore,
    nextCursor,
    totalCount,
  };
}

interface FilterOption {
  value: string;
  count: number;
}

interface ExploreFilterOptions {
  tags: FilterOption[];
  techs: FilterOption[];
  locations: FilterOption[];
  statuses: { value: HackathonStatus; count: number }[];
  totalCount: number;
}

export async function getExploreFilters(): Promise<ExploreFilterOptions> {
  "use cache";
  cacheLife(CACHE_LIFE.HACKATHONS_LIST);
  cacheTag(CACHE_TAGS.HACKATHONS_LIST);

  const allHackathons = await prisma.hackathon.findMany({
    select: {
      isOnline: true,
      location: true,
      status: true,
      tags: true,
      techs: true,
    },
  });

  const tagMap = new Map<string, number>();
  const techMap = new Map<string, number>();
  const locationMap = new Map<string, number>();
  const statusMap = new Map<HackathonStatus, number>();

  for (const h of allHackathons) {
    for (const tag of h.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
    for (const tech of h.techs) {
      techMap.set(tech, (techMap.get(tech) ?? 0) + 1);
    }
    const loc = h.isOnline ? "Online" : h.location;
    locationMap.set(loc, (locationMap.get(loc) ?? 0) + 1);
    statusMap.set(h.status, (statusMap.get(h.status) ?? 0) + 1);
  }

  const tags: FilterOption[] = [...tagMap.entries()]
    .map(([value, count]) => ({ count, value }))
    .toSorted((a, b) => a.value.localeCompare(b.value));

  const techs: FilterOption[] = [...techMap.entries()]
    .map(([value, count]) => ({ count, value }))
    .toSorted((a, b) => a.value.localeCompare(b.value));

  const locations: FilterOption[] = [...locationMap.entries()]
    .map(([value, count]) => ({ count, value }))
    .toSorted((a, b) => a.value.localeCompare(b.value));

  const statuses = [...statusMap.entries()]
    .map(([value, count]) => ({ count, value }))
    .toSorted((a, b) => a.value.localeCompare(b.value));

  return { locations, statuses, tags, techs, totalCount: allHackathons.length };
}

export const getAllHackathons = async () =>
  await prisma.hackathon.findMany({
    select: {
      slug: true,
    },
    take: 100,
  });

/**
 * Get featured hackathons for the map view (top ~8 by participant count).
 * Used by the home page to show featured hackathons on a map.
 */
export async function getFeaturedHackatonsForMap(): Promise<MapHackathon[]> {
  "use cache";
  cacheLife(CACHE_LIFE.FEATURED_HACKATHONS);
  cacheTag(CACHE_TAGS.FEATURED_HACKATHONS);

  const hackathons = await prisma.hackathon.findMany({
    include: {
      participants: {
        select: { id: true },
      },
      prizes: {
        orderBy: { sortOrder: "asc" },
        select: { amount: true },
        take: 1,
      },
    },
    orderBy: {
      participants: {
        _count: "desc",
      },
    },
    take: 8,
    where: {
      status: { in: ["LIVE", "UPCOMING"] },
    },
  });

  return hackathons.map((h) => ({
    endDate: h.endDate,
    id: h.id,
    image: h.image,
    isOnline: h.isOnline,
    latitude: h.latitude,
    location: h.location,
    locationMode: h.locationMode,
    longitude: h.longitude,
    maxParticipants: h.maxParticipants,
    participantCount: h.participants.length,
    slug: h.slug,
    startDate: h.startDate,
    status: h.status,
    tags: h.tags,
    techs: h.techs,
    title: h.title,
    topPrize: h.prizes[0]?.amount ?? null,
  }));
}

/**
 * Get all hackathons for the map view (no pagination, includes coordinates).
 * Returns both hackathons with coordinates (for map markers) and online-only ones (for list).
 */
export async function getHackathonsForMap(
  params: ExploreFilters
): Promise<MapHackathon[]> {
  "use cache";
  cacheLife(CACHE_LIFE.HACKATHONS_LIST);
  cacheTag(
    buildMapCacheTag(params.q, params.location, params.tags, params.techs)
  );

  const { q, location, tags, techs } = params;

  const where: {
    status?: { in: HackathonStatus[] };
    tags?: { hasSome: string[] };
    techs?: { hasSome: string[] };
    location?: string;
    isOnline?: boolean;
    OR?: {
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
    }[];
  } = {
    status: { in: ["LIVE", "UPCOMING"] },
  };

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  if (techs && techs.length > 0) {
    where.techs = { hasSome: techs };
  }

  if (location) {
    if (location === "Online") {
      where.isOnline = true;
    } else {
      where.location = location;
    }
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const hackathons = await prisma.hackathon.findMany({
    include: {
      participants: {
        select: { id: true },
      },
      prizes: {
        orderBy: { sortOrder: "asc" },
        select: { amount: true },
        take: 1,
      },
    },
    orderBy: { startDate: "asc" },
    take: 500,
    where,
  });

  return hackathons.map((h) => ({
    endDate: h.endDate,
    id: h.id,
    image: h.image,
    isOnline: h.isOnline,
    latitude: h.latitude,
    location: h.location,
    locationMode: h.locationMode,
    longitude: h.longitude,
    maxParticipants: h.maxParticipants,
    participantCount: h.participants.length,
    slug: h.slug,
    startDate: h.startDate,
    status: h.status,
    tags: h.tags,
    techs: h.techs,
    title: h.title,
    topPrize: h.prizes[0]?.amount ?? null,
  }));
}

function buildMapCacheTag(
  q?: string,
  location?: string,
  tags?: string[],
  techs?: string[]
): string {
  const parts = [
    q ?? "none",
    location ?? "none",
    tags?.join(",") ?? "none",
    techs?.join(",") ?? "none",
    "map",
  ];
  return `EXPLORE-${parts.join("-")}`;
}
