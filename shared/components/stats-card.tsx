"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass border border-border/40 rounded-none p-5 flex flex-col items-center gap-2 hover:border-brand-green/30 transition-colors",
        className
      )}
    >
      <div className="text-muted-foreground">{icon}</div>
      <span className=" text-2xl md:text-3xl text-foreground">{value}</span>
      <span className="  text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
    </motion.div>
  );
}
