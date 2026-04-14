import Link from "next/link";

import { getFeaturedHackatonsForMap } from "@/data/hackatons";
import { CodeText } from "@/shared/components/code-text";
import { ExploreMap } from "@/shared/components/explore-map";

export const FeaturedHackatons = async () => {
  const featured = await getFeaturedHackatonsForMap();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <CodeText as="p" className="text-xs text-brand-green mb-1">
            Featured
          </CodeText>
          <h2 className="text-xl text-foreground">FEATURED_HACKATHONS</h2>
        </div>
        <Link
          href="/explore"
          className="text-xs text-muted-foreground hover:text-brand-green transition-colors"
        >
          VIEW ALL →
        </Link>
      </div>

      <div className="relative h-full">
        <ExploreMap hackathons={featured} showFilters={false} />
      </div>
    </section>
  );
};
