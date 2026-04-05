"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

import { createHackathon } from "@/data/admin-hackatons";
import type { CreateHackathonDTO } from "@/data/admin-hackatons";
import { auth } from "@/shared/lib/auth";
import type { LumaEventData } from "@/shared/lib/luma-scraper";
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

  // Validate end date is after start date
  if (data.endDate <= data.startDate) {
    return { error: "End date must be after start date.", success: false };
  }

  const dto: CreateHackathonDTO = {
    description: data.description,
    endDate: data.endDate,
    externalId: undefined,
    externalUrl: undefined,
    image: data.image,
    isOnline: data.locationMode === "remote",
    location: data.location ?? "",
    locationMode: data.locationMode,
    maxParticipants: data.maxParticipants,
    maxTeamSize: data.maxTeamSize,
    organizerId: session.user.id,
    requiresApproval: data.requiresApproval,
    slug: `${slugify(data.title)}-${Date.now()}`,
    source: "manual",
    startDate: data.startDate,
    tags: data.tags,
    techs: data.techs,
    themeBg: data.themeBg,
    themeGradient: data.themeGradient,
    themeStyle: data.themeStyle,
    title: data.title,
  };

  try {
    await createHackathon(dto);
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
    startDate: Date;
    endDate: Date;
    location?: string;
    maxParticipants?: number;
    locationMode: "remote" | "in_person";
  };
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

    return {
      data: {
        description: eventData.description,
        endDate: eventData.endDate,
        image: eventData.image,
        location: eventData.location,
        locationMode: eventData.location ? "in_person" : "remote",
        maxParticipants: eventData.participantCount,
        startDate: eventData.startDate,
        title: eventData.title,
      },
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
