"use client";

import { ExternalLink, Settings, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { StatusPill } from "@/components/tag-badge";
import type { getUserTeams } from "@/data/applications";
import { TimeLabel } from "@/shared/components/ui/time-label";

type OwnedTeam = Awaited<ReturnType<typeof getUserTeams>>["owned"][number];
type MemberTeam = Awaited<ReturnType<typeof getUserTeams>>["memberOf"][number];

interface OwnedTeamCardProps {
  team: OwnedTeam;
  index: number;
}

interface MemberTeamCardProps {
  team: MemberTeam;
  index: number;
}

export function OwnedTeamCard({ team, index }: OwnedTeamCardProps) {
  const memberCount = team.members.length;
  const pendingApps = team._count.applications;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="glass border border-border/40 p-4 space-y-3"
    >
      {/* Header: team name + hackathon */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/team/${team.id}`}
            className=" text-xs text-foreground hover:text-brand-green transition-colors"
          >
            {team.name.toUpperCase()}
          </Link>
          <Link
            href={`/hackathon/${team.hackathon.slug}`}
            className="  text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {team.hackathon.title.toUpperCase()}
          </Link>
        </div>
        <StatusPill status={team.hackathon.status} index={index} />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <span className="  text-xs text-muted-foreground/60 flex items-center gap-1">
          <Users size={10} />
          {memberCount}/{team.maxMembers} MEMBERS
        </span>
        {pendingApps > 0 && (
          <span className=" text-xs tracking-wider text-brand-purple/80 border border-brand-purple/30 px-2 py-0.5">
            {pendingApps} PENDING APP{pendingApps > 1 ? "S" : ""}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-border/30">
        <Link
          href={`/teams/${team.id}/manage`}
          className=" text-xs tracking-wider text-brand-green/80 hover:text-brand-green transition-colors flex items-center gap-1"
        >
          <Settings size={10} />
          MANAGE
        </Link>
        <Link
          href={`/team/${team.id}`}
          className=" text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ExternalLink size={10} />
          VIEW
        </Link>

        <TimeLabel date={team.createdAt} className="ml-auto">
          Created
        </TimeLabel>
      </div>
    </motion.div>
  );
}

export function MemberTeamCard({ team, index }: MemberTeamCardProps) {
  const memberCount = team.team.members.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="glass border border-border/40 p-4 space-y-3"
    >
      {/* Header: team name + hackathon */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/team/${team.team.id}`}
            className=" text-xs text-foreground hover:text-brand-green transition-colors"
          >
            {team.team.name.toUpperCase()}
          </Link>
          <Link
            href={`/hackathon/${team.team.hackathon.slug}`}
            className="  text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {team.team.hackathon.title.toUpperCase()}
          </Link>
        </div>
        <StatusPill status={team.team.hackathon.status} index={index} />
      </div>

      {/* Owner + members row */}
      <div className="flex items-center justify-between">
        <span className="  text-xs text-muted-foreground/60">
          Owner: @{team.team.owner.username}
        </span>
        <span className="  text-xs text-muted-foreground/60 flex items-center gap-1">
          <Users size={10} />
          {memberCount}/{team.team.maxMembers}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-border/30">
        <Link
          href={`/team/${team.team.id}`}
          className=" text-xs tracking-wider text-brand-green/80 hover:text-brand-green transition-colors flex items-center gap-1"
        >
          <ExternalLink size={10} />
          VIEW TEAM
        </Link>
        <TimeLabel date={team.joinedAt}>Joined</TimeLabel>
      </div>
    </motion.div>
  );
}
