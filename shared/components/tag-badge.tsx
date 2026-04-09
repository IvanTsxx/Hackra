"use client";

import { motion } from "motion/react";

import type { HackathonStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/utils";

/**
 * Variants definidos a partir de los estilos (single source of truth)
 */
const variantStyles = {
  default: "border-border/60 text-muted-foreground",
  green: "border-brand-green/40 text-brand-green bg-brand-green/5",
  purple: "border-brand-purple/40 text-brand-purple bg-brand-purple/5",
  "status-ended": "border-border/30 text-muted-foreground/50",
  "status-live": "border-brand-green/40 text-brand-green bg-brand-green/5",
  "status-upcoming": "border-foreground/20 text-muted-foreground",
  tech: "border-border/40 text-foreground/70 bg-muted/30",
} as const;

type TagBadgeVariant = keyof typeof variantStyles;

interface TagBadgeProps {
  label: string;
  variant?: TagBadgeVariant;
  size?: "sm" | "md";
  className?: string;
  index: number;
}

export function TagBadge({
  label,
  variant = "default",
  size = "sm",
  className,
  index,
}: TagBadgeProps) {
  return (
    <motion.span
      className={cn(
        "inline-flex items-center border font-mono rounded-none",
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs",
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.1 }}
    >
      {label}
    </motion.span>
  );
}

export function StatusPill({
  status,
  index,
}: {
  status: HackathonStatus;
  index: number;
}) {
  const config: Record<
    HackathonStatus,
    { label: string; variant: TagBadgeVariant }
  > = {
    CANCELLED: { label: "CANCELLED", variant: "status-ended" },
    DRAFT: { label: "DRAFT", variant: "default" },
    ENDED: { label: "ENDED", variant: "status-ended" },
    LIVE: { label: "LIVE", variant: "status-live" },
    UPCOMING: { label: "UPCOMING", variant: "status-upcoming" },
  };

  const { label, variant } = config[status];

  return (
    <TagBadge
      label={variant === "status-live" ? `● ${label}` : label}
      variant={variant}
      size="sm"
      index={index}
    />
  );
}
