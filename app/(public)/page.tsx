import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/components/home/tech-stack-marquee";
import { getFeaturedHackatons } from "@/data/hackatons";
import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee";

import { Banner } from "../_components/banner";
import { FeaturedHackatons } from "../_components/featured-hackatons";

export const metadata = {
  description:
    "Connect with developers, build innovative projects, and compete in exciting hackathon events worldwide.",
  title: "Hackra | Build. Compete. Together.",
};

export default function Home() {
  /* Preload featured hackatons */
  getFeaturedHackatons();
  return (
    <section>
      <HeroSection />
      <TechStackMarquee />
      <FeaturedHackatons />
      <SponsorsMarquee />
      <Banner />
    </section>
  );
}
