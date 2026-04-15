import "server-only";
import { v4 as uuidv4 } from "uuid";

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

  // Check if status is changing to ENDED
  const isEnding = status === "ENDED";

  const hackathon = await prisma.hackathon.update({
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

  // Generate certificates when hackathon ends
  if (isEnding) {
    try {
      await generateHackathonCertificates(id);
    } catch (error) {
      // Log but don't fail the update if certificate generation fails
      console.error("Failed to generate certificates:", error);
    }
  }

  return hackathon;
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

/**
 * Generate certificates for all participants in a completed hackathon
 * Called when hackathon status changes to ENDED
 */
export async function generateHackathonCertificates(
  hackathonId: string
): Promise<{ generated: number; errors: string[] }> {
  const errors: string[] = [];
  let generated = 0;

  // Get all participants who completed the hackathon
  const participants = await prisma.hackathonParticipant.findMany({
    include: {
      hackathon: true,
      user: true,
    },
    where: {
      hackathonId,
      status: "APPROVED",
    },
  });

  // Also get organizers
  const organizers = await prisma.hackathonOrganizer.findMany({
    include: {
      hackathon: true,
      user: true,
    },
    where: { hackathonId },
  });

  // Generate participant certificates
  for (const participant of participants) {
    try {
      await prisma.certificate.upsert({
        create: {
          hackathonId,
          recipientEmail: participant.user.email,
          recipientName: participant.user.name,
          role: "PARTICIPANT",
          token: uuidv4(),
          userId: participant.userId,
        },
        update: {
          recipientEmail: participant.user.email,
          recipientName: participant.user.name,
          role: "PARTICIPANT",
        },
        where: {
          userId_hackathonId: {
            hackathonId,
            userId: participant.userId,
          },
        },
      });
      generated += 1;
    } catch (error) {
      errors.push(
        `Failed to generate certificate for ${participant.user.email}: ${error}`
      );
    }
  }

  // Generate organizer certificates
  for (const organizer of organizers) {
    try {
      await prisma.certificate.upsert({
        create: {
          hackathonId,
          recipientEmail: organizer.user.email,
          recipientName: organizer.user.name,
          role:
            organizer.userId === organizer.hackathon.organizerId
              ? "ORGANIZER"
              : "CO_ORGANIZER",
          token: uuidv4(),
          userId: organizer.userId,
        },
        update: {
          recipientEmail: organizer.user.email,
          recipientName: organizer.user.name,
          role:
            organizer.userId === organizer.hackathon.organizerId
              ? "ORGANIZER"
              : "CO_ORGANIZER",
        },
        where: {
          userId_hackathonId: {
            hackathonId,
            userId: organizer.userId,
          },
        },
      });
      generated += 1;
    } catch (error) {
      errors.push(
        `Failed to generate certificate for organizer ${organizer.user.email}: ${error}`
      );
    }
  }

  return { errors, generated };
}

/**
 * Generate winner certificate with placement
 */
export async function generateWinnerCertificate(
  hackathonId: string,
  userId: string,
  place: "FIRST_PLACE" | "SECOND_PLACE" | "THIRD_PLACE"
) {
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!hackathon || !user) {
    throw new Error("Hackathon or user not found");
  }

  return prisma.certificate.upsert({
    create: {
      hackathonId,
      place:
        place === "FIRST_PLACE"
          ? "1st"
          : place === "SECOND_PLACE"
            ? "2nd"
            : "3rd",
      recipientEmail: user.email,
      recipientName: user.name,
      role: place,
      token: uuidv4(),
      userId,
    },
    update: {
      place:
        place === "FIRST_PLACE"
          ? "1st"
          : place === "SECOND_PLACE"
            ? "2nd"
            : "3rd",
      role: place,
    },
    where: {
      userId_hackathonId: {
        hackathonId,
        userId,
      },
    },
  });
}
