import type { Metadata } from "next";

import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/components/home/tech-stack-marquee";
import { KarmaHowItWorks } from "@/shared/components/home/karma-how-it-works";
/* import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee"; */
import { JsonLd } from "@/shared/components/json-ld";
import { prisma } from "@/shared/lib/prisma";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/shared/lib/site";

import { Banner } from "../_components/banner";
import { FeaturedHackatons } from "../_components/featured-hackatons";

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
