import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingAdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-40 bg-muted rounded" />
        <Skeleton className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-border/40 p-4 space-y-3 rounded-md"
          >
            <Skeleton className="h-3 w-32 bg-muted rounded" />
            <Skeleton className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar chart */}
        <div className="border border-border/40 p-4 space-y-4 rounded-md">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-muted rounded" />
            <Skeleton className="h-3 w-52 bg-muted rounded" />
          </div>

          <div className="h-[200px] w-full flex items-end gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-full bg-muted rounded" />
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="border border-border/40 p-4 space-y-4 rounded-md">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-muted rounded" />
            <Skeleton className="h-3 w-52 bg-muted rounded" />
          </div>

          <div className="flex items-center justify-center">
            <Skeleton className="h-40 w-40 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
