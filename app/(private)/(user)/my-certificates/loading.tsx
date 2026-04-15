import { FileText, Calendar, MapPin } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Title (estático) */}
      <h1 className=" text-2xl mb-2">MY CERTIFICATES</h1>

      {/* Dynamic subtitle */}
      <Skeleton className="h-4 w-40 mb-8" />

      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                {/* icono estático */}
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>

              <Skeleton className="h-4 w-10" />
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
