import { Tier } from "@/app/generated/prisma/enums";

export type Tech =
  | "Next.js"
  | "React"
  | "TypeScript"
  | "Tailwind CSS"
  | "Node.js"
  | "Python"
  | "Rust"
  | "Go"
  | "Solidity"
  | "PostgreSQL"
  | "MongoDB"
  | "Redis"
  | "AI"
  | "LLM"
  | "v0"
  | "Vercel"
  | "Web3"
  | "Blockchain"
  | "DeFi"
  | "NFT"
  | "DAO"
  | "Docker"
  | "Kubernetes"
  | "AWS"
  | "Supabase"
  | "GraphQL"
  | "WebAssembly"
  | "Three.js"
  | "Vue"
  | "Svelte"
  | "Bun";

export type HackathonStatus = "upcoming" | "live" | "ended";

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  description: string;
  tier: Tier;
  url: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  techs: Tech[];
  karma: number;
  hackathonsJoined: number;
  hackathonsCreated: number;
  teamsCreated: number;
  githubUsername?: string;
  location: string;
}

export interface TeamMember {
  userId: string;
  role: "owner" | "member";
  joinedAt: string;
}

export interface TeamApplicant {
  userId: string;
  answers: { question: string; answer: string }[];
  message: string;
  appliedAt: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Team {
  id: string;
  hackathonSlug: string;
  name: string;
  description?: string;
  techs: Tech[];
  maxMembers: number;
  members: TeamMember[];
  applicants: TeamApplicant[];
  questions: string[];
  createdAt: string;
}

export interface Prize {
  place: string;
  amount: number;
  description: string;
}

export interface Hackathon {
  slug: string;
  title: string;
  description: string;
  image?: string;
  status: HackathonStatus;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  tags: string[];
  techs: Tech[];
  maxParticipants: number;
  participants: string[];
  teams: string[];
  sponsors: string[];
  prizes: Prize[];
  organizerId: string;
  requiresApproval: boolean;
  maxTeamSize: number;
}

// ─── SPONSORS ─────────────────────────────────────────────────────────────────

export const SPONSORS: Sponsor[] = [
  {
    description:
      "Build and deploy the best Web experiences with The Frontend Cloud.",
    id: "vercel",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Vercel",
    tier: Tier.PLATINUM,
    url: "https://vercel.com",
  },
  {
    description:
      "The open-source Firebase alternative. Build in a weekend, scale to millions.",
    id: "supabase",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Supabase",
    tier: Tier.PLATINUM,
    url: "https://supabase.com",
  },
  {
    description:
      "Help build a better Internet. Protect and accelerate your websites.",
    id: "cloudflare",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Cloudflare",
    tier: Tier.GOLD,
    url: "https://cloudflare.com",
  },
  {
    description: "The world's most advanced serverless MySQL platform.",
    id: "planetscale",
    logo: "/placeholder.svg?height=40&width=120",
    name: "PlanetScale",
    tier: Tier.GOLD,
    url: "https://planetscale.com",
  },
  {
    description:
      "Collaborative experiences for your product, in a few lines of code.",
    id: "liveblocks",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Liveblocks",
    tier: Tier.SILVER,
    url: "https://liveblocks.io",
  },
  {
    description:
      "The fullstack TypeScript development platform. Ship fullstack apps in hours.",
    id: "convex",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Convex",
    tier: Tier.SILVER,
    url: "https://convex.dev",
  },
  {
    description: "Serverless Postgres. The database that scales to zero.",
    id: "neon",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Neon",
    tier: Tier.BRONZE,
    url: "https://neon.tech",
  },
  {
    description: "Serverless Redis for the edge. Low latency, pay per request.",
    id: "upstash",
    logo: "/placeholder.svg?height=40&width=120",
    name: "Upstash",
    tier: Tier.BRONZE,
    url: "https://upstash.com",
  },
];

export const USERS: User[] = [
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Founding Designer at Vercel. Building the future of web development tooling.",
    githubUsername: "evilrabbit",
    hackathonsCreated: 1,
    hackathonsJoined: 12,
    id: "u1",
    karma: 4200,
    location: "San Francisco, CA",
    name: "Evil Rabbit",
    role: "Founding Designer",
    teamsCreated: 5,
    techs: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Vercel"],
    username: "evilrabbit",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building Vercel. Previously Socket.io, Now.sh.",
    githubUsername: "rauchg",
    hackathonsCreated: 1,
    hackathonsJoined: 3,
    id: "u2",
    karma: 9800,
    location: "San Francisco, CA",
    name: "Guillermo Rauch",
    role: "CEO",
    teamsCreated: 2,
    techs: ["Next.js", "Node.js", "TypeScript", "React", "Vercel"],
    username: "rauchg",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building beautiful component systems with Tailwind CSS and Radix UI.",
    githubUsername: "shadcn",
    hackathonsCreated: 1,
    hackathonsJoined: 8,
    id: "u3",
    karma: 7600,
    location: "Remote",
    name: "shadcn",
    role: "Full-stack Developer",
    teamsCreated: 3,
    techs: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Supabase"],
    username: "shadcn",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "VP of Product at Vercel. Writing about Next.js, React, and web development.",
    githubUsername: "leerob",
    hackathonsCreated: 1,
    hackathonsJoined: 6,
    id: "u4",
    karma: 5300,
    location: "Houston, TX",
    name: "Lee Robinson",
    role: "VP of Product",
    teamsCreated: 2,
    techs: ["Next.js", "TypeScript", "React", "PostgreSQL", "Vercel"],
    username: "leerob",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Developer Experience at Vercel. Making developers happy.",
    githubUsername: "delbaoliveira",
    hackathonsCreated: 1,
    hackathonsJoined: 5,
    id: "u5",
    karma: 3800,
    location: "London, UK",
    name: "Delba de Oliveira",
    role: "Developer Advocate",
    teamsCreated: 1,
    techs: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    username: "delba",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building Ember.js apps, teaching React. Host of Frontend First podcast.",
    githubUsername: "samselikoff",
    hackathonsCreated: 0,
    hackathonsJoined: 4,
    id: "u6",
    karma: 2900,
    location: "New York, NY",
    name: "Sam Selikoff",
    role: "Frontend Developer",
    teamsCreated: 2,
    techs: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    username: "samselikoff",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building distributed systems. Passionate about Go, Rust, and observability.",
    githubUsername: "codehiker",
    hackathonsCreated: 2,
    hackathonsJoined: 9,
    id: "u7",
    karma: 1800,
    location: "Austin, TX",
    name: "Alex Rivera",
    role: "Backend Engineer",
    teamsCreated: 4,
    techs: ["Go", "Rust", "PostgreSQL", "Redis", "Docker"],
    username: "codehiker",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building on Ethereum. ZK proofs, DeFi protocols, and smart contracts.",
    githubUsername: "zkdev",
    hackathonsCreated: 1,
    hackathonsJoined: 7,
    id: "u8",
    karma: 3200,
    location: "Singapore",
    name: "Mia Chen",
    role: "Blockchain Developer",
    teamsCreated: 3,
    techs: ["Solidity", "TypeScript", "React", "Node.js"],
    username: "zkdev",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Building LLM-powered products and experimenting with agents.",
    githubUsername: "lucasai",
    hackathonsCreated: 1,
    hackathonsJoined: 10,
    id: "u9",
    karma: 2700,
    location: "São Paulo, BR",
    name: "Lucas Pereira",
    role: "AI Engineer",
    teamsCreated: 3,
    techs: ["Python", "TypeScript", "Next.js", "Supabase"],
    username: "aiwizard",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "CI/CD, infra as code, Kubernetes nerd.",
    githubUsername: "sofidevops",
    hackathonsCreated: 0,
    hackathonsJoined: 6,
    id: "u10",
    karma: 3100,
    location: "Buenos Aires, AR",
    name: "Sofia Martínez",
    role: "DevOps Engineer",
    teamsCreated: 2,
    techs: ["Docker", "Kubernetes", "AWS", "Go"],
    username: "devopsqueen",
  },
  {
    avatar: "/placeholder.svg?height=64&width=64",
    bio: "Designing intuitive UX for dev tools and SaaS.",
    hackathonsCreated: 0,
    hackathonsJoined: 4,
    id: "u11",
    karma: 1900,
    location: "Madrid, ES",
    name: "Tomás Vega",
    role: "Product Designer",
    teamsCreated: 1,
    techs: ["React", "Tailwind CSS", "Next.js"],
    username: "uxmaster",
  },
];

