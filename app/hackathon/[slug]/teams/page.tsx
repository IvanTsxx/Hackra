"use client";

import { Plus, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

import { TeamCard } from "@/components/team-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getHackathon, getTeamsForHackathon } from "@/lib/mock-data";
import type { Team } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";

function ApplyModal({
  team,
  open,
  onOpenChange,
}: {
  team: Team | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!team) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onOpenChange(false);
      setSubmitted(false);
      setAnswers([]);
      setMessage("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle>
            <CodeText className="tracking-wider">APPLY — {team.name}</CodeText>
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center space-y-2"
          >
            <p className="font-pixel text-lg text-brand-green">SENT.</p>
            <p className="font-mono text-xs text-muted-foreground">
              Application submitted successfully
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 pt-2">
            {team.questions.map((q, i) => (
              <div key={i} className="space-y-1.5">
                <label className="font-mono text-xs text-foreground">{q}</label>
                <input
                  type="text"
                  value={answers[i] || ""}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  placeholder="Your answer..."
                  className="w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs outline-none focus:border-brand-green/40"
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-muted-foreground">
                MESSAGE (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell the team why you want to join..."
                className="w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs outline-none focus:border-brand-green/40 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full rounded-none font-pixel text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 h-9"
            >
              SEND APPLICATION →
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function TeamsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const hackathon = getHackathon(slug);
  if (!hackathon) notFound();

  const teams = getTeamsForHackathon(slug);
  const [applyTeam, setApplyTeam] = useState<Team | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const openApply = (team: Team) => {
    setApplyTeam(team);
    setApplyOpen(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link href="/explore" className="hover:text-foreground">
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        <Link
          href={`/hackathon/${slug}`}
          className="hover:text-foreground truncate max-w-[200px]"
        >
          {hackathon.title}
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">TEAMS</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <CodeText as="p" className="text-brand-green tracking-widest">
            teams
          </CodeText>
          <h1 className="font-pixel text-2xl text-foreground">TEAMS</h1>
          <p className="font-mono text-xs text-muted-foreground">
            {teams.length} teams · max {hackathon.maxTeamSize} members each
          </p>
        </div>
        <Link href={`/hackathon/${slug}/teams/create`}>
          <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4">
            <Plus size={12} className="mr-1.5" /> CREATE TEAM
          </Button>
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/30 space-y-4">
          <p className="font-pixel text-sm text-muted-foreground">
            NO_TEAMS_YET
          </p>
          <Link href={`/hackathon/${slug}/teams/create`}>
            <Button
              variant="outline"
              className="font-pixel text-xs rounded-none border-brand-green/40 text-brand-green hover:bg-brand-green/5 h-8 px-4"
            >
              CREATE THE FIRST TEAM
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <TeamCard team={team} onApply={openApply} />
            </motion.div>
          ))}
        </div>
      )}
      <ApplyModal
        team={applyTeam}
        open={applyOpen}
        onOpenChange={(v) => {
          setApplyOpen(v);
          if (!v) setApplyTeam(null);
        }}
      />
    </main>
  );
}
