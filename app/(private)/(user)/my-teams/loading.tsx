// app/(ruta)/my-teams/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { CodeText } from "@/shared/components/code-text";

function TeamCardSkeleton() {
  return (
    <div className="glass border border-border/40 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* team name */}
          <Skeleton className="h-3 w-32" />
          {/* hackathon name */}
          <Skeleton className="h-3 w-40" />
        </div>

        {/* status pill */}
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-border/30">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-24 ml-auto" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <CodeText as="p">navigation</CodeText>
        <h1 className=" text-2xl text-foreground">MY TEAMS</h1>
      </div>

      {/* Owned Teams */}
      <section className="mb-10">
        <h2 className=" text-sm text-brand-green tracking-wider mb-4">
          TEAMS YOU OWN
        </h2>

        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <TeamCardSkeleton key={`owned-${i}`} />
          ))}
        </div>
      </section>

      {/* Member Teams */}
      <section>
        <h2 className=" text-sm text-brand-purple tracking-wider mb-4">
          TEAMS YOU&apos;RE IN
        </h2>

        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <TeamCardSkeleton key={`member-${i}`} />
          ))}
        </div>
      </section>
    </section>
  );
}
