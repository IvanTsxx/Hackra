// components/ui/time-label.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

import { cn } from "@/shared/lib/utils";

interface TimeLabelProps {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  date?: Date;
  children?: React.ReactNode;
  className?: string;
}

export function TimeLabel({
  date,
  status,
  startDate,
  endDate,
  children,
  className,
}: TimeLabelProps) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const compute = () => {
      if (!date && startDate && endDate && status) {
        if (status === "LIVE") {
          return `ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
        } else if (status === "UPCOMING") {
          return `starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
        }
        return `ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;
      } else if (date) {
        return `${formatDistanceToNow(date, { addSuffix: true })}`;
      }
      return "";
    };
    setLabel(compute());
  }, [status, startDate, endDate]);

  return (
    <span
      className={cn(
        "text-xs text-muted-foreground/60 flex items-center gap-1",
        className
      )}
    >
      {children}
      {label}
    </span>
  );
}