export const TEAMS: Team[] = [
  {
    applicants: [
      {
        answers: [
          {
            answer: "Frontend development with React and TypeScript",
            question: "What is your primary skill?",
          },
          {
            answer: "Yes, multiple production apps",
            question: "Have you shipped a Next.js app before?",
          },
        ],
        appliedAt: "2025-01-13",
        message: "Really excited about this project. I can help with UI/UX.",
        status: "pending",
        userId: "u6",
      },
    ],
    createdAt: "2025-01-10",
    description:
      "Building the next generation of zero-config deployment tools. We believe DevX should be invisible.",
    hackathonSlug: "vercel-ship-2025",
    id: "t1",
    maxMembers: 4,
    members: [
      { joinedAt: "2025-01-10", role: "owner", userId: "u1" },
      { joinedAt: "2025-01-11", role: "member", userId: "u3" },
      { joinedAt: "2025-01-12", role: "member", userId: "u5" },
    ],
    name: "Zero Config",
    questions: [
      "What is your primary skill?",
      "Have you shipped a Next.js app before?",
    ],
    techs: ["Next.js", "TypeScript", "Vercel", "Supabase"],
  },
  {
    applicants: [
      {
        answers: [
          {
            answer: "Extensive — 2 years with Cloudflare Workers",
            question: "Experience with edge functions?",
          },
        ],
        appliedAt: "2025-01-12",
        message: "Backend expertise at your service.",
        status: "pending",
        userId: "u7",
      },
    ],
    createdAt: "2025-01-10",
    description:
      "Pushing the limits of edge computing. Making everything run on the edge.",
    hackathonSlug: "vercel-ship-2025",
    id: "t2",
    maxMembers: 3,
    members: [
      { joinedAt: "2025-01-10", role: "owner", userId: "u2" },
      { joinedAt: "2025-01-11", role: "member", userId: "u4" },
    ],
    name: "Edge Lords",
    questions: ["Experience with edge functions?"],
    techs: ["Next.js", "TypeScript", "Vercel", "Redis"],
  },
  {
    applicants: [],
    createdAt: "2025-02-01",
    description:
      "Building a privacy-preserving voting system using zero-knowledge proofs on Ethereum.",
    hackathonSlug: "eth-global-london",
    id: "t3",
    maxMembers: 4,
    members: [
      { joinedAt: "2025-02-01", role: "owner", userId: "u8" },
      { joinedAt: "2025-02-02", role: "member", userId: "u7" },
    ],
    name: "ZK Builders",
    questions: [
      "What is your experience with ZK proofs?",
      "Can you write Solidity?",
    ],
    techs: ["Solidity", "TypeScript", "React", "Node.js"],
  },
  {
    applicants: [
      {
        answers: [
          {
            answer: "Built multiple RAG systems and fine-tuned models.",
            question: "Experience with LLMs?",
          },
          {
            answer: "LangChain, LlamaIndex, and Vercel AI SDK",
            question: "Which AI framework?",
          },
        ],
        appliedAt: "2025-03-03",
        message: "Designer + coder combo. I can make the agent UI beautiful.",
        status: "pending",
        userId: "u1",
      },
    ],
    createdAt: "2025-03-01",
    description: "Forging autonomous AI agents that can reason, plan, and act.",
    hackathonSlug: "ai-agents-hackathon",
    id: "t4",
    maxMembers: 5,
    members: [
      { joinedAt: "2025-03-01", role: "owner", userId: "u4" },
      { joinedAt: "2025-03-01", role: "member", userId: "u3" },
      { joinedAt: "2025-03-02", role: "member", userId: "u5" },
      { joinedAt: "2025-03-02", role: "member", userId: "u6" },
    ],
    name: "AgentForge",
    questions: ["Experience with LLMs?", "Which AI framework?"],
    techs: ["Python", "TypeScript", "Next.js", "Supabase"],
  },
  {
    applicants: [],
    createdAt: "2025-04-01",
    description:
      "Bringing the performance of Rust to the web. WASM for everything.",
    hackathonSlug: "rust-belt-hack",
    id: "t5",
    maxMembers: 3,
    members: [{ joinedAt: "2025-04-01", role: "owner", userId: "u7" }],
    name: "Ferris Wheel",
    questions: ["Rust experience level?"],
    techs: ["Rust", "WebAssembly", "TypeScript", "React"],
  },
  {
    applicants: [
      {
        answers: [
          {
            answer: "Yes, worked on chatbot interfaces.",
            question: "Do you have experience with AI UX?",
          },
        ],
        appliedAt: "2025-03-04",
        message: "I can design the UX for agent interaction flows.",
        status: "pending",
        userId: "u11",
      },
    ],
    createdAt: "2025-03-02",
    description: "Autonomous agents that manage your daily workflows.",
    hackathonSlug: "ai-agents-hackathon",
    id: "t6",
    maxMembers: 4,
    members: [
      { joinedAt: "2025-03-02", role: "owner", userId: "u9" },
      { joinedAt: "2025-03-03", role: "member", userId: "u3" },
    ],
    name: "AutoPilot AI",
    questions: ["Do you have experience with AI UX?"],
    techs: ["Python", "Next.js", "Supabase"],
  },
  {
    applicants: [],
    createdAt: "2025-06-15",
    description: "Tracking carbon emissions using blockchain.",
    hackathonSlug: "climate-hack",
    id: "t7",
    maxMembers: 5,
    members: [
      { joinedAt: "2025-06-15", role: "owner", userId: "u8" },
      { joinedAt: "2025-06-16", role: "member", userId: "u10" },
    ],
    name: "GreenChain",
    questions: ["Have you worked with climate data?"],
    techs: ["Solidity", "React", "Node.js"],
  },
];

