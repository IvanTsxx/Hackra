"use client";

import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";

interface FilterOption {
  value: string;
  count: number;
}

interface ExploreFilterOptions {
  tags: FilterOption[];
  techs: FilterOption[];
  locations: FilterOption[];
  totalCount: number;
}

interface MapSearchOverlayProps {
  filterOptions: ExploreFilterOptions;
  totalCount: number;
  filteredCount: number;
}

export function MapSearchOverlay({
  filterOptions,
  totalCount,
  filteredCount,
}: MapSearchOverlayProps) {
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

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hasFilters = search || location || tags.length > 0 || techs.length > 0;

  const clearAll = () => {
    setSearch(null);
    setLocation(null);
    setTags([]);
    setTechs([]);
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

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (isCollapsed) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="glass bg-card/80 backdrop-blur-md border border-border/40 px-3 py-2 flex items-center gap-2 text-xs hover:border-border/60 transition-colors"
        >
          <Search size={12} />
          <span>Search & Filter</span>
          {hasFilters && (
            <span className="w-4 h-4 rounded-full bg-brand-green text-background text-[10px] flex items-center justify-center">
              {tags.length +
                techs.length +
                (search ? 1 : 0) +
                (location ? 1 : 0)}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-10 w-[280px] sm:w-[320px]">
      <div className="glass bg-card/80 backdrop-blur-md border border-border/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-brand-green" />
            <span className="text-xs  tracking-wider text-brand-green">
              FILTER
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">
              {filteredCount}/{totalCount}
            </span>
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1 hover:bg-accent/50 transition-colors"
            >
              <X size={12} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-3 py-2 border-b border-border/30">
          <div className="flex items-center gap-2 bg-secondary/20 px-2 py-1.5">
            <Search size={12} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value || null)}
              placeholder="search hackathons..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={10} />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Sections */}
        <div className="max-h-[300px] overflow-y-auto">
          {/* Location Section */}
          <FilterSection
            title="LOCATION"
            color="brand-green"
            isExpanded={expandedSection === "location"}
            onToggle={() => toggleSection("location")}
            activeCount={location ? 1 : 0}
          >
            <div className="flex flex-wrap gap-1">
              {filterOptions.locations.slice(0, 8).map((loc) => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() =>
                    setLocation(location === loc.value ? null : loc.value)
                  }
                  className={cn(
                    "text-[10px] border px-1.5 py-0.5 transition-colors",
                    location === loc.value
                      ? "border-brand-green/60 text-brand-green bg-brand-green/5"
                      : "border-border/40 text-muted-foreground hover:border-brand-green/40"
                  )}
                >
                  {loc.value}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Tags Section */}
          <FilterSection
            title="TAGS"
            color="brand-purple"
            isExpanded={expandedSection === "tags"}
            onToggle={() => toggleSection("tags")}
            activeCount={tags.length}
          >
            <div className="flex flex-wrap gap-1">
              {filterOptions.tags.slice(0, 12).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleTag(t.value)}
                  className={cn(
                    "text-[10px] border px-1.5 py-0.5 transition-colors",
                    tags.includes(t.value)
                      ? "border-brand-purple/60 text-brand-purple bg-brand-purple/5"
                      : "border-border/40 text-muted-foreground hover:border-brand-purple/40"
                  )}
                >
                  {t.value}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Technologies Section */}
          <FilterSection
            title="TECHNOLOGIES"
            color="foreground"
            isExpanded={expandedSection === "techs"}
            onToggle={() => toggleSection("techs")}
            activeCount={techs.length}
          >
            <div className="flex flex-wrap gap-1">
              {filterOptions.techs.slice(0, 12).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleTech(t.value)}
                  className={cn(
                    "text-[10px] border px-1.5 py-0.5 transition-colors",
                    techs.includes(t.value)
                      ? "border-foreground/50 text-foreground bg-foreground/5"
                      : "border-border/40 text-muted-foreground hover:border-foreground/40"
                  )}
                >
                  {t.value}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Active Filter Chips */}
        {hasFilters && (
          <div className="px-3 py-2 border-t border-border/30 space-y-1">
            <div className="flex flex-wrap gap-1">
              {search && (
                <span className="flex items-center gap-1 border border-border/40 text-[10px] text-muted-foreground px-1.5 py-0.5">
                  q: {search}
                  <button type="button" onClick={() => setSearch(null)}>
                    <X size={8} />
                  </button>
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1 border border-brand-green/30 text-[10px] text-brand-green px-1.5 py-0.5">
                  {location}
                  <button type="button" onClick={() => setLocation(null)}>
                    <X size={8} />
                  </button>
                </span>
              )}
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 border border-brand-purple/30 text-[10px] text-brand-purple px-1.5 py-0.5"
                >
                  {t}
                  <button type="button" onClick={() => toggleTag(t)}>
                    <X size={8} />
                  </button>
                </span>
              ))}
              {techs.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 border border-border/40 text-[10px] text-foreground px-1.5 py-0.5"
                >
                  {t}
                  <button type="button" onClick={() => toggleTech(t)}>
                    <X size={8} />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X size={8} /> CLEAR ALL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  color: "brand-green" | "brand-purple" | "foreground";
  isExpanded: boolean;
  onToggle: () => void;
  activeCount: number;
  children: React.ReactNode;
}

function FilterSection({
  title,
  color,
  isExpanded,
  onToggle,
  activeCount,
  children,
}: FilterSectionProps) {
  const colorClasses = {
    "brand-green": "text-brand-green",
    "brand-purple": "text-brand-purple",
    foreground: "text-foreground",
  };

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("text-[10px] tracking-widest", colorClasses[color])}
          >
            {title}
          </span>
          {activeCount > 0 && (
            <span className="w-3.5 h-3.5 rounded-full bg-current text-[9px] flex items-center justify-center text-background">
              {activeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={12} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={12} className="text-muted-foreground" />
        )}
      </button>
      {isExpanded && <div className="px-3 pb-2">{children}</div>}
    </div>
  );
}
