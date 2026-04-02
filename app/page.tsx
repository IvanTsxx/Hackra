import Link from "next/link";

import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/components/home/tech-stack-marquee";
import { CodeText } from "@/shared/components/code-text";
import { HackathonCard } from "@/shared/components/hackathon-card";
import { SponsorsMarquee } from "@/shared/components/home/sponsors-marquee";
import { HACKATHONS } from "@/shared/lib/mock-data";

export const metadata = {
  description:
    "Connect with developers, build innovative projects, and compete in exciting hackathon events worldwide.",
  title: "Hackra | Build. Compete. Together.",
};

const featured = HACKATHONS.filter((h) => h.status !== "ended").slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TechStackMarquee />

      {/* Featured Hackathons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <CodeText as="p" className="text-xs text-brand-green mb-1">
              Featured
            </CodeText>
            <h2 className="text-xl text-foreground">ACTIVE_HACKATHONS</h2>
          </div>
          <Link
            href="/explore"
            className="text-xs text-muted-foreground hover:text-brand-green transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((hackathon) => (
            <HackathonCard key={hackathon.slug} hackathon={hackathon} />
          ))}
        </div>
      </section>

      <SponsorsMarquee />

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass border border-border/40 p-10 md:p-16 text-center space-y-6">
          <CodeText as="p" className="text-xs text-brand-green">
            GET_STARTED
          </CodeText>
          <h2 className="text-2xl md:text-4xl text-foreground text-balance">
            READY TO BUILD SOMETHING GREAT?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {
              "/* Join the next wave of hackathons. Meet your future co-founders. Launch your next big idea. */"
            }
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background text-xs tracking-wider hover:opacity-90 transition-opacity"
            >
              EXPLORE HACKATHONS
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border/60 text-foreground text-xs tracking-wider hover:border-brand-green/50 hover:text-brand-green transition-all"
            >
              HOST ONE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
