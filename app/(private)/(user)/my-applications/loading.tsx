// app/(ruta)/my-applications/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { CodeText } from "@/shared/components/code-text";

import { AnimatedSection } from "../_components/animated-section";

function ApplicationCardSkeleton() {
  return (
    <div className="glass border border-border/40 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* status */}
        <Skeleton className="h-5 w-20 rounded-none" />

        {/* title */}
        <Skeleton className="h-4 w-40" />
      </div>

      {/* date */}
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export default function Loading() {
  return (
    <section>
      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">navigation</CodeText>
          <h1 className=" text-2xl text-foreground">MY APPLICATIONS</h1>
        </div>
      </AnimatedSection>

      {/* Siempre mostramos skeletons en loading */}
      <>
        {/* Team Applications */}
        <section className="mb-10">
          <h2 className=" text-sm text-brand-green tracking-wider mb-4">
            TEAM APPLICATIONS
          </h2>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ApplicationCardSkeleton key={`team-${i}`} />
            ))}
          </div>
        </section>

        {/* Hackathon Participations */}
        <section>
          <h2 className=" text-sm text-brand-purple tracking-wider mb-4">
            HACKATHON REGISTRATIONS
          </h2>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ApplicationCardSkeleton key={`hack-${i}`} />
            ))}
          </div>
        </section>
      </>
    </section>
  );
}
