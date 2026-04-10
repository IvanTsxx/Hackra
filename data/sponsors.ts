import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export async function getSponsorsForHackathon(hackathonId: string) {
  "use cache";
  cacheLife(CACHE_LIFE.SPONSORS_BY_HACKATHON);
  cacheTag(CACHE_TAGS.SPONSORS_BY_HACKATHON(hackathonId));

  return prisma.sponsor.findMany({
    where: {
      hackathons: {
        some: {
          id: hackathonId,
        },
      },
    },
  });
}

export async function getSponsors() {
  "use cache";
  cacheLife(CACHE_LIFE.SPONSORS_LIST);
  cacheTag(CACHE_TAGS.SPONSORS_LIST);

  return prisma.sponsor.findMany();
}
