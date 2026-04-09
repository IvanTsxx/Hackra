"use client";

import { Building2, DollarSign, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    y: 0,
  },
};

const mapIcon = (icon: string) => {
  switch (icon) {
    case "Trophy": {
      return <Trophy className="w-4 h-4 text-primary" />;
    }
    case "Users": {
      return <Users className="w-4 h-4 text-primary" />;
    }
    case "Zap": {
      return <Zap className="w-4 h-4 text-primary" />;
    }
    case "DollarSign": {
      return <DollarSign className="w-4 h-4 text-primary" />;
    }
    case "Building2": {
      return <Building2 className="w-4 h-4 text-primary" />;
    }
    default: {
      return null;
    }
  }
};

export const Stats = ({
  stats,
}: {
  stats: { icon: string; label: string; value: string }[];
}) => (
  <motion.div
    variants={itemVariants}
    className="grid grid-cols-2 md:grid-cols-4 gap-4"
  >
    {stats.map((stat, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center gap-2 p-4 border border-border bg-card/50 backdrop-blur-sm"
      >
        {mapIcon(stat.icon)}
        <span className="text-xl md:text-2xl font-bold  ">{stat.value}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest  ">
          {stat.label}
        </span>
      </div>
    ))}
  </motion.div>
);
