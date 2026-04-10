"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less.").optional(),
  githubUsername: z.string().max(39).optional(),
  location: z.string().max(100).optional(),
  name: z.string().min(1, "Name is required."),
  position: z.string().max(100).optional(),
  techStack: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileUpdateResult =
  | { success: true; message: string }
  | { success: false; message: string; errors?: Record<string, string> };

export async function updateProfile(
  raw: FormData
): Promise<ProfileUpdateResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { message: "Not authenticated.", success: false };
  }

  const data = {
    bio: (raw.get("bio") as string) || undefined,
    githubUsername: (raw.get("githubUsername") as string) || undefined,
    location: (raw.get("location") as string) || undefined,
    name: raw.get("name") as string,
    position: (raw.get("position") as string) || undefined,
    techStack: raw.getAll("techStack") as string[],
  };

  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const err of parsed.error.issues) {
      const [path] = err.path;
      if (typeof path === "string") errors[path] = err.message;
    }
    return { errors, message: "Validation failed.", success: false };
  }

  try {
    await prisma.user.update({
      data: {
        bio: parsed.data.bio ?? null,
        githubUsername: parsed.data.githubUsername ?? null,
        location: parsed.data.location ?? null,
        name: parsed.data.name,
        position: parsed.data.position ?? null,
        techStack: parsed.data.techStack,
      },
      where: { id: session.user.id },
    });

    revalidatePath("/settings/profile");
    revalidatePath("/user/[username]", "page");

    return { message: "Profile updated.", success: true };
  } catch {
    return { message: "Failed to update profile.", success: false };
  }
}
