"use client";

import { Users, Lock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/mock-data";
import { USERS } from "@/lib/mock-data";

import { AvatarGroup } from "./avatar-group";
import { TagBadge } from "./tag-badge";

interface TeamCardProps {
  team: Team;
  onApply?: (team: Team) => void;
}

export function TeamCard({ team, onApply }: TeamCardProps) {
  const members = team.members
    .map((m) => USERS.find((u) => u.id === m.userId))
    .filter(Boolean) as (typeof USERS)[0][];
  const spotsLeft = team.maxMembers - team.members.length;
  const isFull = spotsLeft === 0;

  return (
    <motion.article
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
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
          {!isFull && onApply && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApply(team)}
              className="font-pixel text-[10px] tracking-wider h-7 px-2 rounded-none border-foreground/30 hover:border-brand-green/60 hover:text-brand-green transition-all"
            >
              APPLY
            </Button>
          )}
          {team.questions.length > 0 && (
            <Lock size={10} className="text-muted-foreground/50" />
          )}
        </div>
      </div>
    </motion.article>
  );
}
