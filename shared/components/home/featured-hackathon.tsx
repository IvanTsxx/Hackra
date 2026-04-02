"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { CodeText } from "../code-text";
import { Button } from "../ui/button";

interface FeaturedHackathonProps {
  hackathon: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    startDate?: Date | null;
    participantCount: number;
    maxParticipants?: number | null;
  };
}

export const FeaturedHackathon = ({ hackathon }: FeaturedHackathonProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="relative z-10 border-b border-border"
  >
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 border border-border bg-card/50 backdrop-blur-sm">
        <div className="flex-1">
          <CodeText
            as="p"
            className="text-[10px] uppercase tracking-widest text-primary mb-2  "
          >
            featured_event
          </CodeText>
          <h3 className="text-lg font-bold mb-1  ">{hackathon.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1  ">
            {hackathon.description}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xl font-bold   text-primary">
              {hackathon.participantCount}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest  ">
              joined
            </p>
          </div>
          <Link href={`/hackathon/${hackathon.slug}`}>
            <Button size="sm" className="uppercase tracking-wider text-xs">
              {">"} View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);
