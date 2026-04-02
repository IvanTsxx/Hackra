import { prisma } from "@/shared/lib/prisma";

import "server-only";

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
