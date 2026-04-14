import "server-only";
import { prisma } from "@/shared/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoOrganizerDTO {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
  };
  addedBy: {
    username: string;
  };
}

// ─── Authorization ────────────────────────────────────────────────────────────

/**
 * Returns true if the user has management access to the hackathon.
 * Access is granted to:
 * - The hackathon creator (organizerId)
 * - A global ADMIN
 * - A co-organizer assigned via HackathonOrganizer
 */
export async function hasManageAccess(
  hackathonId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  if (userRole === "ADMIN") return true;

  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true },
    where: { id: hackathonId },
  });

  if (!hackathon) return false;
  if (hackathon.organizerId === userId) return true;

  const coOrg = await prisma.hackathonOrganizer.findUnique({
    where: { hackathonId_userId: { hackathonId, userId } },
  });

  return coOrg !== null;
}

/**
 * Returns true if the user can assign/remove co-organizers.
 * Restricted to: hackathon creator or global ADMIN.
 */
export async function canManageOrganizers(
  hackathonId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  if (userRole === "ADMIN") return true;

  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true },
    where: { id: hackathonId },
  });

  return hackathon?.organizerId === userId;
}

/**
 * Verifies the user has management access. Throws if not.
 */
export async function requireManageAccess(
  hackathonId: string,
  userId: string,
  userRole: string
): Promise<void> {
  const ok = await hasManageAccess(hackathonId, userId, userRole);
  if (!ok) throw new Error("Unauthorized");
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getCoOrganizers(
  hackathonId: string,
  userId: string,
  userRole: string
): Promise<CoOrganizerDTO[]> {
  await requireManageAccess(hackathonId, userId, userRole);

  const rows = await prisma.hackathonOrganizer.findMany({
    include: {
      addedBy: {
        select: { username: true },
      },
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
    where: { hackathonId },
  });

  return rows.map((r) => ({
    addedBy: r.addedBy,
    createdAt: r.createdAt,
    id: r.id,
    user: r.user,
  }));
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function addCoOrganizer(
  hackathonId: string,
  targetUsername: string,
  actingUserId: string,
  actingUserRole: string
): Promise<void> {
  const ok = await canManageOrganizers(
    hackathonId,
    actingUserId,
    actingUserRole
  );
  if (!ok) throw new Error("Unauthorized");

  const target = await prisma.user.findUnique({
    select: { id: true },
    where: { username: targetUsername },
  });

  if (!target) throw new Error("User not found");

  // Cannot add the hackathon creator as a co-organizer
  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true },
    where: { id: hackathonId },
  });

  if (hackathon?.organizerId === target.id) {
    throw new Error("Cannot add the hackathon creator as a co-organizer");
  }

  await prisma.hackathonOrganizer.create({
    data: {
      addedById: actingUserId,
      hackathonId,
      userId: target.id,
    },
  });
}

export async function removeCoOrganizer(
  hackathonId: string,
  coOrgId: string,
  actingUserId: string,
  actingUserRole: string
): Promise<void> {
  const ok = await canManageOrganizers(
    hackathonId,
    actingUserId,
    actingUserRole
  );
  if (!ok) throw new Error("Unauthorized");

  await prisma.hackathonOrganizer.delete({
    where: { id: coOrgId },
  });
}
