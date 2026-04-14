import "server-only";
import type {
  HackathonStatus,
  ParticipantStatus,
} from "@/app/generated/prisma/enums";
import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import { prisma } from "@/shared/lib/prisma";

import { requireManageAccess } from "./hackathon-organizer";

export interface EditHackathonDTO {
  title?: string;
  description?: string;
  image?: string | null;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  locationMode?: string;
  isOnline?: boolean;
  tags?: string[];
  techs?: string[];
  maxParticipants?: number | null;
  maxTeamSize?: number;
  status?: string;
}

const organizerHackathonInclude = {
  _count: {
    select: { participants: true },
  },
} as const;

type OrganizerHackathon = HackathonGetPayload<{
  include: typeof organizerHackathonInclude;
}>;

export async function getOrganizerHackathons(
  userId: string
): Promise<OrganizerHackathon[]> {
  return await prisma.hackathon.findMany({
    include: organizerHackathonInclude,
    orderBy: { createdAt: "desc" },
    where: { organizerId: userId },
  });
}

export async function getCoOrganizerHackathons(
  userId: string
): Promise<OrganizerHackathon[]> {
  const coOrgs = await prisma.hackathonOrganizer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      hackathon: {
        include: organizerHackathonInclude,
      },
    },
    where: { userId },
  });

  return coOrgs.map((co) => co.hackathon);
}

export async function getHackathonPendingCounts(
  userId: string
): Promise<Record<string, number>> {
  const [owned, coOrged] = await Promise.all([
    prisma.hackathon.findMany({
      select: { id: true },
      where: { organizerId: userId },
    }),
    prisma.hackathonOrganizer.findMany({
      select: { hackathonId: true },
      where: { userId },
    }),
  ]);

  const hackathonIds = [
    ...owned.map((h) => h.id),
    ...coOrged.map((h) => h.hackathonId),
  ];

  if (hackathonIds.length === 0) return {};

  const counts = await prisma.hackathonParticipant.groupBy({
    _count: {
      hackathonId: true,
    },
    by: ["hackathonId"],
    where: {
      hackathonId: { in: hackathonIds },
      status: "PENDING" as ParticipantStatus,
    },
  });

  const result: Record<string, number> = {};
  for (const c of counts) {
    result[c.hackathonId] = c._count.hackathonId;
  }
  return result;
}

export async function getTotalPendingParticipants(
  userId: string
): Promise<number> {
  const [owned, coOrged] = await Promise.all([
    prisma.hackathon.findMany({
      select: { id: true },
      where: { organizerId: userId },
    }),
    prisma.hackathonOrganizer.findMany({
      select: { hackathonId: true },
      where: { userId },
    }),
  ]);

  const hackathonIds = [
    ...owned.map((h) => h.id),
    ...coOrged.map((h) => h.hackathonId),
  ];

  if (hackathonIds.length === 0) return 0;

  return await prisma.hackathonParticipant.count({
    where: {
      hackathonId: { in: hackathonIds },
      status: "PENDING" as ParticipantStatus,
    },
  });
}

export async function getOrganizerHackathonById(id: string, userId: string) {
  const hackathon = await prisma.hackathon.findUnique({
    include: {
      participants: {
        include: {
          user: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              username: true,
            },
          },
        },
      },
      prizes: true,
      sponsors: true,
      teams: true,
    },
    where: { id },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  if (hackathon.organizerId !== userId) {
    throw new Error("Unauthorized");
  }

  return hackathon;
}

export async function getPendingParticipantsCount(
  hackathonId: string,
  userId: string
): Promise<number> {
  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true },
    where: { id: hackathonId },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  if (hackathon.organizerId !== userId) {
    throw new Error("Unauthorized");
  }

  const count = await prisma.hackathonParticipant.count({
    where: {
      hackathonId,
      status: "PENDING" as ParticipantStatus,
    },
  });

  return count;
}

export interface ParticipantWithUser {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
  };
}

export async function getHackathonParticipants(
  hackathonId: string,
  userId: string
): Promise<ParticipantWithUser[]> {
  await verifyOwnership(hackathonId, userId);

  const participants = await prisma.hackathonParticipant.findMany({
    include: {
      user: {
        select: {
          email: true,
          id: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { hackathonId },
  });

  return participants.map((p) => ({
    createdAt: p.createdAt,
    id: p.id,
    status: p.status,
    user: p.user,
  }));
}

async function verifyOwnership(id: string, userId: string): Promise<void> {
  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true },
    where: { id },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  if (hackathon.organizerId !== userId) {
    throw new Error("Unauthorized");
  }
}

// Allows owner, admin, or co-organizer to manage participants
async function verifyManageAccessLocal(
  hackathonId: string,
  userId: string,
  userRole = "USER"
): Promise<void> {
  return await requireManageAccess(hackathonId, userId, userRole);
}

export async function getHackathonForManage(
  hackathonId: string,
  userId: string,
  userRole: string
) {
  await requireManageAccess(hackathonId, userId, userRole);

  const hackathon = await prisma.hackathon.findUnique({
    include: {
      organizer: {
        select: { id: true, image: true, name: true, username: true },
      },
      organizers: {
        include: {
          addedBy: { select: { username: true } },
          user: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      participants: {
        include: {
          user: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    where: { id: hackathonId },
  });

  if (!hackathon) throw new Error("Hackathon not found");

  return hackathon;
}

export async function updateHackathon(
  id: string,
  userId: string,
  data: EditHackathonDTO
) {
  await verifyOwnership(id, userId);

  const {
    title,
    description,
    image,
    startDate,
    endDate,
    location,
    locationMode,
    isOnline,
    tags,
    techs,
    maxParticipants,
    maxTeamSize,
    status,
  } = data;

  return await prisma.hackathon.update({
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(location !== undefined && { location }),
      ...(locationMode !== undefined && { locationMode }),
      ...(isOnline !== undefined && { isOnline }),
      ...(tags !== undefined && { tags }),
      ...(techs !== undefined && { techs }),
      ...(maxParticipants !== undefined && { maxParticipants }),
      ...(maxTeamSize !== undefined && { maxTeamSize }),
      ...(status !== undefined && { status: status as HackathonStatus }),
    },
    where: { id },
  });
}

export async function deleteHackathon(id: string, userId: string) {
  await verifyOwnership(id, userId);

  return await prisma.hackathon.delete({
    where: { id },
  });
}

export async function approveParticipant(
  hackathonId: string,
  participantId: string,
  userId: string,
  userRole = "USER"
) {
  await verifyManageAccessLocal(hackathonId, userId, userRole);

  return await prisma.hackathonParticipant.update({
    data: { status: "APPROVED" as ParticipantStatus },
    where: { id: participantId },
  });
}

export async function rejectParticipant(
  hackathonId: string,
  participantId: string,
  userId: string,
  userRole = "USER"
) {
  await verifyManageAccessLocal(hackathonId, userId, userRole);

  return await prisma.hackathonParticipant.update({
    data: { status: "REJECTED" as ParticipantStatus },
    where: { id: participantId },
  });
}
