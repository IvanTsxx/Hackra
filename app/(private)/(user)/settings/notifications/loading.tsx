import { ChevronRight, Bell, Mail, Users, Trophy } from "lucide-react";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingSettingsNotificationsPage() {
  return (
    <section className="animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <span className="h-3 w-16 bg-muted rounded" />
        <ChevronRight size={10} />
        <span className="h-3 w-20 bg-muted rounded" />
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <div className="h-3 w-20 bg-muted rounded" />
        <Skeleton className="h-6 w-48 bg-muted rounded" />
      </div>

      <div className="space-y-8">
        {/* Section */}
        {[
          { icon: Bell, rows: 2 },
          { icon: Users, rows: 3 },
          { icon: Trophy, rows: 3 },
          { icon: Mail, rows: 2 },
        ].map(({ icon: Icon, rows }, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon size={14} className="text-muted-foreground/40" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>

            <div className="border border-border/30 bg-secondary/10 divide-y divide-border/20">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-32 bg-muted rounded" />
                    <div className="h-3 w-64 bg-muted rounded" />
                  </div>
                  <div className="h-5 w-10 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save button */}
        <div className="pt-2 border-t border-border/30 flex justify-end">
          <Skeleton className="h-9 w-40 bg-muted rounded" />
        </div>
      </div>
    </section>
  );
}
