"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/data/auth-dal";
import { prisma } from "@/shared/lib/prisma";

export type GiveKarmaResult =
  | { success: true; newKarmaPoints: number }
  | { success: false; error: string };

// ─── Give Karma (for user-to-user karma) ───────────────────────────────────────

export async function giveKarma(targetId: string): Promise<GiveKarmaResult> {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return { error: "You must be logged in to give karma", success: false };
  }

  // Find target user
  const targetUser = await prisma.user.findUnique({
    select: { id: true, karmaPoints: true },
    where: { id: targetId },
  });

  if (!targetUser) {
    return { error: "User not found", success: false };
  }

  // Prevent self-karma
  if (targetUser.id === user.id) {
    return { error: "You cannot give karma to yourself", success: false };
  }

  // Increment karma points
  const updated = await prisma.user.update({
    data: { karmaPoints: { increment: 1 } },
    select: { karmaPoints: true },
    where: { id: targetId },
  });

  revalidatePath("/explore");
  revalidatePath(`/profile/${targetId}`);
  revalidatePath(`/profile/${targetUser.id}`);

  return { newKarmaPoints: updated.karmaPoints, success: true };
}

// ─── Karma Actions (automated karma for platform actions) ──────────────────────

const KARMA_CONFIG = {
  createHackathon: 10,
  createTeam: 5,
  joinHackathon: 2,
  joinTeam: 2,
} as const;

/**
 * Give karma to a user for creating a hackathon
 */
export async function karmaForCreateHackathon(
  organizerId: string
): Promise<void> {
  const points = KARMA_CONFIG.createHackathon;
  await prisma.user.update({
    data: { karmaPoints: { increment: points } },
    where: { id: organizerId },
  });
}

/**
 * Give karma to a user for creating a team
 */
export async function karmaForCreateTeam(ownerId: string): Promise<void> {
  const points = KARMA_CONFIG.createTeam;
  await prisma.user.update({
    data: { karmaPoints: { increment: points } },
    where: { id: ownerId },
  });
}

/**
 * Give karma to a user for joining a hackathon
 */
export async function karmaForJoinHackathon(userId: string): Promise<void> {
  const points = KARMA_CONFIG.joinHackathon;
  await prisma.user.update({
    data: { karmaPoints: { increment: points } },
    where: { id: userId },
  });
}

/**
 * Give karma to a user for joining a team
 */
export async function karmaForJoinTeam(userId: string): Promise<void> {
  const points = KARMA_CONFIG.joinTeam;
  await prisma.user.update({
    data: { karmaPoints: { increment: points } },
    where: { id: userId },
  });
}
