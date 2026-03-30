import "dotenv/config";
import { v4 as uuid } from "uuid";

import { db } from ".";
import { auth } from "../auth";
import { hackathons, participants, organizers } from "./schema";

async function seedDatabase() {
  try {
    console.log("[seed] Starting database seed...");

    // ============================================
    // CREATE USERS USING BETTER AUTH API
    // ============================================

    // Create test organizer using Better Auth API
    const organizerResult = await auth.api.signUpEmail({
      body: {
        email: "organizer@example.com",
        name: "Alex Chen",
        password: "password123",
        role: "admin",
        userType: "organizer",
      },
    });

    if (!organizerResult.user) {
      throw new Error("Failed to create organizer");
    }

    console.log(
      `[seed] Created organizer: organizer@example.com (id: ${organizerResult.user.id})`
    );

    // Create test participants using Better Auth API
    const participantIds: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      const result = await auth.api.signUpEmail({
        body: {
          email: `dev${i}@example.com`,
          name: `Developer ${i + 1}`,
          password: "password123",
          role: "user",
          userType: "participant",
        },
      });

      if (!result.user) {
        throw new Error(`Failed to create participant dev${i}`);
      }

      participantIds.push(result.user.id);
    }

    console.log("[seed] Created 10 participant users with accounts");

    // ============================================
    // CREATE HACKATHONS
    // ============================================

    const hackathonData = [
      {
        bgColor: "#0f172a",
        description:
          "Build the future of decentralized web applications. Join us for a weekend of innovation, blockchain technology, and building the next generation of dApps.",
        endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        location: "San Francisco, CA",
        maxParticipants: 100,
        prizes: [
          { place: "1st", prize: "$10,000 + Accelerator Spot" },
          { place: "2nd", prize: "$5,000" },
          { place: "3rd", prize: "$2,500" },
        ],
        requirements: [
          "Team of 1-4 members",
          "Open source project",
          "Demo video required",
        ],
        slug: "web3-hackathon-2024",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        technologies: ["Solidity", "Ethereum", "Polkadot", "IPFS", "React"],
        textColor: "#ffffff",
        title: "Web3 Hackathon 2024",
      },
      {
        bgColor: "#1e3a8a",
        description:
          "Create innovative AI solutions to real-world problems. From machine learning to natural language processing, push the boundaries of what's possible.",
        endDate: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000),
        location: "New York, NY",
        maxParticipants: 80,
        prizes: [
          { place: "1st", prize: "$15,000 + NVIDIA GPU Cluster" },
          { place: "2nd", prize: "$7,500" },
          { place: "3rd", prize: "$3,500" },
        ],
        requirements: [
          "Team of 2-5 members",
          "Working prototype",
          "Technical presentation",
        ],
        slug: "ai-ml-challenge-2024",
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        technologies: [
          "Python",
          "TensorFlow",
          "PyTorch",
          "OpenAI",
          "LangChain",
        ],
        textColor: "#ffffff",
        title: "AI & ML Challenge",
      },
      {
        bgColor: "#064e3b",
        description:
          "Build amazing mobile applications in 24 hours. Create the next viral app and showcase your creativity to the world.",
        endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
        location: "Seattle, WA",
        maxParticipants: 120,
        prizes: [
          { place: "1st", prize: "$8,000 + App Store Feature" },
          { place: "2nd", prize: "$4,000" },
          { place: "3rd", prize: "$2,000" },
        ],
        requirements: [
          "Team of 1-4 members",
          "Functional mobile app",
          "Pitch presentation",
        ],
        slug: "mobile-dev-sprint-2024",
        startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        technologies: [
          "React Native",
          "Flutter",
          "Swift",
          "Kotlin",
          "Firebase",
        ],
        textColor: "#ffffff",
        title: "Mobile Dev Sprint",
      },
      {
        bgColor: "#7c2d12",
        description:
          "Build sustainable technology solutions for a greener future. Focus on climate tech, renewable energy, and environmental impact.",
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: "Austin, TX",
        maxParticipants: 60,
        prizes: [
          { place: "1st", prize: "$6,000 + Mentorship" },
          { place: "2nd", prize: "$3,000" },
          { place: "3rd", prize: "$1,500" },
        ],
        requirements: [
          "Team of 2-4 members",
          "Sustainability focus",
          "Impact metric calculation",
        ],
        slug: "climate-tech-hackathon",
        startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        technologies: ["IoT", "Solar", "Wind", "Carbon Tracking", "React"],
        textColor: "#ffffff",
        title: "Climate Tech Hackathon",
      },
      {
        bgColor: "#4c1d95",
        description:
          "Create the future of fintech. Build solutions for banking, payments, DeFi, and financial inclusion.",
        endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        location: "London, UK",
        maxParticipants: 90,
        prizes: [
          { place: "1st", prize: "$12,000 + VC Intro" },
          { place: "2nd", prize: "$6,000" },
          { place: "3rd", prize: "$3,000" },
        ],
        requirements: [
          "Team of 2-5 members",
          "Financial compliance awareness",
          "Business model canvas",
        ],
        slug: "fintech-innovation-challenge",
        startDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000),
        technologies: ["Stripe", "Plaid", "Solidity", "React", "Node.js"],
        textColor: "#ffffff",
        title: "FinTech Innovation Challenge",
      },
    ];

    const createdHackathonIds: string[] = [];
    for (const hackData of hackathonData) {
      const hackathonId = uuid();
      await db.insert(hackathons).values({
        accentColor: hackData.bgColor,
        coverImage: null,
        createdAt: new Date(),
        description: hackData.description,
        endDate: hackData.endDate,
        id: hackathonId,
        isVirtual: hackData.location.includes("Virtual") || false,
        location: hackData.location,
        longDescription: hackData.description,
        maxParticipants: hackData.maxParticipants,
        prizes: hackData.prizes,
        published: true,
        registrationDeadline: new Date(
          hackData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000
        ),
        requirements: hackData.requirements,
        slug: hackData.slug,
        startDate: hackData.startDate,
        technologies: hackData.technologies,
        title: hackData.title,
        updatedAt: new Date(),
      });
      createdHackathonIds.push(hackathonId);
    }

    console.log("[seed] Created 5 hackathons with full details");

    // ============================================
    // ADD PARTICIPANTS TO HACKATHONS
    // ============================================

    // Register participants to multiple hackathons
    for (let h = 0; h < createdHackathonIds.length; h += 1) {
      const hackathonId = createdHackathonIds[h];
      // Register 3-5 participants per hackathon
      const numParticipants = 3 + (h % 3);

      for (let i = 0; i < numParticipants; i += 1) {
        if (participantIds[i]) {
          await db.insert(participants).values({
            createdAt: new Date(),
            hackathonId,
            id: uuid(),
            status: "registered",
            teamName: `Team ${String.fromCodePoint(65 + i)}`,
            updatedAt: new Date(),
            userId: participantIds[i],
          });
        }
      }
    }

    console.log("[seed] Registered participants to hackathons");

    // ============================================
    // CREATE ORGANIZERS FOR HACKATHONS
    // ============================================

    for (const hackathonId of createdHackathonIds) {
      await db.insert(organizers).values({
        createdAt: new Date(),
        hackathonId,
        id: uuid(),
        role: "admin",
        userId: organizerResult.user.id,
      });
    }

    console.log("[seed] Assigned organizers to hackathons");

    // ============================================
    // VERIFY DATA
    // ============================================

    console.log("[seed] Database seeding completed successfully!");
    console.log("");
    console.log("=".repeat(50));
    console.log("TEST CREDENTIALS");
    console.log("=".repeat(50));
    console.log("");
    console.log("ORGANIZER:");
    console.log("  Email: organizer@example.com");
    console.log("  Password: password123");
    console.log("");
    console.log("PARTICIPANTS:");
    for (let i = 0; i < 5; i += 1) {
      console.log(`  Email: dev${i}@example.com`);
      console.log(`  Password: password123`);
    }
    console.log("");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("[seed] Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
