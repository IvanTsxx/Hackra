import { Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TeamCard } from "@/components/team-card";
import { Button } from "@/components/ui/button";
import { getHackathon } from "@/data/hackatons";
import { getTeamsForHackathon } from "@/data/teams";
import { CodeText } from "@/shared/components/code-text";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);
  if (!hackathon) notFound();

  const teams = await getTeamsForHackathon(slug);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
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
        <Link href={`/hackathon/${slug}/teams/create`}>
          <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4">
            <Plus size={12} className="mr-1.5" /> CREATE TEAM
          </Button>
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/30 space-y-4">
          <p className="font-pixel text-sm text-muted-foreground">
            NO_TEAMS_YET
          </p>
          <Link href={`/hackathon/${slug}/teams/create`}>
            <Button
              variant="outline"
              className="font-pixel text-xs rounded-none border-brand-green/40 text-brand-green hover:bg-brand-green/5 h-8 px-4"
            >
              CREATE THE FIRST TEAM
            </Button>
          </Link>
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
