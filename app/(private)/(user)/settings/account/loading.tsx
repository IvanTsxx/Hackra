import { ChevronRight, Mail, Shield, Trash2 } from "lucide-react";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LoadingSettingsAccountPage() {
  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <span>SETTINGS</span>
        <ChevronRight size={10} />
        <span className="text-foreground">ACCOUNT</span>
      </div>

      {/* Header */}
      <div className="space-y-1 mb-7">
        <span className="text-xs text-brand-green tracking-widest">
          settings
        </span>
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="space-y-8">
        {/* Email section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-brand-green" />
            <h2 className="text-xs tracking-widest text-foreground">EMAIL</h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Security section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-brand-green" />
            <h2 className="text-xs tracking-widest text-foreground">
              SECURITY
            </h2>
          </div>
          <div className="border border-border/30 bg-secondary/10 p-4 space-y-3">
            <Skeleton className="h-3 w-40" />
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={14} className="text-red-500" />
            <h2 className="text-xs tracking-widest text-red-500">
              DANGER ZONE
            </h2>
          </div>
          <div className="border border-red-500/20 bg-red-500/5 p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
