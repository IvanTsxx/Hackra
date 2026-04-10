import "server-only";
import type { HackathonStatus } from "@/app/generated/prisma/enums";
import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import { prisma } from "@/shared/lib/prisma";

export const HACKATHON_INITIAL_SIZE = 6;
export const HACKATHON_LOAD_MORE_SIZE = 3;

export const hackathonExploreInclude = {
  participants: true,
  prizes: true,
} as const;

type ExploreHackathon = HackathonGetPayload<{
  include: typeof hackathonExploreInclude;
}>;

export const getFeaturedHackatons = async () =>
  await prisma.hackathon.findMany({
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

export const getHackathon = async (slug: string) =>
  await prisma.hackathon.findUnique({
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

export async function getHackathonsForExplore(
  params: ExploreFilters
): Promise<ExploreResult> {
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
