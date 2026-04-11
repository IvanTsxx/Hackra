import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingAdminHackathonsPage() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 bg-muted rounded" />
        <Skeleton className="h-4 w-80 bg-muted rounded" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="divide-y divide-border/40">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 p-4">
            {[
              "Title",
              "Source",
              "Status",
              "Participants",
              "Start",
              "Actions",
            ].map((_, i) => (
              <Skeleton key={i} className="h-3 w-20 bg-muted rounded" />
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 p-4 items-center">
              {/* Title */}
              <Skeleton className="h-4 w-40 bg-muted rounded" />

              {/* Source */}
              <Skeleton className="h-5 w-20 bg-muted rounded" />

              {/* Status */}
              <Skeleton className="h-5 w-24 bg-muted rounded" />

              {/* Participants */}
              <Skeleton className="h-4 w-10 bg-muted rounded" />

              {/* Date */}
              <Skeleton className="h-4 w-24 bg-muted rounded" />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-16 bg-muted rounded" />
                <Skeleton className="h-8 w-16 bg-muted rounded" />
                <Skeleton className="h-8 w-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
