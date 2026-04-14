"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/data/auth-dal";
import { addCoOrganizer, removeCoOrganizer } from "@/data/hackathon-organizer";
import {
  approveParticipant,
  rejectParticipant,
} from "@/data/organizer-hackathons";
import { prisma } from "@/shared/lib/prisma";

import {
  addOrganizerSchema,
  participantActionSchema,
  removeOrganizerSchema,
} from "./_schemas";

// ─── Types ───────────────────────────────────────────────────────────────────

type Result<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface UserSearchResult {
  id: string;
  username: string;
  name: string | null;
  email: string;
  image: string | null;
}

// ─── Search Users ─────────────────────────────────────────────────────────────

export async function searchUsersAction(
  q: string
): Promise<UserSearchResult[]> {
  if (q.trim().length < 2) return [];

  const users = await prisma.user.findMany({
    select: {
      email: true,
      id: true,
      image: true,
      name: true,
      username: true,
    },
    take: 6,
    where: {
      username: { contains: q.trim(), mode: "insensitive" },
    },
  });

  return users;
}

// ─── Approve Participant ─────────────────────────────────────────────────────

export async function approveParticipantAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = participantActionSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input.", success: false };

  try {
    await approveParticipant(
      parsed.data.hackathonId,
      parsed.data.participantId,
      user.id,
      user.role
    );
    revalidatePath(`/my-hackathons/${parsed.data.hackathonId}/manage`);
    return { success: true };
  } catch {
    return { error: "Failed to approve participant.", success: false };
  }
}

// ─── Reject Participant ──────────────────────────────────────────────────────

export async function rejectParticipantAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = participantActionSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input.", success: false };

  try {
    await rejectParticipant(
      parsed.data.hackathonId,
      parsed.data.participantId,
      user.id,
      user.role
    );
    revalidatePath(`/my-hackathons/${parsed.data.hackathonId}/manage`);
    return { success: true };
  } catch {
    return { error: "Failed to reject participant.", success: false };
  }
}

// ─── Add Co-Organizer ────────────────────────────────────────────────────────

export async function addOrganizerAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = addOrganizerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.username?.[0] ?? "Invalid username.",
      success: false,
    };
  }

  try {
    await addCoOrganizer(
      parsed.data.hackathonId,
      parsed.data.username,
      user.id,
      user.role
    );
    revalidatePath(`/my-hackathons/${parsed.data.hackathonId}/manage`);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to add organizer.";
    return { error: message, success: false };
  }
}

// ─── Remove Co-Organizer ────────────────────────────────────────────────────

export async function removeOrganizerAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = removeOrganizerSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input.", success: false };

  try {
    await removeCoOrganizer(
      parsed.data.hackathonId,
      parsed.data.coOrgId,
      user.id,
      user.role
    );
    revalidatePath(`/my-hackathons/${parsed.data.hackathonId}/manage`);
    return { success: true };
  } catch {
    return { error: "Failed to remove organizer.", success: false };
  }
}
