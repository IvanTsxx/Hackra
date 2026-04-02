"use client";

import { Search, MapPin, Filter, X } from "lucide-react";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import { HackathonCard } from "@/components/hackathon-card";
import { HACKATHONS } from "@/lib/mock-data";
import type { Tech } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";

const ALL_TAGS = [...new Set(HACKATHONS.flatMap((h) => h.tags))];
const ALL_TECHS = [...new Set(HACKATHONS.flatMap((h) => h.techs))];
const ALL_LOCATIONS = [
  ...new Set(HACKATHONS.map((h) => (h.isOnline ? "Online" : h.location))),
];
const STATUSES = ["upcoming", "live", "ended"] as const;

/* // Skeleton card
function SkeletonCard() {
  return (
    <div className="border border-border/30 rounded-none overflow-hidden animate-pulse">
      <div className="aspect-16/7 bg-secondary/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary/50 w-3/4 rounded-none" />
        <div className="h-3 bg-secondary/40 w-1/2 rounded-none" />
        <div className="h-3 bg-secondary/30 w-2/3 rounded-none" />
      </div>
    </div>
  );
} */

export default function ExplorePage() {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [location, setLocation] = useQueryState("location", {
    defaultValue: "",
  });
  const [tag, setTag] = useQueryState("tag", { defaultValue: "" });
  const [tech, setTech] = useQueryState("tech", { defaultValue: "" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [locationDetecting] = useState(false);

  const filtered = useMemo(
    () =>
      HACKATHONS.filter((h) => {
        if (search && !h.title.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (location) {
          const hLoc = h.isOnline ? "Online" : h.location;
          if (hLoc !== location) return false;
        }
        if (tag && !h.tags.includes(tag)) return false;
        if (tech && !h.techs.includes(tech as Tech)) return false;
        if (status && h.status !== status) return false;
        return true;
      }),
    [search, location, tag, tech, status]
  );

  const hasFilters = search || location || tag || tech || status;

  const clearAll = () => {
    setSearch("");
    setLocation("");
    setTag("");
    setTech("");
    setStatus("");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 space-y-2"
      >
        <CodeText as="p" className="text-brand-green">
          explore
        </CodeText>
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
          HACKATHONS
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          {HACKATHONS.length} hackathons available
        </p>
      </motion.div>

      {/* Search + Filter bar */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 border border-border/50 px-3 py-2 bg-secondary/20 focus-within:border-border/80 transition-colors">
            <Search size={13} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search hackathons..."
              className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Location detect */}
          <button className="flex items-center gap-1.5 border border-border/50 px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <MapPin size={12} />
            <span className="hidden sm:inline">
              {locationDetecting ? "detecting..." : "near me"}
            </span>
          </button>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 border px-3 py-2 font-mono text-xs transition-colors ${
              showFilters || hasFilters
                ? "border-brand-green/50 text-brand-green"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
          >
            <Filter size={12} />
            <span>FILTERS</span>
            {hasFilters && (
              <span className="w-4 h-4 rounded-full bg-brand-green text-background text-[9px] flex items-center justify-center font-mono">
                {[search, location, tag, tech, status].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 p-4 bg-secondary/10 space-y-4"
          >
            {/* Status */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                STATUS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(status === s ? "" : s)}
                    className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                      status === s
                        ? "border-brand-green/60 text-brand-green bg-brand-green/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                LOCATION
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(location === loc ? "" : loc)}
                    className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                      location === loc
                        ? "border-brand-green/60 text-brand-green bg-brand-green/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                TAGS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(tag === t ? "" : t)}
                    className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                      tag === t
                        ? "border-brand-purple/60 text-brand-purple bg-brand-purple/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Techs */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                TECHNOLOGIES
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TECHS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTech(tech === t ? "" : t)}
                    className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                      tech === t
                        ? "border-foreground/50 text-foreground bg-foreground/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <div className="pt-1 border-t border-border/30">
                <button
                  onClick={clearAll}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X size={11} /> CLEAR ALL
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {search && (
            <span className="flex items-center gap-1 border border-border/40 font-mono text-[10px] text-muted-foreground px-2 py-0.5">
              q: {search}
              <button onClick={() => setSearch("")}>
                <X size={9} />
              </button>
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1 border border-brand-green/30 font-mono text-[10px] text-brand-green px-2 py-0.5">
              loc: {location}
              <button onClick={() => setLocation("")}>
                <X size={9} />
              </button>
            </span>
          )}
          {tag && (
            <span className="flex items-center gap-1 border border-brand-purple/30 font-mono text-[10px] text-brand-purple px-2 py-0.5">
              tag: {tag}
              <button onClick={() => setTag("")}>
                <X size={9} />
              </button>
            </span>
          )}
          {tech && (
            <span className="flex items-center gap-1 border border-border/40 font-mono text-[10px] text-foreground px-2 py-0.5">
              tech: {tech}
              <button onClick={() => setTech("")}>
                <X size={9} />
              </button>
            </span>
          )}
          {status && (
            <span className="flex items-center gap-1 border border-border/40 font-mono text-[10px] text-muted-foreground px-2 py-0.5">
              status: {status}
              <button onClick={() => setStatus("")}>
                <X size={9} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 space-y-4 text-center"
        >
          <div className="border border-border/30 p-8">
            <p className="font-pixel text-sm text-muted-foreground">
              NO_RESULTS_FOUND
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-2">
              Try adjusting your filters
            </p>
            <button
              onClick={clearAll}
              className="mt-4 font-mono text-xs text-brand-green hover:opacity-80 transition-opacity"
            >
              CLEAR FILTERS →
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((hackathon, i) => (
            <motion.div
              key={hackathon.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <HackathonCard hackathon={hackathon} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
