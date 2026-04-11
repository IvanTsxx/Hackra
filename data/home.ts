import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { HackathonStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export interface HomeStats {
  totalHackathons: number;
  totalDevelopers: number;
  totalPrizeAmount: number;
  totalProjects: number;
}

export async function getHomeStats(): Promise<HomeStats> {
  "use cache";
  cacheLife(CACHE_LIFE.HOME_DATA);
  cacheTag(CACHE_TAGS.HOME_DATA);

  const [hackathons, participants, prizes, projects] = await Promise.all([
    prisma.hackathon.count({
      where: {
        status: {
          in: [HackathonStatus.UPCOMING, HackathonStatus.LIVE],
        },
      },
    }),
    prisma.user.count(),
    prisma.hackathonPrize.aggregate({
      _sum: {
        amount: true,
      },
    }),
    prisma.team.count(),
  ]);

  return {
    totalDevelopers: participants,
    totalHackathons: hackathons,
    totalPrizeAmount: prizes._sum.amount ?? 0,
    totalProjects: projects,
  };
}