// ─── HACKATHONS ───────────────────────────────────────────────────────────────

export const HACKATHONS: Hackathon[] = [
  {
    description: `## Overview

**Vercel Ship Hackathon 2025** is the biggest frontend hackathon of the year. Build something incredible with the Vercel platform and win big.

## What to Build

Build any project that uses **Vercel's ecosystem** — Next.js, v0, AI SDK, Edge Functions, or Vercel Storage. The more creative, the better.

\`\`\`
// Example: Deploy in one command
vercel --prod
\`\`\`

## Judging Criteria

- **Innovation** (30%) — How novel is the idea?
- **Technical Execution** (30%) — Quality of code and architecture
- **Design & UX** (20%) — Polish and user experience
- **Business Potential** (20%) — Real-world viability

## Timeline

| Event | Date |
|-------|------|
| Registrations Open | Jan 1, 2025 |
| Hacking Starts | Jan 15, 2025 |
| Submissions Close | Jan 22, 2025 |
| Winners Announced | Feb 1, 2025 |`,
    endDate: "2025-01-22T23:59:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: false,
    location: "San Francisco, CA",
    maxParticipants: 500,
    maxTeamSize: 4,
    organizerId: "u2",
    participants: ["u1", "u2", "u3", "u4", "u5", "u6"],
    prizes: [
      {
        amount: 25_000,
        description: "Grand Prize + Vercel Pro for life",
        place: "1st",
      },
      { amount: 10_000, description: "Runner-up + Swag pack", place: "2nd" },
      { amount: 5000, description: "3rd place + Swag pack", place: "3rd" },
    ],
    requiresApproval: false,
    slug: "vercel-ship-2025",
    sponsors: ["vercel", "supabase", "neon"],
    startDate: "2025-01-15T09:00:00Z",
    status: "live",
    tags: ["Frontend", "Web", "AI", "Open Source"],
    teams: ["t1", "t2"],
    techs: ["Next.js", "TypeScript", "Vercel", "React", "Tailwind CSS"],
    title: "Vercel Ship Hackathon 2025",
  },
  {
    description: `## ETHGlobal London 2025

The premier **Ethereum hackathon** comes to London. Build the future of decentralized applications.

## Theme: **Privacy & Identity**

This year's theme focuses on **ZK proofs**, **self-sovereign identity**, and **privacy-preserving protocols**.

\`\`\`solidity
// Your idea starts here
contract HackathonProject {
  // Build something amazing
}
\`\`\`

## Prizes

Over **$200,000** in prizes across all tracks. Sponsor prizes from leading web3 protocols.

## Venue

ExCeL London, Royal Docks, London E16 1XL`,
    endDate: "2025-02-16T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: false,
    location: "London, UK",
    maxParticipants: 1000,
    maxTeamSize: 5,
    organizerId: "u8",
    participants: ["u7", "u8"],
    prizes: [
      { amount: 50_000, description: "Best Overall Project", place: "1st" },
      { amount: 20_000, description: "Runner Up", place: "2nd" },
      {
        amount: 10_000,
        description: "Best ZK Application",
        place: "Track Winner",
      },
    ],
    requiresApproval: true,
    slug: "eth-global-london",
    sponsors: ["cloudflare", "liveblocks"],
    startDate: "2025-02-14T09:00:00Z",
    status: "upcoming",
    tags: ["Web3", "Ethereum", "DeFi", "ZK", "Identity"],
    teams: ["t3"],
    techs: ["Solidity", "TypeScript", "React", "Node.js"],
    title: "ETHGlobal London 2025",
  },
  {
    description: `## AI Agents Hackathon

Build autonomous agents that can **reason**, **plan**, and **act** in the world.

## What Are Agents?

AI agents are systems that can:
- **Perceive** their environment
- **Reason** about goals
- **Execute** multi-step tasks autonomously

## Categories

1. **Productivity Agents** — Automate knowledge work
2. **Research Agents** — Scientific discovery
3. **Code Agents** — Self-improving software
4. **Social Agents** — Multi-agent collaboration

> "The best way to predict the future is to build it." — Alan Kay`,
    endDate: "2025-03-31T23:59:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: true,
    location: "Online",
    maxParticipants: 2000,
    maxTeamSize: 5,
    organizerId: "u4",
    participants: ["u1", "u3", "u4", "u5", "u6"],
    prizes: [
      { amount: 30_000, description: "Best Agent System", place: "1st" },
      {
        amount: 15_000,
        description: "Most Innovative Use Case",
        place: "2nd",
      },
      { amount: 5000, description: "3rd Place", place: "3rd" },
    ],
    requiresApproval: false,
    slug: "ai-agents-hackathon",
    sponsors: ["vercel", "convex", "upstash"],
    startDate: "2025-03-01T00:00:00Z",
    status: "live",
    tags: ["AI", "Agents", "LLM", "Automation"],
    teams: ["t4"],
    techs: ["Python", "TypeScript", "Next.js", "Supabase", "React"],
    title: "AI Agents Global Hackathon",
  },
  {
    description: `## Rust Belt Hack

The hackathon for **systems programmers** and **WebAssembly** enthusiasts.

## Why Rust?

\`\`\`rust
fn main() {
    println!("Safety, speed, and fearless concurrency.");
}
\`\`\`

Build fast, safe, and reliable software with **Rust** and **WebAssembly**.

## Tracks

- **Web Performance** — WASM for the browser
- **Systems Tools** — CLI, DevTools, Compilers
- **Embedded** — IoT and microcontrollers`,
    endDate: "2025-04-07T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: false,
    location: "Pittsburgh, PA",
    maxParticipants: 200,
    maxTeamSize: 3,
    organizerId: "u7",
    participants: ["u7"],
    prizes: [
      { amount: 10_000, description: "Grand Prize", place: "1st" },
      { amount: 5000, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: false,
    slug: "rust-belt-hack",
    sponsors: ["cloudflare", "neon"],
    startDate: "2025-04-05T09:00:00Z",
    status: "upcoming",
    tags: ["Systems", "WebAssembly", "Performance", "Open Source"],
    teams: ["t5"],
    techs: ["Rust", "WebAssembly", "TypeScript", "Go"],
    title: "Rust Belt Hack",
  },
  {
    description: `## Open Source Summit Hackathon

Build tools and projects that **give back to the open-source community**.

## Mission

Open source is the backbone of the internet. This hackathon celebrates and extends that legacy.

## Ideas to Explore

- Developer tooling improvements
- Documentation generators
- Accessibility tools for OSS
- Performance profilers`,
    endDate: "2025-05-25T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: false,
    location: "Seattle, WA",
    maxParticipants: 300,
    maxTeamSize: 4,
    organizerId: "u3",
    participants: ["u1", "u3", "u4"],
    prizes: [
      {
        amount: 15_000,
        description: "Best Open Source Contribution",
        place: "1st",
      },
      { amount: 7500, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: true,
    slug: "open-source-summit-hack",
    sponsors: ["vercel", "cloudflare", "supabase"],
    startDate: "2025-05-20T09:00:00Z",
    status: "upcoming",
    tags: ["Open Source", "DevTools", "Community", "Documentation"],
    teams: [],
    techs: ["TypeScript", "Go", "Rust", "Python", "Node.js"],
    title: "Open Source Summit Hackathon",
  },
  {
    description: `## Design Systems Hackathon

Build the **next generation of design systems** — accessible, scalable, and beautiful.

## Challenge

Create a design system that works across:
- React, Vue, and Svelte
- Light and dark modes
- Multiple brand themes

## Stack Suggestions

\`\`\`ts
// Your tokens, your rules
const tokens = {
  colors: { primary: '#000', accent: '#0070f3' },
  radii: { sm: '4px', md: '8px', lg: '16px' },
}
\`\`\``,
    endDate: "2024-11-10T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: true,
    location: "Online",
    maxParticipants: 500,
    maxTeamSize: 4,
    organizerId: "u1",
    participants: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"],
    prizes: [
      { amount: 20_000, description: "Best Design System", place: "1st" },
      { amount: 10_000, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: false,
    slug: "design-systems-hack",
    sponsors: ["vercel", "liveblocks", "convex"],
    startDate: "2024-11-01T09:00:00Z",
    status: "ended",
    tags: ["Design Systems", "Accessibility", "UI", "Components"],
    teams: [],
    techs: ["React", "Vue", "Svelte", "TypeScript", "Tailwind CSS"],
    title: "Design Systems Hackathon",
  },
  {
    description: `## Climate Tech Hackathon

Technology can help solve the climate crisis. **Build something that matters.**

## Problem Areas

- Carbon tracking & offset tools
- Renewable energy optimization
- Sustainable supply chain
- Climate data visualization

## Impact First

This hackathon is judged primarily on **real-world impact potential**, not technical complexity.`,
    endDate: "2025-06-22T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: true,
    location: "Online",
    maxParticipants: 1000,
    maxTeamSize: 5,
    organizerId: "u5",
    participants: ["u5", "u6"],
    prizes: [
      {
        amount: 40_000,
        description: "Most Impactful Project",
        place: "1st",
      },
      { amount: 15_000, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: false,
    slug: "climate-hack",
    sponsors: ["supabase", "cloudflare"],
    startDate: "2025-06-15T09:00:00Z",
    status: "upcoming",
    tags: ["Climate", "Sustainability", "Impact", "Data"],
    teams: [],
    techs: ["Python", "TypeScript", "React", "PostgreSQL"],
    title: "Climate Tech Hackathon",
  },
  {
    description: `## GameDev Jam 2025

Build a game in 72 hours. Any genre, any engine, any theme.

## Theme: **Recursion**

Your game must incorporate **recursion** as a core mechanic, narrative, or aesthetic.

## Engines Allowed

- Unity, Unreal, Godot
- Three.js / R3F
- Canvas / WebGL
- Anything goes!`,
    endDate: "2024-12-04T00:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: true,
    location: "Online",
    maxParticipants: 800,
    maxTeamSize: 4,
    organizerId: "u7",
    participants: ["u1", "u7", "u8"],
    prizes: [
      { amount: 5000, description: "Best Game", place: "1st" },
      { amount: 2500, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: false,
    slug: "gamedev-jam",
    sponsors: ["cloudflare", "neon", "upstash"],
    startDate: "2024-12-01T00:00:00Z",
    status: "ended",
    tags: ["Game Dev", "Creative", "WebGL", "72h"],
    teams: [],
    techs: ["Three.js", "TypeScript", "WebAssembly", "Rust"],
    title: "GameDev Jam 2025",
  },
  {
    description: `## LATAM Buildathon

A hackathon focused on builders from Latin America.

## Goals

- Foster regional innovation
- Connect developers across LATAM
- Build scalable startups

## Tracks

- Fintech
- AI
- SaaS
`,
    endDate: "2025-07-15T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: true,
    location: "Online",
    maxParticipants: 1200,
    maxTeamSize: 5,
    organizerId: "u9",
    participants: ["u9", "u10"],
    prizes: [
      { amount: 20_000, description: "Best Startup Idea", place: "1st" },
      { amount: 10_000, description: "Runner Up", place: "2nd" },
    ],
    requiresApproval: false,
    slug: "latam-buildathon",
    sponsors: ["supabase", "vercel"],
    startDate: "2025-07-10T09:00:00Z",
    status: "upcoming",
    tags: ["LATAM", "Startup", "AI", "Fintech"],
    teams: ["t7"],
    techs: ["Next.js", "Node.js", "PostgreSQL"],
    title: "LATAM Buildathon 2025",
  },
  {
    description: `## DevTools Hackathon

Build tools for developers.

## Ideas

- CLI tools
- Code generators
- Observability platforms
`,
    endDate: "2025-08-05T18:00:00Z",
    image: "/placeholder.svg?height=400&width=800",
    isOnline: false,
    location: "Berlin, DE",
    maxParticipants: 400,
    maxTeamSize: 4,
    organizerId: "u10",
    participants: ["u7", "u10"],
    prizes: [{ amount: 15_000, description: "Best DevTool", place: "1st" }],
    requiresApproval: true,
    slug: "devtools-hack",
    sponsors: ["cloudflare", "neon"],
    startDate: "2025-08-01T09:00:00Z",
    status: "upcoming",
    tags: ["DevTools", "CLI", "Infra"],
    teams: [],
    techs: ["Go", "Rust", "Node.js"],
    title: "DevTools Hackathon",
  },
];

export const STATS = {
  developers: 50_000,
  hackathons: 150,
  prizePool: 2_000_000,
  projects: 12_000,
};
