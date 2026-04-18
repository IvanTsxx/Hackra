import type { Metadata } from "next";

import { getLeaderboard } from "@/data/user";
import { SITE_NAME, SITE_URL } from "@/shared/lib/site";

import { LeaderboardContent } from "./_components/leaderboard-content";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}/leaderboard`,
  },
  description:
    "Top developers on Hackra ranked by karma points. See who's leading the community.",
  keywords: ["leaderboard", "ranking", "top developers", "karma", "hackathon"],
  openGraph: {
    description: "Top developers on Hackra ranked by karma points.",
    siteName: SITE_NAME,
    title: "Leaderboard | Hackra",
    type: "website",
    url: `${SITE_URL}/leaderboard`,
  },
  title: "Leaderboard | Hackra",
};

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function LeaderboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? Number.parseInt(searchParams.page, 10) : 1;

  const data = await getLeaderboard(page);

  return <LeaderboardContent initialData={data} />;
}
