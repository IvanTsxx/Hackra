"use client";

import { motion } from "motion/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

interface ExploreEmptyStateProps {
  message?: string;
}

export function ExploreEmptyState({
  message = "NO_RESULTS_FOUND",
}: ExploreEmptyStateProps) {
  const [, setQ] = useQueryState("q", { shallow: false });
  const [, setLocation] = useQueryState("location", { shallow: false });
  const [, setTag] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );
  const [, setTech] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );
  const [, setStatus] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false })
  );

  const clearAll = () => {
    setQ(null);
    setLocation(null);
    setTag([]);
    setTech([]);
    setStatus([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-24 space-y-4 text-center"
    >
      <div className="border border-border/30 p-8">
        <p className="font-pixel text-sm text-muted-foreground">{message}</p>
        <p className="font-mono text-xs text-muted-foreground/60 mt-2">
          Try adjusting your filters
        </p>
        <button
          type="button"
          onClick={clearAll}
          className="mt-4 font-mono text-xs text-brand-green hover:opacity-80 transition-opacity"
        >
          CLEAR FILTERS &rarr;
        </button>
      </div>
    </motion.div>
  );
}
