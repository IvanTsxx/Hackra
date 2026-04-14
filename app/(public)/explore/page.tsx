import type { Metadata } from "next";

import { getExploreFilters, getHackathonsForMap } from "@/data/hackatons";

import { ExploreMapWrapper } from "./_components/explore-map-wrapper";

export const metadata: Metadata = {
  description:
    "Discover hackathons worldwide. Find online and in-person coding competitions, build teams, and compete for prizes. Filter by technology, location, and status.",
  keywords: [
    "hackathon",
    "coding competition",
    "developer event",
    "tech hackathon",
    "online hackathon",
    "build competition",
    "prizes",
    "team formation",
  ],
  openGraph: {
    description:
      "Discover hackathons worldwide. Find online and in-person coding competitions, build teams, and compete for prizes.",
    title: "Explore Hackathons | Hackra",
    type: "website",
  },
  title: "Explore Hackathons | Hackra",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    location?: string;
    tag?: string | string[];
    tech?: string | string[];
  }>;
}

function parseArrayParam(
  value: string | string[] | undefined
): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  return value.split(",").filter(Boolean);
}

async function ExploreContent({ searchParams }: Props) {
  const params = await searchParams;

  const tags = parseArrayParam(params.tag);
  const techs = parseArrayParam(params.tech);

  const filters = {
    location: params.location,
    q: params.q,
    tags,
    techs,
  };

  // Fetch map data and filter options in parallel
  const [mapData, filterOptions] = await Promise.all([
    getHackathonsForMap(filters),
    getExploreFilters(),
  ]);

  // Calculate filtered count based on returned data
  const filteredCount = mapData.length;

  return (
    <ExploreMapWrapper
      hackathons={mapData}
      filterOptions={filterOptions}
      filteredCount={filteredCount}
    />
  );
}

export default function ExplorePage({ searchParams }: Props) {
  return (
    <main className="h-[calc(100dvh-4rem)]">
      <ExploreContent searchParams={searchParams} />
    </main>
  );
}
