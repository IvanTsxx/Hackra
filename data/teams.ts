import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export async function getTeamsForHackathon(hackathonSlug: string) {
  "use cache";
  cacheLife(CACHE_LIFE.TEAMS_BY_HACKATHON);
  cacheTag(CACHE_TAGS.TEAMS_BY_HACKATHON(hackathonSlug));

  return prisma.team.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
      questions: true,
    },
    where: {
      hackathon: {
        slug: hackathonSlug,
      },
    },
  });
}

export async function getTeamById(id: string) {
  "use cache";
  cacheLife(CACHE_LIFE.TEAM_BY_ID);
  cacheTag(CACHE_TAGS.TEAM_BY_ID(id));

  return prisma.team.findUnique({
    include: {
      applications: true,
      hackathon: true,
      members: {
        include: {
          user: true,
        },
      },
      questions: true,
    },
    where: {
      id,
    },
  });
}

export async function getAllTeams() {
  "use cache";
  cacheLife(CACHE_LIFE.TEAMS_LIST);
  cacheTag(CACHE_TAGS.TEAMS_LIST);

  return prisma.team.findMany({
    select: {
      id: true,
    },
    take: 100,
  });
}
