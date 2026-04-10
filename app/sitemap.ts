import type { MetadataRoute } from "next";

import { prisma } from "@/shared/lib/prisma";
import { SITE_URL } from "@/shared/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
      url: SITE_URL,
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: `${SITE_URL}/explore`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.7,
      url: `${SITE_URL}/sponsors`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.6,
      url: `${SITE_URL}/about`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.4,
      url: `${SITE_URL}/terms`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.4,
      url: `${SITE_URL}/privacy`,
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
    url: `${SITE_URL}/hackathon/${hackathon.slug}`,
  }));

  // User profile pages
  const userUrls = users.map((user) => ({
    changeFrequency: "weekly" as const,
    lastModified: user.updatedAt,
    priority: 0.7,
    url: `${SITE_URL}/user/${user.username}`,
  }));

  // Team pages
  const teamUrls = teams.map((team) => ({
    changeFrequency: "daily" as const,
    lastModified: team.updatedAt,
    priority: 0.7,
    url: `${SITE_URL}/team/${team.id}`,
  }));

  return [...staticPages, ...hackathonUrls, ...userUrls, ...teamUrls];
}
