"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/data/auth-dal";
import {
  createRequest,
  getMyRequests,
  getPendingRequestsForHackathon,
  getUserRequestForHackathon,
  respondToRequest,
  updateRequest,
} from "@/data/co-organizer-request";

export type RequestCoOrganizerResult =
  | { success: true; request: Awaited<ReturnType<typeof createRequest>> }
  | { success: false; error: string };

export async function requestCoOrganizer(
  hackathonId: string,
  message?: string
): Promise<RequestCoOrganizerResult> {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return {
      error: "You must be logged in to request co-organizer access",
      success: false,
    };
  }

  try {
    const request = await createRequest(user.id, hackathonId, message);
    revalidatePath(`/hackathon/${request.hackathon.slug}`);
    return { request, success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create request",
      success: false,
    };
  }
}

export type UpdateCoOrganizerRequestResult =
  | { success: true; request: Awaited<ReturnType<typeof updateRequest>> }
  | { success: false; error: string };

export async function updateCoOrganizerRequest(
  requestId: string,
  message: string
): Promise<UpdateCoOrganizerRequestResult> {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return {
      error: "You must be logged in to update your request",
      success: false,
    };
  }

  try {
    const request = await updateRequest(requestId, user.id, message);
    revalidatePath(`/hackathon/${request.hackathon.slug}`);
    return { request, success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update request",
      success: false,
    };
  }
}

export type RespondToCoOrganizerRequestResult =
  | { success: true; request: Awaited<ReturnType<typeof respondToRequest>> }
  | { success: false; error: string };

export async function respondToCoOrganizerRequest(
  requestId: string,
  accept: boolean,
  responseMessage?: string
): Promise<RespondToCoOrganizerRequestResult> {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return {
      error: "You must be logged in to respond to requests",
      success: false,
    };
  }

  try {
    const request = await respondToRequest(
      requestId,
      user.id,
      accept,
      responseMessage
    );
    revalidatePath(`/hackathon/${request.hackathon.slug}`);
    revalidatePath(`/dashboard/organizer`);
    return { request, success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to respond to request",
      success: false,
    };
  }
}

// Query functions (these don't need revalidation as they're used for display)
export async function getMyCoOrganizerRequests() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return [];
  }
  return getMyRequests(user.id);
}

export async function getPendingRequestsForHackathonAction(
  hackathonId: string
) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return [];
  }
  return getPendingRequestsForHackathon(
    hackathonId,
    user.id,
    user.role ?? "USER"
  );
}

export async function getUserRequestForHackathonAction(
  userId: string,
  hackathonId: string
) {
  return await getUserRequestForHackathon(userId, hackathonId);
}
