"use client";

import { Users, Lock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { TeamGetPayload } from "@/app/generated/prisma/models";
import { ApplyModal } from "@/app/hackathon/[slug]/teams/_components/apply-modal";
import { Button } from "@/components/ui/button";

import { AvatarGroup } from "./avatar-group";
import { TagBadge } from "./tag-badge";

interface TeamCardProps {
  team: TeamGetPayload<{
    include: {
      members: {
        include: {
          user: true;
        };
      };
      questions: true;
    };
  }>;
  i: number;
}

export function TeamCard({ team, i }: TeamCardProps) {
  const spotsLeft = team.maxMembers - team.members.length;
  const isFull = spotsLeft === 0;
  const members = team.members.map((m) => m.user);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ delay: i * 0.08, duration: 0.2 }}
      className="glass border border-border/40 rounded-none p-4 space-y-4 hover:border-border/60 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link href={`/team/${team.id}`}>
            <h3 className="font-pixel text-sm text-foreground hover:text-brand-green transition-colors">
              {team.name}
            </h3>
          </Link>
          {team.description && (
            <p className="font-mono text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {team.description}
            </p>
          )}
        </div>
        <div>
          {isFull ? (
            <TagBadge label="FULL" variant="status-ended" />
          ) : (
            <TagBadge label={`${spotsLeft} OPEN`} variant="status-live" />
          )}
        </div>
      </div>

      {/* Techs */}
      <div className="flex flex-wrap gap-1">
        {team.techs.map((tech) => (
          <TagBadge key={tech} label={tech} variant="tech" />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <AvatarGroup users={members} max={4} size="sm" />
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users size={11} />
            <span className="font-mono text-[11px]">
              {team.members.length}/{team.maxMembers}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/team/${team.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="font-pixel text-[10px] tracking-wider h-7 px-2 rounded-none"
            >
              VIEW
            </Button>
          </Link>
          {!isFull && <ApplyModal team={team} />}
          {team.questions.length > 0 && (
            <Lock size={10} className="text-muted-foreground/50" />
          )}
        </div>
      </div>
    </motion.article>
  );
}
