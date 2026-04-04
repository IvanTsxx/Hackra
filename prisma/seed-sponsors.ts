import { HACKATHONS, SPONSORS } from "../shared/lib/mock-data";
import { prisma } from "./seed-client";

export async function seedSponsors() {
  console.log("🌱 Seeding sponsors...");

  const sponsors = await prisma.sponsor.createManyAndReturn({
    data: SPONSORS.map((sponsor) => ({
      description: sponsor.description,
      logo: sponsor.logo,
      name: sponsor.name,
      tier: sponsor.tier,
      url: sponsor.url,
    })),
  });

  // Build a map from mock sponsor ID to created sponsor record
  const sponsorIdMap = new Map<string, (typeof sponsors)[number]>();
  SPONSORS.forEach((mock, index) => {
    sponsorIdMap.set(mock.id, sponsors[index]);
  });

  console.log(`✅ Seeded ${sponsors.length} sponsors`);

  // Seed hackathon sponsors
  console.log("🌱 Seeding hackathon sponsors...");
  const hackathonSponsors = await prisma.hackathonSponsor.createManyAndReturn({
    data: HACKATHONS.flatMap((hack) =>
      hack.sponsors.map((sponsorMockId) => {
        const sponsor = sponsorIdMap.get(sponsorMockId);
        if (!sponsor) {
          throw new Error(
            `Sponsor "${sponsorMockId}" not found for hackathon "${hack.slug}"`
          );
        }
        return {
          hackathonId: hack.slug,
          sponsorId: sponsor.id,
        };
      })
    ),
  });

  console.log(`✅ Seeded ${hackathonSponsors.length} hackathon sponsors`);
  return { hackathonSponsors, sponsorIdMap, sponsors };
}
