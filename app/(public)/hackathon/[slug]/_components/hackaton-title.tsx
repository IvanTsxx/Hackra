"use client";

import { motion } from "motion/react";

export const HackatonTitle = ({ title }: { title: string }) => (
  <motion.h1
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className=" text-2xl md:text-3xl text-foreground leading-tight text-balance"
  >
    {title}
  </motion.h1>
);
