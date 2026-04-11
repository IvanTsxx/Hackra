// app/(ruta)/create/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { CodeText } from "@/shared/components/code-text";

function InputSkeleton() {
  return <Skeleton className="h-9 w-full" />;
}

function Label() {
  return <div className="h-3 w-24 bg-transparent" />;
}

export default function Loading() {
  return (
    <section>
      {/* Username */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <CodeText as="p">navigation</CodeText>
        <h1 className="font-pixel text-2xl text-foreground">CREATE</h1>
      </div>

      {/* Publish switch */}
      <div className="flex items-center justify-between p-4 border border-border/40 bg-brand-green/5 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-2 h-2 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Skeleton className="h-5 w-10" />
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-border/40 mb-8 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-24 mb-2" />
        ))}
      </div>

      {/* STEP 0 Skeleton */}
      <div className="space-y-6">
        {/* Luma import */}
        <div className="space-y-3 border border-brand-green/30 bg-brand-green/5 p-4">
          <Skeleton className="h-3 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-24" />
          </div>

          {/* preview card */}
          <div className="space-y-2 border border-border/30 bg-secondary/10 p-3">
            <Skeleton className="w-full aspect-video" />
            <Skeleton className="h-3 w-40" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label />
          <InputSkeleton />
        </div>

        {/* Cover */}
        <div className="space-y-2">
          <Label />
          <Skeleton className="w-full h-40" />
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label />
            <InputSkeleton />
          </div>
          <div className="space-y-2">
            <Label />
            <InputSkeleton />
          </div>
        </div>

        {/* Date range info */}
        <Skeleton className="h-8 w-72" />

        {/* Location mode */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <div className="grid grid-cols-3 gap-0 border border-border/40">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>

          <InputSkeleton />
        </div>

        {/* Participants */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label />
            <InputSkeleton />
          </div>
          <div className="space-y-2">
            <Label />
            <InputSkeleton />
          </div>
        </div>

        {/* Requires approval */}
        <div className="flex items-center justify-between p-3 border border-border/40 bg-secondary/10">
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-10" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 py-4 border-t border-border/20">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </section>
  );
}
