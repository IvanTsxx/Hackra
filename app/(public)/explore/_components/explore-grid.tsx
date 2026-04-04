"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { loadMoreHackathons } from "@/app/(public)/explore/_actions";
import type { HackathonStatus } from "@/app/generated/prisma/enums";
import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import { HackathonCard } from "@/components/hackathon-card";
import type { hackathonExploreInclude } from "@/data/hackatons";

import { ExploreEmptyState } from "./explore-empty-state";

type ExploreHackathon = HackathonGetPayload<{
  include: typeof hackathonExploreInclude;
}>;

interface ExploreGridProps {
  initialHackathons: ExploreHackathon[];
  nextCursor: string | null;
  hasMore: boolean;
  filters: {
    q?: string;
    location?: string;
    tags?: string[];
    techs?: string[];
    statuses?: HackathonStatus[];
  };
}

export function ExploreGrid({
  initialHackathons,
  nextCursor: initialCursor,
  hasMore: initialHasMore,
  filters,
}: ExploreGridProps) {
  const [hackathons, setHackathons] =
    useState<ExploreHackathon[]>(initialHackathons);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, { amount: 0, once: false });
  const loadingRef = useRef(false);
  const skipNextLoadRef = useRef(true);

  // Reset state when filters change (new initial data from server)
  useEffect(() => {
    setHackathons(initialHackathons);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
    loadingRef.current = false;
    setIsLoading(false);
    skipNextLoadRef.current = true;
  }, [initialHackathons, initialCursor, initialHasMore]);

  useEffect(() => {
    if (skipNextLoadRef.current) {
      skipNextLoadRef.current = false;
      return;
    }
    if (!isInView || !hasMore || loadingRef.current || !cursor) return;

    loadingRef.current = true;
    setIsLoading(true);

    const currentFilters = {
      location: filters.location,
      q: filters.q,
      statuses: filters.statuses,
      tags: filters.tags,
      techs: filters.techs,
    };

    const fetchMore = async () => {
      try {
        const result = await loadMoreHackathons(cursor, currentFilters);
        setHackathons((prev) => [...prev, ...result.hackathons]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    };

    fetchMore();
  }, [
    isInView,
    cursor,
    hasMore,
    filters.q,
    filters.location,
    filters.tags,
    filters.techs,
    filters.statuses,
  ]);

  if (hackathons.length === 0) {
    return <ExploreEmptyState />;
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathons.map((hackathon, i) => (
          <motion.div
            key={hackathon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < 6 ? i * 0.05 : 0, duration: 0.3 }}
          >
            <HackathonCard hackathon={hackathon} i={i} />
          </motion.div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <p className="font-mono text-xs text-muted-foreground animate-pulse">
            loading more hackathons...
          </p>
        </div>
      )}

      {!hasMore && hackathons.length > 0 && (
        <div className="flex justify-center py-8">
          <p className="font-mono text-xs text-muted-foreground/50">
            no more hackathons
          </p>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-px" />}
    </div>
  );
}
