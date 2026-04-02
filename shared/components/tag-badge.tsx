import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?:
    | "default"
    | "tech"
    | "status-live"
    | "status-upcoming"
    | "status-ended"
    | "green"
    | "purple";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "border-border/60 text-muted-foreground",
  green: "border-brand-green/40 text-brand-green bg-brand-green/5",
  purple: "border-brand-purple/40 text-brand-purple bg-brand-purple/5",
  "status-ended": "border-border/30 text-muted-foreground/50",
  "status-live": "border-brand-green/40 text-brand-green bg-brand-green/5",
  "status-upcoming": "border-foreground/20 text-muted-foreground",
  tech: "border-border/40 text-foreground/70 bg-muted/30",
};

export function TagBadge({
  label,
  variant = "default",
  size = "sm",
  className,
}: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border font-mono rounded-none",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export function StatusPill({
  status,
}: {
  status: "live" | "upcoming" | "ended";
}) {
  const config = {
    ended: { label: "ENDED", variant: "status-ended" as const },
    live: { label: "LIVE", variant: "status-live" as const },
    upcoming: { label: "UPCOMING", variant: "status-upcoming" as const },
  };
  const { label, variant } = config[status];
  return (
    <TagBadge
      label={variant === "status-live" ? `● ${label}` : label}
      variant={variant}
      size="sm"
    />
  );
}
