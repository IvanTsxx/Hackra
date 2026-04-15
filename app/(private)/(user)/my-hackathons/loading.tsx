// app/(ruta)/my-hackathons/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { CodeText } from "@/shared/components/code-text";

function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-border/30">
      {/* Title */}
      <Skeleton className="h-4 w-40" />

      {/* Status */}
      <Skeleton className="h-5 w-20" />

      {/* Dates */}
      <Skeleton className="h-4 w-28" />

      {/* Participants */}
      <Skeleton className="h-4 w-16" />

      {/* Pending */}
      <Skeleton className="h-4 w-12" />

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-20" />
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
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <CodeText as="p">navigation</CodeText>

        <div className="flex items-center gap-3">
          <h1 className=" text-2xl text-foreground">MY HACKATHONS</h1>

          {/* Pending badge */}
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      {/* Table */}
      <div className="glass border border-border/40">
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-border/40 bg-secondary/20">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24 ml-auto" />
        </div>

        {/* Rows */}
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
