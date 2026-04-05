"use client";

import { motion } from "motion/react";

export const Title = () => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-1 mb-7"
  >
    <p className="font-mono text-xs text-brand-green tracking-widest"></p>
    <h1 className="font-pixel text-2xl text-foreground">PROFILE</h1>
  </motion.div>
);
