import { Skeleton } from "@/shared/components/ui/skeleton";

export function ExploreSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-[calc(100dvh-4rem-40px)] w-full" />
    </div>
  );
}
