"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const applySchema = z.object({
  answers: z
    .array(
      z.object({
        answer: z.string(),
        questionId: z.string(),
      })
    )
    .optional(),
  message: z.string().optional(),
  teamId: z.string(),
});

export async function applyToTeam(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input", success: false };

  const { teamId, message, answers } = parsed.data;

  const team = await prisma.team.findUnique({
    include: { hackathon: true, members: true },
    where: { id: teamId },
  });
  if (!team) return { error: "Team not found", success: false };
  if (team.members.length >= team.maxMembers)
    return { error: "Team is full", success: false };

  const existing = await prisma.teamApplication.findUnique({
    where: { teamId_userId: { teamId, userId: session.user.id } },
  });
  if (existing)
    return { error: "Already applied to this team", success: false };

  const isMember = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.user.id } },
  });
  if (isMember)
    return { error: "Already a member of this team", success: false };

  await prisma.teamApplication.create({
    data: {
      answers: answers
        ? {
            createMany: {
              data: answers.map((a) => ({
                answer: a.answer,
                questionId: a.questionId,
              })),
            },
          }
        : undefined,
      message,
      teamId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/hackathon/${team.hackathon.slug}/teams`);
  revalidatePath(`/team/${teamId}`);
  return { success: true };
}

const rejectSchema = z.object({
  applicationId: z.string(),
  reason: z.string().optional(),
});

export async function rejectApplication(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const parsed = rejectSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input", success: false };

  const { applicationId, reason } = parsed.data;

  const application = await prisma.teamApplication.findUnique({
    include: {
      team: { select: { hackathonId: true, id: true, ownerId: true } },
    },
    where: { id: applicationId },
  });
  if (!application) return { error: "Application not found", success: false };
  if (application.team.ownerId !== session.user.id)
    return { error: "Unauthorized", success: false };
  if (application.status !== "PENDING")
    return { error: "Application already processed", success: false };

  await prisma.teamApplication.update({
    data: { rejectionReason: reason, status: "REJECTED" },
    where: { id: applicationId },
  });

  revalidatePath(`/teams/${application.team.id}/manage`);
  return { success: true };
}

export async function acceptApplication(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const applicationId = z.string().safeParse(raw);
  if (!applicationId.success) return { error: "Invalid input", success: false };

  const application = await prisma.teamApplication.findUnique({
    include: {
      team: {
        select: {
          hackathonId: true,
          maxMembers: true,
          members: true,
          ownerId: true,
        },
      },
    },
    where: { id: applicationId.data },
  });
  if (!application) return { error: "Application not found", success: false };
  if (application.team.ownerId !== session.user.id)
    return { error: "Unauthorized", success: false };
  if (application.status !== "PENDING")
    return { error: "Application already processed", success: false };
  if (application.team.members.length >= application.team.maxMembers)
    return { error: "Team is full", success: false };

  await prisma.$transaction([
    prisma.teamApplication.update({
      data: { status: "ACCEPTED" },
      where: { id: applicationId.data },
    }),
    prisma.teamMember.create({
      data: {
        teamId: application.teamId,
        userId: application.userId,
      },
    }),
  ]);

  revalidatePath(`/teams/${application.teamId}/manage`);
  return { success: true };
}

export async function cancelApplication(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const applicationId = z.string().safeParse(raw);
  if (!applicationId.success) return { error: "Invalid input", success: false };

  const application = await prisma.teamApplication.findUnique({
    where: { id: applicationId.data },
  });
  if (!application) return { error: "Application not found", success: false };
  if (application.userId !== session.user.id)
    return { error: "Unauthorized", success: false };
  if (application.status !== "PENDING")
    return {
      error: "Can only cancel pending applications",
      success: false,
    };

  await prisma.teamApplication.delete({
    where: { id: applicationId.data },
  });

  revalidatePath("/my-applications");
  return { success: true };
}

export async function joinHackathon(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const hackathonId = z.string().safeParse(raw);
  if (!hackathonId.success) return { error: "Invalid input", success: false };

  // Check if user is the organizer
  const hackathon = await prisma.hackathon.findUnique({
    select: { organizerId: true, requiresApproval: true },
    where: { id: hackathonId.data },
  });
  if (!hackathon) return { error: "Hackathon not found", success: false };

  if (hackathon.organizerId === session.user.id) {
    return {
      error: "You cannot join your own hackathon as a participant",
      success: false,
    };
  }

  const existing = await prisma.hackathonParticipant.findUnique({
    where: {
      userId_hackathonId: {
        hackathonId: hackathonId.data,
        userId: session.user.id,
      },
    },
  });
  if (existing)
    return { error: "Already registered for this hackathon", success: false };

  const status = hackathon.requiresApproval ? "PENDING" : "APPROVED";

  await prisma.hackathonParticipant.create({
    data: {
      hackathonId: hackathonId.data,
      status,
      userId: session.user.id,
    },
  });

  revalidatePath(`/hackathon/${hackathonId.data}`);
  revalidatePath("/my-applications");
  return { success: true };
}

const createTeamSchema = z.object({
  description: z.string().optional(),
  hackathonId: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  questions: z.array(z.string()),
  techs: z.array(z.string()),
});

export async function createTeam(
  raw: unknown
): Promise<{ success: boolean; teamId?: string; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const parsed = createTeamSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  const { name, description, techs, questions, hackathonId } = parsed.data;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
  });
  if (!hackathon) return { error: "Hackathon not found", success: false };

  // Check if user is the organizer
  if (hackathon.organizerId === session.user.id) {
    return {
      error: "You cannot create a team in your own hackathon",
      success: false,
    };
  }

  // Check if user already has a team in this hackathon
  const existingTeam = await prisma.team.findFirst({
    where: {
      hackathonId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });
  if (existingTeam) {
    return {
      error: "You already have a team in this hackathon",
      success: false,
    };
  }

  try {
    const team = await prisma.team.create({
      data: {
        description,
        hackathonId,
        maxMembers: hackathon.maxTeamSize,
        name,
        ownerId: session.user.id,
        techs,
      },
      include: { hackathon: true },
    });

    if (questions.length > 0) {
      await prisma.teamQuestion.createMany({
        data: questions.map((q) => ({ question: q, teamId: team.id })),
      });
    }

    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.user.id,
      },
    });

    revalidatePath(`/hackathon/${team.hackathon.slug}/teams`);
    return { success: true, teamId: team.id };
  } catch (error) {
    console.error("createTeam error:", error);
    return { error: "Failed to create team", success: false };
  }
}

// ─── Update Team ────────────────────────────────────────────────────────────

const updateTeamSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  teamId: z.string(),
  techs: z.array(z.string()).optional(),
});

export async function updateTeam(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized", success: false };

  const parsed = updateTeamSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  const { name, description, techs, teamId } = parsed.data;

  const team = await prisma.team.findUnique({
    include: { hackathon: true },
    where: { id: teamId },
  });
  if (!team) return { error: "Team not found", success: false };
  if (team.ownerId !== session.user.id)
    return { error: "Unauthorized", success: false };

  try {
    await prisma.team.update({
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(techs && { techs }),
      },
      where: { id: teamId },
    });

    revalidatePath(`/hackathon/${team.hackathon.slug}/teams`);
    revalidatePath(`/team/${teamId}`);
    revalidatePath(`/teams/${teamId}/manage`);
    return { success: true };
  } catch (error) {
    console.error("updateTeam error:", error);
    return { error: "Failed to update team", success: false };
  }
}
