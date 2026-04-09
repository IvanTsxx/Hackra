import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Tier } from "@/app/generated/prisma/enums";
import { getSponsors } from "@/data/sponsors";
import { CodeText } from "@/shared/components/code-text";

const TIER_ORDER: Tier[] = [Tier.PLATINUM, Tier.GOLD, Tier.SILVER, Tier.BRONZE];

export const metadata = {
  description: "Meet the companies powering hackathons on Hackra.",
  title: "Sponsors — Hackra",
};

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  const grouped = TIER_ORDER.reduce(
    (acc, tier) => {
      acc[tier] = sponsors.filter((s) => s.tier === tier);
      return acc;
    },
    {} as Record<string, typeof sponsors>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="mb-12 space-y-2">
        <CodeText as="p">sponsors</CodeText>
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
          SPONSORS
        </h1>
        <p className="font-mono text-sm text-muted-foreground max-w-xl">
          The companies and teams powering hackathons and prizes on Hackra.
        </p>
      </div>

      <div className="space-y-12">
        {TIER_ORDER.map((tier) => {
          const list = grouped[tier];
          if (!list?.length) return null;
          return (
            <div key={tier}>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`font-pixel text-xs tracking-widest px-2 py-0.5 border ${
                    tier === "PLATINUM"
                      ? "border-foreground/30 text-foreground"
                      : tier === "GOLD"
                        ? "border-yellow-500/40 text-yellow-500/80"
                        : tier === "SILVER"
                          ? "border-zinc-400/40 text-zinc-400/80"
                          : "border-orange-700/40 text-orange-700/80"
                  }`}
                >
                  {tier.toUpperCase()}
                </span>
                <div className="flex-1 border-t border-border/20" />
              </div>
              <div
                className={`grid gap-4 ${tier === "PLATINUM" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}
              >
                {list.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-border/40 p-5 hover:border-border/70 transition-all bg-card/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-8 bg-secondary/30 flex items-center justify-center">
                        <span className="font-pixel text-xs text-muted-foreground">
                          {sponsor.name}
                        </span>
                      </div>
                      <ExternalLink
                        size={11}
                        className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
                      />
                    </div>
                    {tier === "PLATINUM" || tier === "GOLD" ? (
                      <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                        {sponsor.description}
                      </p>
                    ) : null}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 border border-brand-green/20 bg-brand-green/5 p-8 text-center space-y-3">
        <p className="font-pixel text-sm text-foreground">BECOME A SPONSOR</p>
        <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
          Reach thousands of developers. Fund prizes, get exposure, and support
          the builder community.
        </p>
        <Link
          href="/create"
          className="inline-block font-pixel text-xs border border-brand-green/50 text-brand-green px-6 py-2.5 hover:bg-brand-green/10 transition-colors mt-2"
        >
          GET IN TOUCH →
        </Link>
      </div>
    </main>
  );
}
