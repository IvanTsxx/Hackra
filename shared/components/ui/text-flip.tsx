"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TextFlipProps {
  words: string[];
  className?: string;
  duration?: number;
}

export function TextFlip({ words, className, duration = 2000 }: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  // Render first word immediately for LCP, then animate once JS hydrates
  if (!hasMounted) {
    return <span className={cn("inline-block", className)}>{words[0]}</span>;
  }

  return (
    <span className={cn("inline-block relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, rotateX: -90, y: 40 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 90, y: -40 }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom center" }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
