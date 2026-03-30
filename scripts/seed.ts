import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

import { db } from "../lib/db";
import { users, hackathons, participants, organizers } from "../lib/db/schema";

async function generateHashedPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function seedDatabase() {
  try {
    console.log("[v0] Starting database seed...");

    // Create test organizer
    const organizerId = uuid();
    const hashedPassword = await generateHashedPassword("password123");

    await db.insert(users).values({
      createdAt: new Date(),
      email: "organizer@example.com",
      emailVerified: true,
      id: organizerId,
      name: "Alex Chen",
      passwordHash: hashedPassword,
      userType: "organizer",
    });

    console.log("[v0] Created organizer: organizer@example.com");

    // Create test participants
    const participantIds = [];
    for (let i = 0; i < 5; i += 1) {
      const userId = uuid();
      await db.insert(users).values({
        createdAt: new Date(),
        email: `dev${i}@example.com`,
        emailVerified: true,
        id: userId,
        name: `Developer ${i + 1}`,
        passwordHash: hashedPassword,
        userType: "participant",
      });
      participantIds.push(userId);
    }

    console.log("[v0] Created 5 participant users");

    // Create hackathons
    const hackathonData = [
      {
        bgColor: "#0f172a",
        description: "Build the future of decentralized web applications",
        endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        location: "San Francisco, CA",
        maxParticipants: 100,
        slug: "web3-hackathon-2024",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        textColor: "#ffffff",
        title: "Web3 Hackathon 2024",
      },
      {
        bgColor: "#1e3a8a",
        description: "Create innovative AI solutions to real-world problems",
        endDate: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000),
        location: "New York, NY",
        maxParticipants: 80,
        slug: "ai-ml-challenge-2024",
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        textColor: "#ffffff",
        title: "AI & ML Challenge",
      },
      {
        bgColor: "#064e3b",
        description: "Build amazing mobile applications in 24 hours",
        endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
        location: "Seattle, WA",
        maxParticipants: 120,
        slug: "mobile-dev-sprint-2024",
        startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        textColor: "#ffffff",
        title: "Mobile Dev Sprint",
      },
    ];

    const createdHackathonIds = [];
    for (const hackData of hackathonData) {
      const hackathonId = uuid();
      await db.insert(hackathons).values({
        accentColor: hackData.bgColor,
        createdAt: new Date(),
        description: hackData.description,
        endDate: hackData.endDate,
        id: hackathonId,
        location: hackData.location,
        maxParticipants: hackData.maxParticipants,
        organizerId,
        published: true,
        slug: hackData.slug,
        startDate: hackData.startDate,
        textColor: hackData.textColor,
        title: hackData.title,
        updatedAt: new Date(),
      });
      createdHackathonIds.push(hackathonId);
    }

    console.log("[v0] Created 3 hackathons");

    // Add participants to hackathons
    for (const hackathonId of createdHackathonIds) {
      for (let i = 0; i < 3; i += 1) {
        if (participantIds[i]) {
          await db.insert(participants).values({
            createdAt: new Date(),
            hackathonId,
            id: uuid(),
            status: "registered",
            userId: participantIds[i],
          });
        }
      }
    }

    console.log("[v0] Added participants to hackathons");

    // Create organizers for hackathons
    for (const hackathonId of createdHackathonIds) {
      await db.insert(organizers).values({
        createdAt: new Date(),
        hackathonId,
        id: uuid(),
        role: "admin",
        userId: organizerId,
      });
    }

    console.log("[v0] Added organizers to hackathons");
    console.log("[v0] Database seeding completed successfully!");
    console.log("");
    console.log("Test credentials:");
    console.log(
      "Organizer - Email: organizer@example.com, Password: password123"
    );
    console.log("Participant - Email: dev0@example.com, Password: password123");
  } catch (error) {
    console.error("[v0] Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
