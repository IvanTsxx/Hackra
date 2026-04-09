import type { Metadata } from "next";

import type { HackathonStatus } from "@/app/generated/prisma/enums";
import { getExploreFilters, getHackathonsForExplore } from "@/data/hackatons";

import { ExploreFilters } from "./_components/explore-filters";
import { ExploreGrid } from "./_components/explore-grid";

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
    status?: string | string[];
  }>;
}

function parseArrayParam(
  value: string | string[] | undefined
): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  return value.split(",").filter(Boolean);
}

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;

  const statuses = parseArrayParam(params.status) as
    | HackathonStatus[]
    | undefined;
  const tags = parseArrayParam(params.tag);
  const techs = parseArrayParam(params.tech);

  const [data, filterOptions] = await Promise.all([
    getHackathonsForExplore({
      location: params.location,
      q: params.q,
      statuses,
      tags,
      techs,
    }),
    getExploreFilters(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <ExploreFilters
        filterOptions={filterOptions}
        filteredCount={data.totalCount}
        totalCount={filterOptions.totalCount}
      />

      <ExploreGrid
        initialHackathons={data.hackathons}
        nextCursor={data.nextCursor}
        hasMore={data.hasMore}
        filters={{
          location: params.location,
          q: params.q,
          statuses,
          tags,
          techs,
        }}
      />
    </main>
  );
}
