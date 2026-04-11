// components/ui/time-label.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

interface TimeLabelProps {
  status: string;
  startDate: Date;
  endDate: Date;
}

export function TimeLabel({ status, startDate, endDate }: TimeLabelProps) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const compute = () => {
      if (status === "LIVE") {
        return `ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
      } else if (status === "UPCOMING") {
        return `starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
      }
      return `ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    };
    setLabel(compute());
  }, [status, startDate, endDate]);

  return <span className="text-xs text-muted-foreground/60">{label}</span>;
}
