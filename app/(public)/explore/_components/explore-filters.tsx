"use client";

import { Filter, MapPin, Search, X } from "lucide-react";
import { motion, useInView } from "motion/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

import type { HackathonStatus } from "@/app/generated/prisma/enums";
import { CodeText } from "@/shared/components/code-text";

interface FilterOption {
  value: string;
  count: number;
}

interface ExploreFiltersProps {
  filterOptions: {
    tags: FilterOption[];
    techs: FilterOption[];
    locations: FilterOption[];
    statuses: { value: HackathonStatus; count: number }[];
    totalCount: number;
  };
  filteredCount: number;
  totalCount: number;
}

const STATUSES = ["UPCOMING", "LIVE", "ENDED"] as const;

export function ExploreFilters({
  filterOptions,
  filteredCount,
  totalCount,
}: ExploreFiltersProps) {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });
  const [location, setLocation] = useQueryState("location", {
    defaultValue: "",
    shallow: false,
  });
  const [tags, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );
  const [techs, setTechs] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );
  const [statuses, setStatuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );
  const [showFilters, setShowFilters] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const hasFilters =
    search ||
    location ||
    tags.length > 0 ||
    techs.length > 0 ||
    statuses.length > 0;
  const activeFilterCount = [
    search,
    location,
    ...tags,
    ...techs,
    ...statuses,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch(null);
    setLocation(null);
    setTags([]);
    setTechs([]);
    setStatuses([]);
  };

  const toggleTag = (value: string) => {
    setTags((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleTech = (value: string) => {
    setTechs((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleStatus = (value: string) => {
    setStatuses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    if (hasFilters) {
      setShowFilters(true);
    }
  }, [hasFilters]);

  return (
    <div ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        className="mb-10 space-y-2"
      >
        <CodeText as="p" className="text-brand-green">
          explore
        </CodeText>
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
          HACKATHONS
        </h1>
        {hasFilters ? (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-brand-green">{filteredCount}</span> of{" "}
            <span>{totalCount}</span> hackathon{totalCount !== 1 ? "s" : ""}
          </p>
        ) : (
          <p className="font-mono text-sm text-muted-foreground">
            {totalCount} hackathon{totalCount !== 1 ? "s" : ""} available
          </p>
        )}
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
              onChange={(e) => setSearch(e.target.value || null)}
              placeholder="search hackathons..."
              className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Location detect */}
          <button
            type="button"
            className="flex items-center gap-1.5 border border-border/50 px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
          >
            <MapPin size={12} />
            <span className="hidden sm:inline">near me</span>
          </button>

          {/* Filter toggle */}
          <button
            type="button"
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
              <span className="w-4 h-4 rounded-full bg-brand-green text-background text-xs flex items-center justify-center font-mono">
                {activeFilterCount}
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
              <span className="font-mono text-xs text-muted-foreground tracking-widest">
                STATUS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStatus(s)}
                    className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                      statuses.includes(s)
                        ? "border-brand-green/60 text-brand-green bg-brand-green/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            {filterOptions.locations.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs text-muted-foreground tracking-widest">
                  LOCATION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.locations.map((loc) => (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() =>
                        setLocation(location === loc.value ? null : loc.value)
                      }
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        location === loc.value
                          ? "border-brand-green/60 text-brand-green bg-brand-green/5"
                          : "border-border/40 text-muted-foreground hover:border-border/70"
                      }`}
                    >
                      {loc.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {filterOptions.tags.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs text-muted-foreground tracking-widest">
                  TAGS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.tags.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => toggleTag(t.value)}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        tags.includes(t.value)
                          ? "border-brand-purple/60 text-brand-purple bg-brand-purple/5"
                          : "border-border/40 text-muted-foreground hover:border-border/70"
                      }`}
                    >
                      {t.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Techs */}
            {filterOptions.techs.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs text-muted-foreground tracking-widest">
                  TECHNOLOGIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.techs.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => toggleTech(t.value)}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        techs.includes(t.value)
                          ? "border-foreground/50 text-foreground bg-foreground/5"
                          : "border-border/40 text-muted-foreground hover:border-border/70"
                      }`}
                    >
                      {t.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasFilters && (
              <div className="pt-1 border-t border-border/30">
                <button
                  type="button"
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
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-1.5 mb-6"
        >
          {search && (
            <span className="flex items-center gap-1 border border-border/40 font-mono text-xs text-muted-foreground px-2 py-0.5">
              q: {search}
              <button type="button" onClick={() => setSearch(null)}>
                <X size={9} />
              </button>
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1 border border-brand-green/30 font-mono text-xs text-brand-green px-2 py-0.5">
              loc: {location}
              <button type="button" onClick={() => setLocation(null)}>
                <X size={9} />
              </button>
            </span>
          )}
          {tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 border border-brand-purple/30 font-mono text-xs text-brand-purple px-2 py-0.5"
            >
              tag: {t}
              <button type="button" onClick={() => toggleTag(t)}>
                <X size={9} />
              </button>
            </span>
          ))}
          {techs.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 border border-border/40 font-mono text-xs text-foreground px-2 py-0.5"
            >
              tech: {t}
              <button type="button" onClick={() => toggleTech(t)}>
                <X size={9} />
              </button>
            </span>
          ))}
          {statuses.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 border border-border/40 font-mono text-xs text-muted-foreground px-2 py-0.5"
            >
              status: {s}
              <button type="button" onClick={() => toggleStatus(s)}>
                <X size={9} />
              </button>
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
