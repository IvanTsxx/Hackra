import type { MetadataRoute } from "next";

import { prisma } from "@/shared/lib/prisma";

const BASE_URL = "https://hackra.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
      url: BASE_URL,
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: `${BASE_URL}/explore`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.7,
      url: `${BASE_URL}/sponsors`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.6,
      url: `${BASE_URL}/about`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.4,
      url: `${BASE_URL}/terms`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.4,
      url: `${BASE_URL}/privacy`,
    },
  ];

  // Get dynamic content from database
  const [hackathons, users, teams] = await Promise.all([
    prisma.hackathon.findMany({
      select: { slug: true, updatedAt: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.user.findMany({
      select: { updatedAt: true, username: true },
    }),
    prisma.team.findMany({
      select: { id: true, updatedAt: true },
    }),
  ]);

  // Hackathon pages
  const hackathonUrls = hackathons.map((hackathon) => ({
    changeFrequency: "weekly" as const,
    lastModified: hackathon.updatedAt,
    priority: 0.8,
    url: `${BASE_URL}/hackathon/${hackathon.slug}`,
  }));

  // User profile pages
  const userUrls = users.map((user) => ({
    changeFrequency: "weekly" as const,
    lastModified: user.updatedAt,
    priority: 0.7,
    url: `${BASE_URL}/user/${user.username}`,
  }));

  // Team pages
  const teamUrls = teams.map((team) => ({
    changeFrequency: "daily" as const,
    lastModified: team.updatedAt,
    priority: 0.7,
    url: `${BASE_URL}/team/${team.id}`,
  }));

  return [...staticPages, ...hackathonUrls, ...userUrls, ...teamUrls];
}
