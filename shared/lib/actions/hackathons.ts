"use server";

import "server-only";
import { eq, desc, and, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hackathons, participants, organizers } from "@/lib/db/schema";

export async function getHackathons() {
  const result = await db
    .select({
      accentColor: hackathons.accentColor,
      coverImage: hackathons.coverImage,
      description: hackathons.description,
      endDate: hackathons.endDate,
      id: hackathons.id,
      isVirtual: hackathons.isVirtual,
      location: hackathons.location,
      maxParticipants: hackathons.maxParticipants,
      participantCount: sql<number>`(
        SELECT COUNT(*) FROM participants 
        WHERE participants.hackathon_id = ${hackathons.id}
      )`.as("participant_count"),
      published: hackathons.published,
      slug: hackathons.slug,
      startDate: hackathons.startDate,
      title: hackathons.title,
    })
    .from(hackathons)
    .where(eq(hackathons.published, true))
    .orderBy(desc(hackathons.startDate));

  return result;
}

export async function getHackathonBySlug(slug: string) {
  const [hackathon] = await db
    .select()
    .from(hackathons)
    .where(eq(hackathons.slug, slug))
    .limit(1);

  if (!hackathon) return null;

  const [participantCountResult] = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.hackathonId, hackathon.id));

  return {
    ...hackathon,
    participantCount: participantCountResult?.count ?? 0,
  };
}

export async function getHackathonById(id: string) {
  const [hackathon] = await db
    .select()
    .from(hackathons)
    .where(eq(hackathons.id, id))
    .limit(1);

  if (!hackathon) return null;

  const [participantCountResult] = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.hackathonId, hackathon.id));

  return {
    ...hackathon,
    participantCount: participantCountResult?.count ?? 0,
  };
}

export async function getFeaturedHackathon() {
  const result = await db
    .select({
      description: hackathons.description,
      id: hackathons.id,
      location: hackathons.location,
      maxParticipants: hackathons.maxParticipants,
      participantCount: sql<number>`(
        SELECT COUNT(*) FROM participants 
        WHERE participants.hackathon_id = ${hackathons.id}
      )`.as("participant_count"),
      slug: hackathons.slug,
      startDate: hackathons.startDate,
      title: hackathons.title,
    })
    .from(hackathons)
    .where(eq(hackathons.published, true))
    .orderBy(desc(hackathons.startDate))
    .limit(1);

  return result[0] || null;
}

export async function getOrganizerHackathons() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select({
      description: hackathons.description,
      endDate: hackathons.endDate,
      id: hackathons.id,
      location: hackathons.location,
      maxParticipants: hackathons.maxParticipants,
      participantCount: sql<number>`(
        SELECT COUNT(*) FROM participants 
        WHERE participants.hackathon_id = ${hackathons.id}
      )`.as("participant_count"),
      published: hackathons.published,
      slug: hackathons.slug,
      startDate: hackathons.startDate,
      title: hackathons.title,
    })
    .from(hackathons)
    .innerJoin(organizers, eq(organizers.hackathonId, hackathons.id))
    .where(eq(organizers.userId, session.user.id))
    .orderBy(desc(hackathons.createdAt));

  return result;
}

export async function createHackathon(data: {
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  location?: string;
  isVirtual?: boolean;
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  maxParticipants?: number;
  accentColor?: string;
  requirements?: string[];
  technologies?: string[];
  prizes?: { place: string; prize: string }[];
  coverImage?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized", success: false };
  }

  const [newHackathon] = await db
    .insert(hackathons)
    .values({
      accentColor: data.accentColor || "#3b82f6",
      coverImage: data.coverImage,
      description: data.description,
      endDate: data.endDate,
      isVirtual: data.isVirtual,
      location: data.location,
      longDescription: data.longDescription,
      maxParticipants: data.maxParticipants || 100,
      prizes: data.prizes || [],
      registrationDeadline: data.registrationDeadline,
      requirements: data.requirements || [],
      slug: data.slug,
      startDate: data.startDate,
      technologies: data.technologies || [],
      title: data.title,
    })
    .returning();

  await db.insert(organizers).values({
    hackathonId: newHackathon.id,
    role: "organizer",
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  revalidatePath("/hackathons");

  return { data: newHackathon, success: true };
}

export async function updateHackathon(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    location: string;
    isVirtual: boolean;
    startDate: Date;
    endDate: Date;
    registrationDeadline: Date;
    maxParticipants: number;
    published: boolean;
    accentColor: string;
    coverImage: string;
    requirements: string[];
    technologies: string[];
    prizes: { place: string; prize: string }[];
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if user is an organizer
  const [isOrganizer] = await db
    .select()
    .from(organizers)
    .where(
      and(
        eq(organizers.hackathonId, id),
        eq(organizers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!isOrganizer) {
    throw new Error("Not authorized to edit this hackathon");
  }

  const [updated] = await db
    .update(hackathons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(hackathons.id, id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/hackathons");
  revalidatePath(`/hackathons/${updated.slug}`);

  return updated;
}

export async function deleteHackathon(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [isOrganizer] = await db
    .select()
    .from(organizers)
    .where(
      and(
        eq(organizers.hackathonId, id),
        eq(organizers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!isOrganizer) {
    throw new Error("Not authorized to delete this hackathon");
  }

  await db.delete(hackathons).where(eq(hackathons.id, id));

  revalidatePath("/dashboard");
  revalidatePath("/hackathons");
}

export async function registerForHackathon(hackathonId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Please sign in to register");
  }

  // Check if already registered
  const [existing] = await db
    .select()
    .from(participants)
    .where(
      and(
        eq(participants.hackathonId, hackathonId),
        eq(participants.userId, session.user.id)
      )
    )
    .limit(1);

  if (existing) {
    throw new Error("Already registered for this hackathon");
  }

  const [participant] = await db
    .insert(participants)
    .values({
      hackathonId,
      status: "registered",
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/hackathons");

  return participant;
}
