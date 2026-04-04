"use client";

import { motion } from "motion/react";

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  );
}
