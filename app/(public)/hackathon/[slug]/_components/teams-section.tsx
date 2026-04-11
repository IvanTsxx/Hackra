import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { CreateTeamButton } from "./create-team-button";

interface Props {
  slug: string;
  organizerId: string;
  teamsCount: number;
}

export function TeamsSection({ slug, organizerId, teamsCount }: Props) {
  return (
    <div className="glass border border-border/40 p-5 flex items-center justify-between">
      <div>
        <p className="font-pixel text-sm text-foreground">FIND YOUR TEAM</p>
        <p className="text-xs text-muted-foreground mt-1">
          {teamsCount} team{teamsCount !== 1 ? "s" : ""} looking for members
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="tracking-wider rounded-none border-border/50 hover:border-brand-green/50 hover:text-brand-green h-8 px-4 transition-all"
          nativeButton={false}
          render={<Link href={`/hackathon/${slug}/teams`} />}
        >
          BROWSE TEAMS
        </Button>
        <Suspense fallback={<Skeleton className="h-9 w-32" />}>
          <CreateTeamButton organizerId={organizerId} slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
