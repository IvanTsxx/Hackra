import "server-only";
import { prisma } from "@/shared/lib/prisma";

export const getFeaturedHackatons = async () =>
  await prisma.hackathon.findMany({
    include: {
      participants: true,
      prizes: true,
    },
    take: 3,
    where: {
      OR: [{ status: "LIVE" }, { status: "UPCOMING" }],
    },
  });

export const getHackathon = async (slug: string) =>
  await prisma.hackathon.findUnique({
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      prizes: true,
    },
    where: { slug },
  });
