import "server-only";
import { prisma } from "@/shared/lib/prisma";

export const getTeamsForHackathon = async (hackathonId: string) =>
  await prisma.team.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
      questions: true,
    },
    where: {
      hackathonId,
    },
  });

export const getTeamById = async (id: string) =>
  await prisma.team.findUnique({
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
