import { SPONSORS } from "../shared/lib/mock-data";
import { prisma } from "./seed-client";

const HACKATHON_SLUGS = [
  "vercel-ship-2026",
  "ai-agents-hackathon",
  "eth-global-london",
  "rust-wasm-hack",
  "design-systems-hack",
  "climate-tech-hack",
  "gamedev-jam",
  "latam-buildathon",
  "devtools-hack",
  "open-source-summit",
];

const SPONSOR_SLUGS = [
  "vercel",
  "supabase",
  "cloudflare",
  "convex",
  "neon",
  "liveblocks",
  "upstash",
];

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

  // Build a map from index to created sponsor
  const sponsorMap = new Map<number, (typeof sponsors)[number]>();
  sponsors.forEach((sponsor, index) => {
    sponsorMap.set(index, sponsor);
  });

  console.log(`✅ Seeded ${sponsors.length} sponsors`);

  // Seed hackathon sponsors (associate some sponsors with some hackathons)
  console.log("🌱 Seeding hackathon sponsors...");
  const hackathonSponsors = await prisma.hackathonSponsor.createManyAndReturn({
    data: HACKATHON_SLUGS.flatMap((hackSlug, hackIndex) => {
      // Associate 2-3 random sponsors per hackathon
      const numSponsors = 2 + (hackIndex % 3);
      return Array.from({ length: numSponsors }, (_, i) => {
        const sponsorIndex = (hackIndex * 3 + i) % SPONSOR_SLUGS.length;
        return {
          hackathonId: hackSlug,
          sponsorId: sponsors[sponsorIndex]?.id ?? sponsors[0].id,
        };
      });
    }),
  });

  console.log(`✅ Seeded ${hackathonSponsors.length} hackathon sponsors`);
  return { hackathonSponsors, sponsorMap, sponsors };
}
