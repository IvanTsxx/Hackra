import { seedHackathons } from "./seed-hackathons";
import { seedSponsors } from "./seed-sponsors";
import { seedTeams } from "./seed-teams";
import { seedUsers } from "./seed-users";

async function main() {
  console.log("🚀 Starting database seed...\n");

  // Order matters due to foreign key dependencies:
  // 1. Users (no dependencies)
  // 2. Sponsors (no dependencies)
  // 3. Hackathons (depends on users for organizerId)
  // 4. Teams (depends on hackathons and users)
  // 5. Hackathon sponsors (depends on hackathons and sponsors)

  await seedUsers();
  await seedSponsors();
  await seedHackathons();
  await seedTeams();

  console.log("\n✨ Database seed completed successfully!");
}

try {
  await main();
} catch (error) {
  console.error("❌ Seed failed:", error);
  process.exit(1);
} finally {
  const { prisma } = await import("../prisma");
  await prisma.$disconnect();
}
