import { ChevronRight, Users, FileText } from "lucide-react";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingManageTeamPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <span className="text-foreground">TEAMS</span>
        <ChevronRight size={10} />
        <Skeleton className="h-3 w-20" />
        <ChevronRight size={10} />
        <span className="text-foreground">MANAGE</span>
      </div>

      {/* Header */}
      <div className="mb-8 space-y-2">
        <p className="text-xs text-brand-green tracking-widest">manage</p>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Edit form */}
      <div className="mb-8 glass border border-border/40 p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass border border-border/40 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </div>

      {/* Capacity */}
      <div className="mb-8 glass border border-border/40 p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Applications */}
      <section className="mb-10 space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <Skeleton className="h-3 w-32" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass border border-border/40 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </section>

      {/* Members */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users size={14} />
          <Skeleton className="h-3 w-40" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="glass border border-border/40 p-4 flex items-center gap-4"
          >
            <Skeleton className="w-8 h-8" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
