import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/shared/components/home/tech-stack-marquee";
/* import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee"; */
import { JsonLd } from "@/shared/components/json-ld";
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

export default async function Home() {
  const [hackathonsCount, developersCount, prizesCount, sponsors] =
    await Promise.all([
      prisma.hackathon.count(),
      prisma.user.count(),

      prisma.hackathonPrize.aggregate({
        _sum: { amount: true },
      }),
      prisma.sponsor.count(),
    ]);

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

  return (
    <section>
      <JsonLd type="homepage" />
      <HeroSection stats={stats} />
      <TechStackMarquee />
      <KarmaHowItWorks />
      <FeaturedHackatons />
      {/* <SponsorsMarquee /> */}
      <Banner />
    </section>
  );
}
