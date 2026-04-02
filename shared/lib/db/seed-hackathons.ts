import { HACKATHONS } from "../mock-data";
import { prisma } from "../prisma";

export async function seedHackathons() {
  console.log("🌱 Seeding hackathons...");

  // Clear existing hackathons (cascade will handle related records)
  await prisma.hackathon.deleteMany();

  const hackathons = await Promise.all(
    HACKATHONS.map(async (hack) => {
      const prizePool = generatePrizePool(hack.prizes);

      return await prisma.hackathon.create({
        data: {
          capacity: hack.maxParticipants,
          description: hack.description,
          endDate: new Date(hack.endDate),
          id: hack.slug,
          image: hack.image,
          location: hack.location,
          maxTeamMembers: hack.maxTeamSize,
          organizerId: hack.organizerId,
          prizePool,
          requiresApproval: hack.requiresApproval,
          slug: hack.slug,
          startDate: new Date(hack.startDate),
          tags: hack.tags,
          technologies: hack.techs,
          themeColor: hack.theme.bg,
          themeCustomClass: hack.theme.style,
          themeGradient: hack.theme.gradient,
          title: hack.title,
        },
      });
    })
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

function generatePrizePool(
  prizes: { place: string; amount: string; description: string }[]
): string | undefined {
  if (prizes.length === 0) return undefined;
  const firstPrize = prizes[0].amount;
  return `${firstPrize}+`;
}
