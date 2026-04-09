"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  approveParticipant,
  deleteHackathon,
  rejectParticipant,
  updateHackathon,
} from "@/data/organizer-hackathons";
import { auth } from "@/shared/lib/auth";

import {
  deleteHackathonSchema,
  editHackathonSchema,
  participantActionSchema,
} from "./_schemas";

// ─── Types ───────────────────────────────────────────────────────────────────

type Result<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

// ─── Auth Helper ─────────────────────────────────────────────────────────────

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return { ...session.user, id: session.user.id as string };
}

// ─── Edit Hackathon ──────────────────────────────────────────────────────────

export async function editHackathonAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = editHackathonSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.title?.[0] ??
        parsed.error.flatten().formErrors[0] ??
        "Invalid form data.",
      success: false,
    };
  }

  const { id, ...dto } = parsed.data;

  try {
    await updateHackathon(id, user.id, dto);
    revalidatePath("/my-hackathons");
    return { success: true };
  } catch {
    return {
      error: "Failed to update hackathon. Please try again.",
      success: false,
    };
  }
}

// ─── Delete Hackathon ────────────────────────────────────────────────────────

export async function deleteHackathonAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = deleteHackathonSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Invalid input.",
      success: false,
    };
  }

  try {
    await deleteHackathon(parsed.data.id, user.id);
    revalidatePath("/my-hackathons");
    return { success: true };
  } catch {
    return {
      error: "Failed to delete hackathon. Please try again.",
      success: false,
    };
  }
}

// ─── Approve Participant ─────────────────────────────────────────────────────

export async function approveParticipantAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = participantActionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Invalid input.",
      success: false,
    };
  }

  try {
    await approveParticipant(
      parsed.data.hackathonId,
      parsed.data.participantId,
      user.id
    );
    revalidatePath("/my-hackathons");
    return { success: true };
  } catch {
    return {
      error: "Failed to approve participant. Please try again.",
      success: false,
    };
  }
}

// ─── Reject Participant ──────────────────────────────────────────────────────

export async function rejectParticipantAction(raw: unknown): Promise<Result> {
  const user = await requireUser();

  const parsed = participantActionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Invalid input.",
      success: false,
    };
  }

  try {
    await rejectParticipant(
      parsed.data.hackathonId,
      parsed.data.participantId,
      user.id
    );
    revalidatePath("/my-hackathons");
    return { success: true };
  } catch {
    return {
      error: "Failed to reject participant. Please try again.",
      success: false,
    };
  }
}
