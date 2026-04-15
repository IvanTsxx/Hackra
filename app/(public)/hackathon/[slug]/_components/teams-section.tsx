import { Search } from "lucide-react";
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
    <div className="glass border border-border/40 p-5 flex lg:flex-row lg:items-center lg:justify-between flex-col gap-4">
      <div>
        <p className=" text-sm text-foreground">FIND YOUR TEAM</p>
        <p className="text-xs text-muted-foreground mt-1">
          {teamsCount} team{teamsCount !== 1 ? "s" : ""} looking for members
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="text-xs rounded-none h-9 px-4"
          nativeButton={false}
          render={<Link href={`/hackathon/${slug}/teams`} />}
        >
          <Search size={12} className="mr-1.5" />
          BROWSE TEAMS
        </Button>
        <Suspense fallback={<Skeleton className="h-9 w-32" />}>
          <CreateTeamButton organizerId={organizerId} slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
