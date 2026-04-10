import dynamic from "next/dynamic";
import Link from "next/link";

import { getFeaturedHackatons } from "@/data/hackatons";
import { CodeText } from "@/shared/components/code-text";

const HackathonCard = dynamic(
  async () => {
    const mod = await import("@/shared/components/hackathon-card");
    return { default: mod.HackathonCard };
  },
  {
    loading: () => (
      <div className="border border-border/40 bg-card/30 h-[300px] animate-pulse" />
    ),
  }
);

export const FeaturedHackatons = async () => {
  const featured = await getFeaturedHackatons();

  return (
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
        {featured.map((hackathon, i) => (
          <HackathonCard key={hackathon.slug} hackathon={hackathon} i={i} />
        ))}
      </div>
    </section>
  );
};
