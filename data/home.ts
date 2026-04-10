import "server-only";
import { HackathonStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/shared/lib/prisma";

export interface HomeStats {
  totalHackathons: number;
  totalDevelopers: number;
  totalPrizeAmount: number;
}

export async function getHomeStats(): Promise<HomeStats> {
  const [hackathons, participants, prizes] = await Promise.all([
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
  ]);

  return {
    totalDevelopers: participants,
    totalHackathons: hackathons,
    totalPrizeAmount: prizes._sum.amount ?? 0,
  };
}
