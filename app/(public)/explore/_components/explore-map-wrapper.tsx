"use client";

import { useMemo } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { ExploreMap } from "@/shared/components/explore-map";
import { MapSearchOverlay } from "@/shared/components/map-search-overlay";

interface FilterOption {
  value: string;
  count: number;
}

interface ExploreFilterOptions {
  tags: FilterOption[];
  techs: FilterOption[];
  locations: FilterOption[];
  statuses: { value: string; count: number }[];
  totalCount: number;
}

interface ExploreMapWrapperProps {
  hackathons: MapHackathon[];
  filterOptions: ExploreFilterOptions;
  filteredCount: number;
}

/**
 * Client wrapper that renders the ExploreMap with MapSearchOverlay.
 * MapSearchOverlay reads filter state from URL via nuqs, so no prop drilling needed.
 */
export function ExploreMapWrapper({
  hackathons,
  filterOptions,
  filteredCount,
}: ExploreMapWrapperProps) {
  // Memoize the sorted hackathons to prevent unnecessary re-renders
  const sortedHackathons = useMemo(
    () =>
      [...hackathons].toSorted(
        (a, b) => a.startDate.getTime() - b.startDate.getTime()
      ),
    [hackathons]
  );

  return (
    <div className="relative h-full">
      <ExploreMap hackathons={sortedHackathons} />
      <MapSearchOverlay
        filterOptions={filterOptions}
        totalCount={filterOptions.totalCount}
        filteredCount={filteredCount}
      />
    </div>
  );
}
