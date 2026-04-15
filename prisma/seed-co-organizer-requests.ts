import { faker } from "@faker-js/faker";

import type { CoOrganizerRequestStatus } from "@/app/generated/prisma/enums";

import { prisma } from "./seed-client";

const HACKATHON_IDS = [
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

const USER_IDS = [
  "u1",
  "u2",
  "u3",
  "u4",
  "u5",
  "u6",
  "u7",
  "u8",
  "u9",
  "u10",
  "u11",
];

const MESSAGES = [
  "I've organized several tech events and would love to help manage this hackathon!",
  "I have experience with event management and can help with participant coordination.",
  "As a longtime community member, I want to give back and help make this event a success.",
  "I can help with technical aspects and attendee support.",
  "Looking forward to contributing to the organizer team!",
  "I've participated in 5+ hackathons and want to help others have a great experience.",
  "My background in community management would be a great fit for this role.",
  "Excited to be part of making this amazing event happen!",
  null,
  null,
  null,
];

function randomStatus(): CoOrganizerRequestStatus {
  const rand = faker.number.float({ max: 1, min: 0 });
  if (rand < 0.4) return "PENDING";
  if (rand < 0.7) return "ACCEPTED";
  return "REJECTED";
}

export async function seedCoOrganizerRequests() {
  console.log("🌱 Seeding co-organizer requests...");

  const createdRequests: string[] = [];

  // Create requests for various hackathons
  for (const hackathonId of HACKATHON_IDS.slice(0, 8)) {
    // Random 2-5 requests per hackathon
    const numRequests = faker.number.int({ max: 5, min: 2 });
    const shuffledUsers = faker.helpers.arrayElements(
      USER_IDS.filter((u) => {
        // Exclude the organizer (typically u2, u4, u7, u3, u1, u5, u9, u10 organize these hackathons)
        const organizers: Record<string, string[]> = {
          "ai-agents-hackathon": ["u4"],
          "climate-hack": ["u5"],
          "design-systems-hack": ["u1"],
          "eth-global-london": ["u8"],
          "gamedev-jam": ["u7"],
          "open-source-summit-hack": ["u3"],
          "rust-belt-hack": ["u7"],
          "vercel-ship-2025": ["u2"],
        };
        return !organizers[hackathonId]?.includes(u);
      }),
      numRequests
    );

    for (const userId of shuffledUsers) {
      const status = randomStatus();
      const message =
        MESSAGES[faker.number.int({ max: MESSAGES.length - 1, min: 0 })] ||
        faker.lorem.sentence();

      const request = await prisma.coOrganizerRequest.create({
        data: {
          hackathonId,
          message,
          respondedAt: status !== "PENDING" ? new Date() : null,
          responseMessage:
            status === "ACCEPTED"
              ? faker.helpers.arrayElement([
                  "Welcome aboard!",
                  "Happy to have you join the team!",
                  "Thanks for wanting to help!",
                ])
              : status === "REJECTED"
                ? faker.helpers.arrayElement([
                    "Thanks for your interest, but we're full.",
                    "Already have enough organizers.",
                    "Not the right fit this time.",
                  ])
                : null,
          status,
          userId,
        },
      });

      createdRequests.push(request.id);

      // If accepted, also add to HackathonOrganizer table
      if (status === "ACCEPTED") {
        await prisma.hackathonOrganizer
          .create({
            data: {
              addedById:
                HACKATHON_IDS.indexOf(hackathonId) === 0
                  ? "u2"
                  : HACKATHON_IDS.indexOf(hackathonId) === 1
                    ? "u8"
                    : HACKATHON_IDS.indexOf(hackathonId) === 2
                      ? "u4"
                      : HACKATHON_IDS.indexOf(hackathonId) === 3
                        ? "u7"
                        : HACKATHON_IDS.indexOf(hackathonId) === 4
                          ? "u3"
                          : HACKATHON_IDS.indexOf(hackathonId) === 5
                            ? "u1"
                            : HACKATHON_IDS.indexOf(hackathonId) === 6
                              ? "u5"
                              : "u7",
              hackathonId,
              userId,
            },
          })
          .catch(() => {
            // Ignore if already exists (unique constraint)
          });
      }
    }
  }

  console.log(`✅ Seeded ${createdRequests.length} co-organizer requests`);

  // Also seed some users who have pending requests and their karma to show leadership board
  console.log("🌱 Seeding user's karma points variety...");

  for (const userId of USER_IDS) {
    const karmaBase =
      userId === "u1"
        ? 4200
        : userId === "u2"
          ? 9800
          : userId === "u3"
            ? 7600
            : userId === "u4"
              ? 5300
              : userId === "u5"
                ? 3800
                : userId === "u6"
                  ? 2900
                  : userId === "u7"
                    ? 1800
                    : userId === "u8"
                      ? 3200
                      : userId === "u9"
                        ? 2700
                        : userId === "u10"
                          ? 3100
                          : userId === "u11"
                            ? 1900
                            : faker.number.int({ max: 5000, min: 100 });

    await prisma.user
      .update({
        data: { karmaPoints: karmaBase },
        where: { id: userId },
      })
      .catch(() => {
        // User might not exist yet
      });
  }

  console.log("✅ Seeded karma points variety");

  return createdRequests;
}
