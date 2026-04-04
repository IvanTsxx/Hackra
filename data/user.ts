import "server-only";
import { prisma } from "@/shared/lib/prisma";

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: { id },
  });

export const getUserByUsername = async (username: string) =>
  await prisma.user.findUnique({
    include: {
      organizedHackathons: {
        include: {
          participants: true,
          prizes: true,
        },
      },
      ownedTeams: true,
      participations: {
        include: {
          hackathon: {
            include: {
              participants: true,
              prizes: true,
            },
          },
        },
      },
    },
    where: { username },
  });
