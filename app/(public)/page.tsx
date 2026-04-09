import type { Metadata } from "next";

import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/components/home/tech-stack-marquee";
import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee";
import { prisma } from "@/shared/lib/prisma";

import { Banner } from "../_components/banner";
import { FeaturedHackatons } from "../_components/featured-hackatons";

export const metadata: Metadata = {
  description:
    "Discover hackathons worldwide. Connect with developers, build innovative projects, and compete in exciting coding events. Find online and in-person hackathons, form teams, and win prizes.",
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
    description:
      "Discover hackathons worldwide. Connect with developers, build innovative projects, and compete in exciting coding events.",
    locale: "en_US",
    siteName: "Hackra",
    title: "Hackra | Build. Compete. Together.",
    type: "website",
    url: "https://hackra.dev",
  },
  robots: {
    follow: true,
    index: true,
  },
  title: "Hackra | Build. Compete. Together.",
  twitter: {
    card: "summary_large_image",
    description:
      "Discover hackathons worldwide. Connect with developers, build innovative projects, and compete in exciting coding events.",
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
      <HeroSection stats={stats} />
      <TechStackMarquee />
      <FeaturedHackatons />
      <SponsorsMarquee />
      <Banner />
    </section>
  );
}
