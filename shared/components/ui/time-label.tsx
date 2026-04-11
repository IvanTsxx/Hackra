// components/ui/time-label.tsx
"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { useState, useEffect } from "react";

import { cn } from "@/shared/lib/utils";

interface TimeLabelProps {
  status?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  date?: Date | string;
  children?: React.ReactNode;
  className?: string;
}

function toDate(date: Date | string | undefined): Date | undefined {
  if (!date) return undefined;
  if (typeof date === "string") return parseISO(date);
  return date;
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
    const parsedDate = toDate(date);
    const parsedStart = toDate(startDate);
    const parsedEnd = toDate(endDate);

    const compute = () => {
      if (!parsedDate && parsedStart && parsedEnd && status) {
        if (status === "LIVE") {
          return `ends ${formatDistanceToNow(parsedEnd, { addSuffix: true })}`;
        } else if (status === "UPCOMING") {
          return `starts ${formatDistanceToNow(parsedStart, { addSuffix: true })}`;
        }
        return `ended ${formatDistanceToNow(parsedEnd, { addSuffix: true })}`;
      } else if (parsedDate) {
        return `${formatDistanceToNow(parsedDate, { addSuffix: true })}`;
      }
      return "";
    };
    setLabel(compute());
  }, [date, status, startDate, endDate]);

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
