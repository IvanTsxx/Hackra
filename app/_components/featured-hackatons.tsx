import Link from "next/link";

import { getFeaturedHackatonsForMap } from "@/data/hackatons";
import { CodeText } from "@/shared/components/code-text";
import { FeaturedHackathonsMap } from "@/shared/components/featured-hackathons-map";

export const FeaturedHackatons = async () => {
  const featured = await getFeaturedHackatonsForMap();

  const onlineOnlyHackathons = featured.filter(
    (h) =>
      !Number.isFinite(h.latitude) &&
      !Number.isFinite(h.longitude) &&
      (h.isOnline || h.locationMode === "remote")
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-6">
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

      <FeaturedHackathonsMap hackathons={featured} className="mb-4" />

      {onlineOnlyHackathons.length > 0 && (
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {onlineOnlyHackathons.slice(0, 3).map((hackathon) => (
            <OnlineOnlyCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </section>
  );
};

function OnlineOnlyCard({
  hackathon,
}: {
  hackathon: {
    id: string;
    slug: string;
    title: string;
    startDate: Date;
    endDate: Date;
    participantCount: number;
    tags: string[];
    status: string;
    location: string;
  };
}) {
  const startDate = new Date(hackathon.startDate);

  return (
    <Link href={`/hackathon/${hackathon.slug}`} className="block group">
      <article className="glass bg-card/50 border border-border/40 p-4 hover:border-brand-purple/40 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] border border-brand-purple/30 px-1.5 py-0.5 text-brand-purple">
            ONLINE
          </span>
          <span className="text-[9px] text-muted-foreground uppercase">
            {hackathon.status}
          </span>
        </div>
        <h3 className="text-sm font-medium text-foreground group-hover:text-brand-green transition-colors line-clamp-2 mb-2">
          {hackathon.title}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>
            {startDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span>{hackathon.participantCount} participants</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[8px] border border-brand-purple/30 px-1 py-0.5 text-brand-purple"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
