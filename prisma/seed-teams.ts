/* eslint-disable sort-keys, no-inline-comments */
import { prisma } from "./seed-client";

const TEAM_DATA = [
  {
    hackathonSlug: "vercel-ship-2026",
    name: "Zero Config",
    description:
      "Building the next generation of zero-config deployment tools.",
    techs: ["Next.js", "TypeScript", "Vercel"],
    ownerId: "u2",
    members: ["u2", "u3"],
    maxMembers: 4,
  },
  {
    hackathonSlug: "ai-agents-hackathon",
    name: "AgentForge",
    description: "Forging autonomous AI agents that can reason and act.",
    techs: ["Python", "TypeScript", "Next.js"],
    ownerId: "u4",
    members: ["u4", "u3", "u5"],
    maxMembers: 5,
  },
  {
    hackathonSlug: "eth-global-london",
    name: "ZK Builders",
    description: "Building privacy-preserving voting systems on Ethereum.",
    techs: ["Solidity", "TypeScript", "React"],
    ownerId: "u8",
    members: ["u8", "u7"],
    maxMembers: 4,
  },
  {
    hackathonSlug: "rust-wasm-hack",
    name: "Ferris Wheel",
    description: "Bringing the performance of Rust to the web.",
    techs: ["Rust", "WebAssembly", "TypeScript"],
    ownerId: "u7",
    members: ["u7"],
    maxMembers: 3,
  },
  {
    hackathonSlug: "design-systems-hack",
    name: "Component Lib",
    description: "Building beautiful, accessible component libraries.",
    techs: ["React", "TypeScript", "Tailwind CSS"],
    ownerId: "u1",
    members: ["u1", "u2"],
    maxMembers: 4,
  },
];

export async function seedTeams() {
  console.log("🌱 Seeding teams, members, questions, and applications...");

  const createdTeams: string[] = [];

  for (const team of TEAM_DATA) {
    const createdTeam = await prisma.team.create({
      data: {
        description: team.description,
        hackathon: {
          connect: { slug: team.hackathonSlug },
        },
        id: `team-${team.hackathonSlug}`,
        maxMembers: team.maxMembers,
        name: team.name,
        owner: {
          connect: { id: team.ownerId },
        },
        techs: team.techs,
      },
    });

    createdTeams.push(createdTeam.id);

    await prisma.teamMember.createManyAndReturn({
      data: team.members.map((userId, index) => ({
        joinedAt: new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000),
        teamId: createdTeam.id,
        userId,
      })),
    });
  }

  console.log(`✅ Seeded ${createdTeams.length} teams`);
  return createdTeams;
}
