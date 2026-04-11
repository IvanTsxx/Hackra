import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

export async function getUserById(id: string) {
  "use cache";
  cacheLife(CACHE_LIFE.USER_BY_ID);
  cacheTag(CACHE_TAGS.USER_BY_ID(id));

  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByUsername(username: string) {
  "use cache";
  cacheLife(CACHE_LIFE.USER_BY_SLUG);
  cacheTag(CACHE_TAGS.USER_BY_SLUG(username));

  return prisma.user.findUnique({
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
}

export async function getAllUsers() {
  "use cache";
  cacheLife(CACHE_LIFE.USERS_LIST);
  cacheTag(CACHE_TAGS.USERS_LIST);

  return prisma.user.findMany({
    select: {
      username: true,
    },
    take: 100,
  });
}
