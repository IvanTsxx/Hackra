"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

import { HackathonStatus } from "@/app/generated/prisma/enums";
import { createHackathon, findSimilarHackathons } from "@/data/admin-hackatons";
import type { CreateHackathonDTO } from "@/data/admin-hackatons";
import { karmaForCreateHackathon } from "@/shared/actions/karma";
import { auth } from "@/shared/lib/auth";
import type { LumaEventData } from "@/shared/lib/luma-scraper";
import type { SimilarHackathon } from "@/shared/lib/similarity";
import { createHackathonSchema } from "@/shared/lib/validation";

// ─── Helper ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/[\s_]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

// ─── Server Action ───────────────────────────────────────────────────────────

export async function createHackathonAction(raw: unknown): Promise<{
  success: boolean;
  error?: string;
  similarHackathons?: SimilarHackathon[];
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to create a hackathon.",
      success: false,
    };
  }

  const parsed = createHackathonSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.title?.[0] ?? "Invalid form data.",
      success: false,
    };
  }

  const { data } = parsed;

  // Check for required fields (now flexible - user can fill later)
  const missingFields: string[] = [];
  if (!data.title?.trim()) missingFields.push("title");
  if (!data.description?.trim()) missingFields.push("description");
  if (!data.location?.trim()) missingFields.push("location");

  // Determine status based on isPublished flag and dates
  const now = new Date();
  const hasDates = data.startDate && data.endDate;
  // Only set LIVE/UPCOMING if dates exist and published, otherwise DRAFT
  let status: HackathonStatus = HackathonStatus.DRAFT;
  if (data.isPublished && hasDates && data.startDate && data.endDate) {
    status =
      data.startDate <= now ? HackathonStatus.LIVE : HackathonStatus.UPCOMING;
  }

  // Validate end date is after start date (if both provided)
  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    return { error: "End date must be after start date.", success: false };
  }

  // If key fields are missing, return info about what to fill
  if (missingFields.length > 0) {
    return {
      error: `Please fill in: ${missingFields.join(", ")}`,
      success: false,
    };
  }

  // Check for duplicate hackathons (title match or description similarity)
  const similar = await findSimilarHackathons(
    data.title ?? "",
    data.description ?? ""
  );
  if (similar.length > 0) {
    return {
      error: "Ya existe un hackathon con un título o descripción similares.",
      similarHackathons: similar,
      success: false,
    };
  }

  const dto: CreateHackathonDTO = {
    description: data.description ?? "",
    endDate: data.endDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    externalId: data.externalId,
    externalUrl: data.externalUrl,
    image: data.image,
    isOnline: data.locationMode === "remote",
    location: data.location ?? "",
    locationMode: data.locationMode,
    maxParticipants: data.maxParticipants,
    maxTeamSize: data.maxTeamSize,
    organizerId: session.user.id,
    requiresApproval: data.requiresApproval,
    slug: `${slugify(data.title ?? "hackathon")}-${Date.now()}`,
    source: data.source ?? "manual",
    startDate: data.startDate ?? new Date(),
    status,
    tags: data.tags,
    techs: data.techs,
    title: data.title ?? "",
  };

  try {
    await createHackathon(dto);
    // Give karma to organizer
    await karmaForCreateHackathon(session.user.id);
    revalidatePath("/");
    revalidatePath("/explore");
    return { success: true };
  } catch {
    return {
      error: "Failed to create hackathon. Please try again.",
      success: false,
    };
  }
}

// ─── Preview Luma ────────────────────────────────────────────────────────────

const previewLumaSchema = z.string().url("Must be a valid URL.");

export async function previewLumaAction(url: string): Promise<{
  success: boolean;
  data?: LumaEventData;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    const parsed = previewLumaSchema.safeParse(url);
    if (!parsed.success) {
      return { error: parsed.error.flatten().formErrors[0], success: false };
    }

    const { scrapeLumaEvent } = await import("@/shared/lib/luma-scraper");
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

// ─── Import Luma Form Data ───────────────────────────────────────────────────

export async function importLumaFormDataAction(url: string): Promise<{
  success: boolean;
  data?: {
    title: string;
    description: string;
    image?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    locationMode: "remote" | "in_person" | "hybrid";
    requiresApproval: boolean;
    tags?: string[];
    techs?: string[];
    prizes?: { amount: string; description: string }[];
    externalId?: string;
    externalUrl?: string;
  };
  missingFields?: string[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    const parsed = previewLumaSchema.safeParse(url);
    if (!parsed.success) {
      return { error: parsed.error.flatten().formErrors[0], success: false };
    }

    const { scrapeLumaEvent } = await import("@/shared/lib/luma-scraper");
    const eventData = await scrapeLumaEvent(parsed.data);

    // Determine which required fields are missing and need user input
    const missingFields: string[] = [];
    if (!eventData.startDate) missingFields.push("startDate");
    if (!eventData.endDate) missingFields.push("endDate");
    if (!eventData.location) missingFields.push("location");

    return {
      data: {
        description: eventData.description,
        endDate: eventData.endDate,
        externalId: eventData.externalId,
        externalUrl: eventData.externalUrl,
        image: eventData.image,
        location: eventData.location,

        locationMode: eventData.locationMode ?? "in_person",

        prizes: eventData.prizes,

        requiresApproval: eventData.isFull ?? false,
        startDate: eventData.startDate,
        tags: eventData.tags,
        techs: eventData.techs,
        title: eventData.title,
      },

      missingFields: missingFields.length > 0 ? missingFields : undefined,
      success: true,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to import Luma event data.",
      success: false,
    };
  }
}

// ─── Duplicate Check ─────────────────────────────────────────────────────────

export async function checkDuplicateHackathonAction(raw: {
  title: string;
  description: string;
}): Promise<{
  isDuplicate: boolean;
  similarHackathons: SimilarHackathon[];
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { isDuplicate: false, similarHackathons: [] };
  }

  try {
    const similar = await findSimilarHackathons(raw.title, raw.description);
    return {
      isDuplicate: similar.length > 0,
      similarHackathons: similar,
    };
  } catch {
    // If the check fails, allow creation to proceed
    return { isDuplicate: false, similarHackathons: [] };
  }
}
