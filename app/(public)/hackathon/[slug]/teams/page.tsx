import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TeamCard } from "@/components/team-card";
import { getCurrentUser } from "@/data/auth-dal";
import { getHackathon } from "@/data/hackatons";
import { getTeamsForHackathon } from "@/data/teams";
import { CodeText } from "@/shared/components/code-text";

import { CreateTeamButton } from "../_components/create-team-button";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);
  if (!hackathon) notFound();

  const teams = await getTeamsForHackathon(slug);

  const currentUser = await getCurrentUser();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground mb-6 mt-4">
        <Link href="/explore" className="hover:text-foreground">
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        <Link
          href={`/hackathon/${slug}`}
          className="hover:text-foreground truncate max-w-[200px]"
        >
          {hackathon.title}
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">TEAMS</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <CodeText as="p" className="text-brand-green tracking-widest">
            teams
          </CodeText>
          <h1 className="font-pixel text-2xl text-foreground">TEAMS</h1>
          <p className="font-mono text-xs text-muted-foreground">
            {teams.length} teams · max {hackathon.maxTeamSize} members each
          </p>
        </div>
        <CreateTeamButton isLoggedIn={!!currentUser} slug={slug} />
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/30 space-y-4">
          <p className="font-pixel text-sm text-muted-foreground">
            NO_TEAMS_YET
          </p>
          <CreateTeamButton isLoggedIn={!!currentUser} slug={slug} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {teams.map((team, i) => (
            <TeamCard team={team} i={i} key={team.id} />
          ))}
        </div>
      )}
    </main>
  );
}
