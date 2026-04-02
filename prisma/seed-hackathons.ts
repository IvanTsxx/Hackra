import { HACKATHONS } from "../shared/lib/mock-data";
import { prisma } from "./seed-client";

export async function seedHackathons() {
  console.log("🌱 Seeding hackathons...");

  const hackathons = await Promise.all(
    HACKATHONS.map(
      async (hack) =>
        await prisma.hackathon.create({
          data: {
            description: hack.description,
            endDate: new Date(hack.endDate),
            id: hack.slug,
            image: hack.image,
            isOnline: hack.isOnline,
            location: hack.location,
            locationMode: hack.location === "Online" ? "remote" : "in_person",
            maxParticipants: hack.maxParticipants,
            maxTeamSize: hack.maxTeamSize,
            organizerId: hack.organizerId,
            prizes: {
              create: hack.prizes.map((prize, idx) => ({
                amount: prize.amount,
                description: prize.description,
                place: prize.place,
                sortOrder: idx,
              })),
            },
            requiresApproval: hack.requiresApproval,
            slug: hack.slug,
            startDate: new Date(hack.startDate),
            status: mapHackathonStatus(hack.status),
            tags: hack.tags,
            techs: hack.techs,
            themeBg: hack.theme.bg,
            themeGradient: hack.theme.gradient,
            themeStyle: hack.theme.style,
            title: hack.title,
          },
        })
    )
  );

  console.log(`✅ Seeded ${hackathons.length} hackathons`);

  // Seed participants for each hackathon
  console.log("🌱 Seeding hackathon participants...");
  const participants = await prisma.hackathonParticipant.createManyAndReturn({
    data: HACKATHONS.flatMap((hack) =>
      hack.participants.map((userId) => ({
        hackathonId: hack.slug,
        status: "APPROVED" as const,
        userId,
      }))
    ),
  });

  console.log(`✅ Seeded ${participants.length} hackathon participants`);
  return { hackathons, participants };
}

function mapHackathonStatus(
  status: "upcoming" | "live" | "ended"
): "UPCOMING" | "LIVE" | "ENDED" {
  switch (status) {
    case "upcoming": {
      return "UPCOMING";
    }
    case "live": {
      return "LIVE";
    }
    case "ended": {
      return "ENDED";
    }
    default: {
      return "UPCOMING";
    }
  }
}
