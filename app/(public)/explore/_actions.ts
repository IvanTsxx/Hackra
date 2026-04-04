"use server";

import type { HackathonStatus } from "@/app/generated/prisma/enums";
import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import type { hackathonExploreInclude } from "@/data/hackatons";
import { getHackathonsForExplore } from "@/data/hackatons";

interface LoadMoreFilters {
  q?: string;
  location?: string;
  tags?: string[];
  techs?: string[];
  statuses?: HackathonStatus[];
}

interface LoadMoreResult {
  hackathons: HackathonGetPayload<{
    include: typeof hackathonExploreInclude;
  }>[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function loadMoreHackathons(
  cursor: string | null,
  filters: LoadMoreFilters
): Promise<LoadMoreResult> {
  const result = await getHackathonsForExplore({
    ...filters,
    cursor: cursor ?? undefined,
  });

  return {
    hackathons: result.hackathons,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  };
}
