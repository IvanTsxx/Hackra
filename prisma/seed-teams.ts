import { TEAMS } from "../shared/lib/mock-data";
import { prisma } from "./seed-client";

export async function seedTeams() {
  console.log("🌱 Seeding teams, members, questions, and applications...");

  const createdTeams: string[] = [];
  const questionIdMap = new Map<string, string>();

  for (const team of TEAMS) {
    // Create the team
    const createdTeam = await prisma.team.create({
      data: {
        description: team.description,
        hackathon: {
          connect: { slug: team.hackathonSlug },
        },
        id: team.id,
        maxMembers: team.maxMembers,
        name: team.name,
        owner: {
          connect: { id: team.members[0].userId },
        },
        technologies: team.techs,
      },
    });

    createdTeams.push(createdTeam.id);

    // Create team members
    await prisma.teamMember.createManyAndReturn({
      data: team.members.map((member) => ({
        joinedAt: new Date(member.joinedAt),
        teamId: createdTeam.id,
        userId: member.userId,
      })),
    });

    // Create team questions
    const questions = await prisma.teamQuestion.createManyAndReturn({
      data: team.questions.map((question) => ({
        question,
        teamId: createdTeam.id,
      })),
    });

    // Build a map from question text to question ID for this team
    for (const q of questions) {
      questionIdMap.set(`${createdTeam.id}:${q.question}`, q.id);
    }

    // Create team applications with answers
    for (const applicant of team.applicants) {
      const application = await prisma.teamApplication.create({
        data: {
          createdAt: new Date(applicant.appliedAt),
          message: applicant.message,
          status: mapApplicationStatus(applicant.status),
          teamId: createdTeam.id,
          userId: applicant.userId,
        },
      });

      // Create application answers
      for (const qa of applicant.answers) {
        const questionId = questionIdMap.get(
          `${createdTeam.id}:${qa.question}`
        );
        if (!questionId) {
          console.warn(
            `⚠️  Question not found for answer: "${qa.question}" in team "${team.name}"`
          );
          continue;
        }

        await prisma.teamApplicationAnswer.create({
          data: {
            answer: qa.answer,
            applicationId: application.id,
            questionId,
          },
        });
      }
    }
  }

  console.log(`✅ Seeded ${createdTeams.length} teams`);
  return createdTeams;
}

function mapApplicationStatus(
  status: "pending" | "accepted" | "rejected"
): "PENDING" | "ACCEPTED" | "REJECTED" {
  switch (status) {
    case "pending": {
      return "PENDING";
    }
    case "accepted": {
      return "ACCEPTED";
    }
    case "rejected": {
      return "REJECTED";
    }
    default: {
      return "PENDING";
    }
  }
}
