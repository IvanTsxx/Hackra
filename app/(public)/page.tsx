import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { HackathonStatus } from "@/app/generated/prisma/enums";
import { HeroSection } from "@/components/home/hero-section";
import { CACHE_TAGS, CACHE_LIFE } from "@/data/cache-constants";
import { CountdownTimer } from "@/shared/components/home/countdown-timer";
import { LeadershipBoard } from "@/shared/components/home/leadership-board";
/* import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee"; */
import { PlatformFeatures } from "@/shared/components/home/platform-features";
import { TechStackMarquee } from "@/shared/components/home/tech-stack-marquee";
import { UpcomingDeadlines } from "@/shared/components/home/upcoming-deadlines";
import { JsonLd } from "@/shared/components/json-ld";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { prisma } from "@/shared/lib/prisma";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/shared/lib/site";

import { FeaturedHackatons } from "../_components/featured-hackatons";

const KarmaHowItWorks = dynamic(
  async () => {
    const mod = await import("@/shared/components/home/karma-how-it-works");
    return { default: mod.KarmaHowItWorks };
  },
  {
    loading: () => (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass border border-border/40 p-8 md:p-12 animate-pulse">
          <div className="h-3 w-32 bg-muted/50 mb-6" />
          <div className="h-6 w-80 bg-muted/50 mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px">
            {["h", "t", "c", "j", "r"].map((key) => (
              <div key={key} className="bg-secondary/10 p-5 text-center">
                <div className="h-5 w-12 bg-muted/50 mx-auto mb-1" />
                <div className="h-3 w-20 bg-muted/50 mx-auto mb-2" />
                <div className="h-3 w-28 bg-muted/50 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const Banner = dynamic(
  async () => {
    const mod = await import("../_components/banner");
    return { default: mod.Banner };
  },
  {
    loading: () => (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass border border-border/40 p-10 md:p-16 text-center space-y-6 animate-pulse">
          <div className="h-3 w-28 bg-muted/50 mx-auto" />
          <div className="h-8 w-96 bg-muted/50 mx-auto" />
          <div className="h-4 w-80 bg-muted/50 mx-auto" />
          <div className="flex gap-3 justify-center">
            <div className="h-9 w-44 bg-muted/50" />
            <div className="h-9 w-32 bg-muted/50" />
          </div>
        </div>
      </section>
    ),
  }
);

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "hackathon",
    "coding competition",
    "developer event",
    "tech hackathon",
    "online hackathon",
    "build competition",
    "prizes",
    "team formation",
    "developer community",
    "coding event",
    "programming contest",
    "innovation challenge",
  ],
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Hackra | Build. Compete. Together.",
    type: "website",
    url: SITE_URL,
  },
  robots: {
    follow: true,
    index: true,
  },
  title: "Hackra | Build. Compete. Together.",
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
    title: "Hackra | Build. Compete. Together.",
  },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

const getHomeData = async () => {
  "use cache";
  cacheLife(CACHE_LIFE.HOME_DATA);
  cacheTag(CACHE_TAGS.HOME_DATA);

  // Update hackathon statuses based on dates
  /* await updateHackathonStatuses(); */

  const [
    hackathonsCount,
    developersCount,
    prizesCount,
    sponsors,
    upcomingHackathons,
    topUsers,
  ] = await Promise.all([
    prisma.hackathon.count(),
    prisma.user.count(),
    prisma.hackathonPrize.aggregate({
      _sum: { amount: true },
    }),
    prisma.sponsor.count(),
    prisma.hackathon.findMany({
      orderBy: { startDate: "asc" },
      select: {
        endDate: true,
        id: true,
        slug: true,
        startDate: true,
        title: true,
      },
      take: 10,
      where: {
        status: {
          in: [HackathonStatus.UPCOMING],
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { karmaPoints: "desc" },
      select: {
        id: true,
        image: true,
        karmaPoints: true,
        name: true,
        position: true,
        username: true,
      },
      take: 10,
    }),
  ]);

  return {
    developersCount,
    hackathonsCount,
    prizesCount,
    sponsors,
    topUsers,
    upcomingHackathons,
  };
};

export default async function Home() {
  const {
    hackathonsCount,
    developersCount,
    prizesCount,
    sponsors,
    upcomingHackathons,
    topUsers,
  } = await getHomeData();

  const stats: { icon: string; label: string; value: string }[] = [
    { icon: "Trophy", label: "HACKATHONS", value: `${hackathonsCount}+` },
    { icon: "Users", label: "DEVELOPERS", value: `${developersCount}+` },
    {
      icon: "DollarSign",
      label: "PRIZES",
      value: `${formatPrice(prizesCount._sum.amount ?? 0)}+`,
    },
    { icon: "Building2", label: "SPONSORS", value: `${sponsors}+` },
  ];

  // Find next upcoming hackathon for countdown
  const [nextHackathon] = upcomingHackathons;

  return (
    <section>
      <JsonLd type="homepage" />
      <HeroSection stats={stats} />
      <TechStackMarquee />
      {nextHackathon && (
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex justify-center">
              <Skeleton className="h-20 w-80" />
            </div>
          }
        >
          <CountdownTimer
            targetDate={nextHackathon.startDate}
            title={`Next: ${nextHackathon.title}`}
          />
        </Suspense>
      )}
      <KarmaHowItWorks />
      <UpcomingDeadlines hackathons={upcomingHackathons} />
      <LeadershipBoard leaders={topUsers} />
      <PlatformFeatures />
      <FeaturedHackatons />
      {/* <SponsorsMarquee /> */}
      <Banner />
    </section>
  );
}
