import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/shared/lib/prisma";

import { CACHE_TAGS, CACHE_LIFE } from "./cache-constants";

// oxlint-disable require-await
// "use cache" is an implicit await - the function is cached by Next.js at runtime

// Get all team applications for a user with team and hackathon info
export function getUserApplications(userId: string) {
  return prisma.teamApplication.findMany({
    include: {
      team: {
        include: {
          hackathon: { select: { slug: true, title: true } },
          owner: { select: { name: true, username: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
}

// Get all applications for a team (for owner management) with user details and answers
export async function getTeamApplicationsForOwner(
  teamId: string,
  ownerId: string
) {
  // First verify ownership
  const team = await prisma.team.findUnique({
    select: { ownerId: true },
    where: { id: teamId },
  });
  if (!team || team.ownerId !== ownerId) {
    throw new Error("Unauthorized: not team owner");
  }

  return prisma.teamApplication.findMany({
    include: {
      answers: {
        include: {
          question: { select: { question: true } },
        },
      },
      user: {
        select: {
          bio: true,
          email: true,
          githubUsername: true,
          id: true,
          image: true,
          name: true,
          techStack: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { teamId },
  });
}

// Get team members for a team
export async function getTeamMembers(teamId: string) {
  "use cache";
  cacheLife(CACHE_LIFE.TEAM_BY_ID);
  cacheTag(CACHE_TAGS.TEAM_BY_ID(teamId));

  return prisma.teamMember.findMany({
    include: {
      user: {
        select: {
          bio: true,
          id: true,
          image: true,
          name: true,
          techStack: true,
          username: true,
        },
      },
    },
    where: { teamId },
  });
}

// Get team with owner info for authorization
export async function getTeamWithOwner(teamId: string) {
  "use cache";
  cacheLife(CACHE_LIFE.TEAM_BY_ID);
  cacheTag(CACHE_TAGS.TEAM_BY_ID(teamId));

  return prisma.team.findUnique({
    include: {
      hackathon: { select: { slug: true, title: true } },
      owner: { select: { id: true } },
    },
    where: { id: teamId },
  });
}

// Get user's hackathon participations
export function getUserParticipations(userId: string) {
  return prisma.hackathonParticipant.findMany({
    include: {
      hackathon: {
        select: {
          endDate: true,
          slug: true,
          startDate: true,
          status: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
}

// Get team questions for an application form
export function getTeamQuestions(teamId: string) {
  return prisma.teamQuestion.findMany({
    orderBy: { createdAt: "asc" },
    where: { teamId },
  });
}

// Get teams owned by a user and teams where the user is a member
export async function getUserTeams(userId: string) {
  const [owned, memberOf] = await Promise.all([
    // Teams owned by user
    prisma.team.findMany({
      include: {
        _count: { select: { applications: true } },
        hackathon: { select: { slug: true, status: true, title: true } },
        members: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
      where: { ownerId: userId },
    }),
    // Teams where user is a member
    prisma.teamMember.findMany({
      include: {
        team: {
          include: {
            hackathon: { select: { slug: true, status: true, title: true } },
            members: { select: { userId: true } },
            owner: { select: { name: true, username: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      where: { userId },
    }),
  ]);

  return { memberOf, owned };
}
