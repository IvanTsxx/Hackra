import Link from "next/link";

import { getFeaturedHackatons } from "@/data/hackatons";
import { CodeText } from "@/shared/components/code-text";
import { HackathonCard } from "@/shared/components/hackathon-card";

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
