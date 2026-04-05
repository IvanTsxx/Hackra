"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

import {
  createHackathon,
  deleteHackathon,
  getAdminHackathon,
  getHackathonByExternalUrl,
  publishHackathon as publishHackathonDAL,
  updateHackathon,
} from "@/data/admin-hackatons";
import { auth } from "@/shared/lib/auth";
import { scrapeLumaEvent } from "@/shared/lib/luma-scraper";
import type { LumaEventData } from "@/shared/lib/luma-scraper";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check admin role — Better Auth stores role in session.user
  const { user } = session;
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  if (!user.id) {
    throw new Error("User not found");
  }

  return user;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/[\s_]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

// ─── Preview Luma ────────────────────────────────────────────────────────────

const previewLumaSchema = z.string().url("Must be a valid URL.");

export async function previewLumaAction(url: string): Promise<{
  success: boolean;
  data?: LumaEventData;
  error?: string;
}> {
  try {
    await requireAdmin();

    const parsed = previewLumaSchema.safeParse(url);
    if (!parsed.success) {
      return { error: parsed.error.flatten().formErrors[0], success: false };
    }

    const eventData = await scrapeLumaEvent(parsed.data);
    return { data: eventData, success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to preview Luma event.",
      success: false,
    };
  }
}

// ─── Import from Luma ────────────────────────────────────────────────────────

const importLumaSchema = z.string().url("Must be a valid URL.");

export async function importFromLumaAction(url: string): Promise<{
  success: boolean;
  error?: string;
  hackathonId?: string;
}> {
  try {
    const user = await requireAdmin();

    if (!user.id) {
      return { error: "User not found", success: false };
    }

    const parsed = importLumaSchema.safeParse(url);
    if (!parsed.success) {
      console.log(parsed.error.flatten().formErrors[0]);
      return { error: parsed.error.flatten().formErrors[0], success: false };
    }

    const lumaUrl = parsed.data;

    // Scrape the event
    const eventData = await scrapeLumaEvent(lumaUrl);

    // Check if already exists by externalUrl
    const existing = await getHackathonByExternalUrl(lumaUrl);
    if (existing) {
      return {
        error: "This Luma event has already been imported.",
        success: false,
      };
    }

    // Create as draft
    const hackathon = await createHackathon({
      description: eventData.description,
      endDate: eventData.endDate,
      externalId: lumaUrl,
      externalUrl: lumaUrl,
      image: eventData.image,
      isOnline: !eventData.location,
      location: eventData.location ?? "Remote",
      locationMode: eventData.location ? "in_person" : "remote",
      maxParticipants: eventData.participantCount,
      organizerId: user.id,
      requiresApproval: false,
      slug: `${slugify(eventData.title)}-${Date.now()}`,
      source: "luma",
      startDate: eventData.startDate,
      tags: [],
      techs: [],
      title: eventData.title,
    });

    revalidatePath("/admin");
    return { hackathonId: hackathon.id, success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to import Luma event.",
      success: false,
    };
  }
}

// ─── Publish Hackathon ───────────────────────────────────────────────────────

export async function publishHackathonAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    await publishHackathonDAL(id);

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to publish hackathon.",
      success: false,
    };
  } finally {
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/admin/hackathons");
  }
}

// ─── Sync Luma Event ────────────────────────────────────────────────────────

export async function syncLumaEventAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const hackathon = await getAdminHackathon(id);
    if (!hackathon) {
      return { error: "Hackathon not found.", success: false };
    }

    if (!hackathon.externalUrl) {
      return {
        error: "This hackathon has no external URL to sync.",
        success: false,
      };
    }

    const eventData = await scrapeLumaEvent(hackathon.externalUrl);

    await updateHackathon(id, {
      description: eventData.description,
      endDate: eventData.endDate,
      externalId: hackathon.externalUrl,
      externalUrl: hackathon.externalUrl,
      image: eventData.image,
      isOnline: !eventData.location,
      location: eventData.location ?? hackathon.location,
      locationMode: eventData.location ? "in_person" : "remote",
      maxParticipants: eventData.participantCount,
      startDate: eventData.startDate,
      title: eventData.title,
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to sync Luma event.",
      success: false,
    };
  } finally {
    revalidatePath("/admin/hackathons");
  }
}

// ─── Delete Hackathon ───────────────────────────────────────────────────────

export async function deleteHackathonAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    await deleteHackathon(id);

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete hackathon.",
      success: false,
    };
  } finally {
    revalidatePath("/admin/hackathons");
  }
}
