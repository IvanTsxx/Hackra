"use client";

import { motion } from "motion/react";

export const ProgressParticipants = ({
  participants,
  hackathon,
}: {
  participants: number;
  hackathon: number;
}) => (
  <div className="w-full h-1 bg-border overflow-hidden">
    <motion.div
      whileInView={{ width: `${(participants / (hackathon || 1)) * 100}%` }}
      initial={{ width: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="h-full bg-brand-green"
    />
  </div>
);
