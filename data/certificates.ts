import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/shared/lib/prisma";

import { CACHE_LIFE, CACHE_TAGS } from "./cache-constants";

// ─── Get User Certificates ─────────────────────────────────────────────────

export async function getUserCertificates(userId: string) {
  "use cache";
  cacheLife(CACHE_LIFE.USER_CERTIFICATES);
  cacheTag(CACHE_TAGS.USER_CERTIFICATES_BY_ID(userId));
  return await prisma.certificate.findMany({
    include: {
      hackathon: {
        select: {
          endDate: true,
          id: true,
          image: true,
          location: true,
          slug: true,
          startDate: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
}

/**
 * Get certificate count for user (for profile display)
 */
export async function getUserCertificateCount(userId: string): Promise<number> {
  "use cache";
  cacheLife(CACHE_LIFE.USER_CERTIFICATES_COUNT);
  cacheTag(CACHE_TAGS.USER_CERTIFICATES_COUNT(userId));
  return await prisma.certificate.count({
    where: { userId },
  });
}

export async function getCertificateByToken(token: string) {
  "use cache";
  cacheLife(CACHE_LIFE.CERTIFICATE_BY_TOKEN);
  cacheTag(CACHE_TAGS.CERTIFICATE_BY_TOKEN(token));
  const certificate = await prisma.certificate.findUnique({
    include: {
      hackathon: {
        select: {
          endDate: true,
          id: true,
          image: true,
          location: true,
          slug: true,
          startDate: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    where: { token },
  });

  if (!certificate) {
    return null;
  }

  return certificate;
}

export const getRecentCertificates = async () => {
  "use cache";
  cacheLife(CACHE_LIFE.USER_CERTIFICATES);
  cacheTag(CACHE_TAGS.USER_CERTIFICATES);
  const recentCertificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" },
    select: { token: true },
    take: 10,
  });

  return recentCertificates;
};
