import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <span>SETTINGS</span>
        <ChevronRight size={10} />
        <span className="text-foreground">PROFILE</span>
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <span className="text-xs text-brand-green tracking-widest">
          settings
        </span>
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name + position */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Location + GitHub */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Tech stack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
    </section>
  );
}
