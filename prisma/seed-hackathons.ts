/* eslint-disable sort-keys, no-inline-comments, require-await */
import { faker } from "@faker-js/faker";

import { prisma } from "./seed-client";

const HACKATHON_DATA = [
  {
    description:
      "The biggest frontend hackathon of the year. Build with Next.js, v0, and win big prizes!",
    isOnline: true,
    location: "Online",
    maxParticipants: 500,
    maxTeamSize: 4,
    organizerId: "u2",
    participants: ["u1", "u2", "u3", "u4", "u5", "u6"],
    prizes: [
      { place: "1st", amount: 25_000, description: "Grand Prize" },
      { place: "2nd", amount: 10_000, description: "Runner-up" },
      { place: "3rd", amount: 5000, description: "Third Place" },
    ],
    requiresApproval: false,
    slug: "vercel-ship-2026",
    tags: ["Frontend", "Web", "AI", "Next.js"],
    techs: ["Next.js", "TypeScript", "React", "Vercel"],
    title: "Vercel Ship Hackathon 2026",
  },
  {
    description:
      "Build autonomous AI agents that can reason, plan, and act in the world.",
    isOnline: true,
    location: "Online",
    maxParticipants: 2000,
    maxTeamSize: 5,
    organizerId: "u4",
    participants: ["u1", "u3", "u4", "u5", "u6"],
    prizes: [
      { place: "1st", amount: 30_000, description: "Best Agent" },
      { place: "2nd", amount: 15_000, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "ai-agents-hackathon",
    tags: ["AI", "Agents", "LLM", "Automation"],
    techs: ["Python", "TypeScript", "Next.js"],
    title: "AI Agents Global Hackathon",
  },
  {
    description:
      "The premier Ethereum hackathon. Build the future of DeFi and ZK proofs.",
    isOnline: false,
    latitude: 51.5074,
    location: "London, UK",
    longitude: -0.1278,
    maxParticipants: 1000,
    maxTeamSize: 5,
    organizerId: "u8",
    participants: ["u7", "u8"],
    prizes: [
      { place: "1st", amount: 50_000, description: "Best Overall" },
      { place: "2nd", amount: 20_000, description: "Runner Up" },
    ],
    requiresApproval: true,
    slug: "eth-global-london",
    tags: ["Web3", "Ethereum", "DeFi", "ZK"],
    techs: ["Solidity", "TypeScript", "React"],
    title: "ETHGlobal London 2026",
  },
  {
    description: "Build fast, safe software with Rust and WebAssembly.",
    isOnline: false,
    latitude: 40.4406,
    location: "Pittsburgh, PA",
    longitude: -79.9959,
    maxParticipants: 200,
    maxTeamSize: 3,
    organizerId: "u7",
    participants: ["u7"],
    prizes: [
      { place: "1st", amount: 10_000, description: "Grand Prize" },
      { place: "2nd", amount: 5000, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "rust-wasm-hack",
    tags: ["Rust", "WebAssembly", "Systems"],
    techs: ["Rust", "WebAssembly", "TypeScript"],
    title: "Rust & WASM Hackathon",
  },
  {
    description:
      "Build the next generation of design systems - accessible, scalable, beautiful.",
    isOnline: false,
    latitude: 41.3874,
    location: "Barcelona, Spain",
    longitude: 2.1686,
    maxParticipants: 500,
    maxTeamSize: 4,
    organizerId: "u1",
    participants: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"],
    prizes: [
      { place: "1st", amount: 20_000, description: "Best Design System" },
      { place: "2nd", amount: 10_000, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "design-systems-hack",
    tags: ["Design Systems", "UI", "Accessibility"],
    techs: ["React", "Vue", "TypeScript"],
    title: "Design Systems Hackathon 2026",
  },
  {
    description: "Build technology that matters for our planet.",
    isOnline: false,
    latitude: 55.6761,
    location: "Copenhagen, Denmark",
    longitude: 12.5683,
    maxParticipants: 1000,
    maxTeamSize: 5,
    organizerId: "u5",
    participants: ["u5", "u6"],
    prizes: [
      { place: "1st", amount: 40_000, description: "Most Impactful" },
      { place: "2nd", amount: 15_000, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "climate-tech-hack",
    tags: ["Climate", "Sustainability", "Impact"],
    techs: ["Python", "TypeScript", "React"],
    title: "Climate Tech Hackathon",
  },
  {
    description: "Build a game in 72 hours. Any engine, any theme!",
    isOnline: false,
    latitude: 35.6762,
    location: "Tokyo, Japan",
    longitude: 139.6503,
    maxParticipants: 800,
    maxTeamSize: 4,
    organizerId: "u7",
    participants: ["u1", "u7", "u8"],
    prizes: [
      { place: "1st", amount: 5000, description: "Best Game" },
      { place: "2nd", amount: 2500, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "gamedev-jam",
    tags: ["Game Dev", "Creative", "WebGL"],
    techs: ["Three.js", "TypeScript", "Rust"],
    title: "GameDev Jam 2026",
  },
  {
    description:
      "A hackathon celebrating Latin American innovation and builders.",
    isOnline: false,
    latitude: -34.6037,
    location: "Buenos Aires, Argentina",
    longitude: -58.3816,
    maxParticipants: 1200,
    maxTeamSize: 5,
    organizerId: "u9",
    participants: ["u9", "u10"],
    prizes: [
      { place: "1st", amount: 20_000, description: "Best Startup" },
      { place: "2nd", amount: 10_000, description: "Runner Up" },
    ],
    requiresApproval: false,
    slug: "latam-buildathon",
    tags: ["LATAM", "Startup", "Fintech"],
    techs: ["Next.js", "Node.js", "PostgreSQL"],
    title: "LATAM Buildathon 2026",
  },
  {
    description: "Build tools for developers. CLI, observability, and more.",
    isOnline: false,
    latitude: 32.0853,
    location: "Tel Aviv, Israel",
    longitude: 34.7818,
    maxParticipants: 400,
    maxTeamSize: 4,
    organizerId: "u10",
    participants: ["u7", "u10"],
    prizes: [{ place: "1st", amount: 15_000, description: "Best DevTool" }],
    requiresApproval: true,
    slug: "devtools-hack",
    tags: ["DevTools", "CLI", "Infra"],
    techs: ["Go", "Rust", "Node.js"],
    title: "DevTools Hackathon",
  },
  {
    description: "Build tools that give back to the open source community.",
    isOnline: false,
    latitude: 30.2672,
    location: "Austin, TX",
    longitude: -97.7431,
    maxParticipants: 300,
    maxTeamSize: 4,
    organizerId: "u3",
    participants: ["u1", "u3", "u4"],
    prizes: [
      { place: "1st", amount: 15_000, description: "Best OSS Contribution" },
      { place: "2nd", amount: 7500, description: "Runner Up" },
    ],
    requiresApproval: true,
    slug: "open-source-summit",
    tags: ["Open Source", "DevTools", "Community"],
    techs: ["TypeScript", "Go", "Rust"],
    title: "Open Source Summit Hack",
  },
];

function generateUpcomingDates() {
  const now = new Date();
  // Mix of: starting in 2 days, 1 week, 2 weeks, 1 month, 2 months
  const offsets = [
    faker.number.int({ max: 5, min: 2 }), // 2-5 days
    faker.number.int({ max: 14, min: 7 }), // 1-2 weeks
    faker.number.int({ max: 30, min: 14 }), // 2 weeks - 1 month
    faker.number.int({ max: 60, min: 30 }), // 1-2 months
    faker.number.int({ max: 90, min: 60 }), // 2-3 months
  ];

  return offsets.map((daysOffset) => {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + daysOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ max: 3, min: 2 })); // 2-3 day hackathon

    return { endDate, startDate };
  });
}

export async function seedHackathons() {
  console.log("🌱 Seeding hackathons...");

  const dateSets = generateUpcomingDates();

  const hackathons = await Promise.all(
    HACKATHON_DATA.map(async (hack, index) => {
      const dates = dateSets[index % dateSets.length];
      const status =
        index === 0
          ? "LIVE"
          : dates.startDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
            ? "LIVE"
            : "UPCOMING";

      return prisma.hackathon.create({
        data: {
          description: hack.description,
          endDate: dates.endDate,
          id: hack.slug,
          image: "/placeholder.svg?height=400&width=800",
          isOnline: hack.isOnline,
          latitude: hack.latitude ?? null,
          location: hack.location,
          locationMode: hack.isOnline ? "remote" : "in_person",
          longitude: hack.longitude ?? null,
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
          startDate: dates.startDate,
          status: status as "UPCOMING" | "LIVE",
          tags: hack.tags,
          techs: hack.techs,
          title: hack.title,
        },
      });
    })
  );

  console.log(`✅ Seeded ${hackathons.length} hackathons`);

  // Seed participants
  console.log("🌱 Seeding hackathon participants...");
  const participants = await prisma.hackathonParticipant.createManyAndReturn({
    data: HACKATHON_DATA.flatMap((hack) =>
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
