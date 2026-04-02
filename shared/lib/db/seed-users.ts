import { USERS } from "../mock-data";
import { prisma } from "../prisma";

export async function seedUsers() {
  console.log("🌱 Seeding users...");

  // Clear existing users (cascade will handle related records)
  await prisma.user.deleteMany();

  const users = await prisma.user.createManyAndReturn({
    data: USERS.map((user) => ({
      bio: user.bio,
      email: `${user.username}@hackra.dev`,
      emailVerified: true,
      githubUsername: user.githubUsername,
      id: user.id,
      image: user.avatar,
      karmaPoints: user.karma,
      location: user.location,
      name: user.name,
      position: user.role,
      techStack: user.techs,
      username: user.username,
    })),
  });

  console.log(`✅ Seeded ${users.length} users`);
  return users;
}
