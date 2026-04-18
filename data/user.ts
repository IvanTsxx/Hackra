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

export interface LeaderboardUser {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  karmaPoints: number;
  position: string | null;
}

const LEADERBOARD_PAGE_SIZE = 10;

export async function getLeaderboard(page = 1) {
  const skip = (page - 1) * LEADERBOARD_PAGE_SIZE;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { karmaPoints: "desc" },
      select: {
        id: true,
        image: true,
        karmaPoints: true,
        name: true,
        position: true,
        username: true,
      },
      skip,
      take: LEADERBOARD_PAGE_SIZE,
    }),
    prisma.user.count(),
  ]);

  return {
    hasMore: page < Math.ceil(total / LEADERBOARD_PAGE_SIZE),
    page,
    total,
    totalPages: Math.ceil(total / LEADERBOARD_PAGE_SIZE),
    users: users as LeaderboardUser[],
  };
}
