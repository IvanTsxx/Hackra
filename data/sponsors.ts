import "server-only";
import { prisma } from "@/shared/lib/prisma";

export const getSponsorsForHackathon = async (hackathonId: string) =>
  await prisma.sponsor.findMany({
    where: {
      hackathons: {
        some: {
          id: hackathonId,
        },
      },
    },
  });

export const getSponsors = async () => await prisma.sponsor.findMany();
