"use client";

import { ChevronRight, Users, Code2, Lock, Unlock, Send } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

import { AvatarGroup } from "@/components/avatar-group";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTeam, getHackathon, getUserById } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const team = getTeam(id);
  if (!team) notFound();

  const hackathon = getHackathon(team.hackathonSlug);
  const memberUsers = team.members
    .map((m) => getUserById(m.userId))
    .filter(Boolean);

  const [applyOpen, setApplyOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const openSpots = team.maxMembers - team.members.length;
  const isFull = openSpots <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setApplyOpen(false);
      setSubmitted(false);
      setAnswers([]);
      setMessage("");
    }, 2000);
  };

  const inputClass =
    "w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4 flex-wrap">
        <Link href="/explore" className="hover:text-foreground">
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        {hackathon && (
          <>
            <Link
              href={`/hackathon/${hackathon.slug}`}
              className="hover:text-foreground truncate max-w-[160px]"
            >
              {hackathon.title}
            </Link>
            <ChevronRight size={10} />
            <Link
              href={`/hackathon/${hackathon.slug}/teams`}
              className="hover:text-foreground"
            >
              TEAMS
            </Link>
            <ChevronRight size={10} />
          </>
        )}
        <span className="text-foreground">{team.name.toUpperCase()}</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-3"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <CodeText as="p" className="text-brand-green tracking-widest">
              team
            </CodeText>
            <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
              {team.name.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs ${
                isFull
                  ? "border-destructive/40 text-destructive/70"
                  : "border-brand-green/40 text-brand-green"
              }`}
            >
              {isFull ? <Lock size={11} /> : <Unlock size={11} />}
              <span>
                {isFull
                  ? "FULL"
                  : `${openSpots} SPOT${openSpots !== 1 ? "S" : ""} OPEN`}
              </span>
            </div>
            {!isFull && (
              <Button
                onClick={() => setApplyOpen(true)}
                className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4"
              >
                APPLY →
              </Button>
            )}
          </div>
        </div>

        {team.description && (
          <p className="font-mono text-sm text-muted-foreground leading-relaxed max-w-xl">
            {team.description}
          </p>
        )}
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Tech stack */}
          <div className="glass border border-border/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 size={12} />
              <span className="font-mono text-[10px] tracking-widest">
                TECH_STACK
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.techs.map((tech) => (
                <TagBadge key={tech} label={tech} variant="tech" />
              ))}
            </div>
          </div>

          {/* Application questions */}
          {team.questions.length > 0 && (
            <div className="glass border border-border/40 p-5 space-y-3">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                APPLICATION_QUESTIONS
              </p>
              <div className="space-y-2">
                {team.questions.map((q, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-mono text-[10px] text-brand-green/60 mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span className="font-mono text-xs text-foreground/80">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicants count */}
          {team.applicants.length > 0 && (
            <div className="border border-border/30 p-4 flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-green/30 flex items-center justify-center">
                <span className="font-pixel text-sm text-brand-green">
                  {team.applicants.length}
                </span>
              </div>
              <div>
                <p className="font-mono text-xs text-foreground">
                  PENDING APPLICATIONS
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Awaiting owner review
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Members */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={12} />
              <span className="font-mono text-[10px] tracking-widest">
                MEMBERS ({team.members.length}/{team.maxMembers})
              </span>
            </div>
            <AvatarGroup
              users={memberUsers.filter((u): u is NonNullable<typeof u> => !!u)}
              max={4}
            />
            <div className="space-y-2 pt-1">
              {team.members.map((member) => {
                const user = getUserById(member.userId);
                if (!user) return null;
                return (
                  <Link
                    key={member.userId}
                    href={`/user/${user.username}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 bg-secondary flex items-center justify-center shrink-0">
                      <span className="font-pixel text-[8px] text-muted-foreground">
                        {user.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-foreground group-hover:text-brand-green transition-colors truncate">
                        {user.name}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {member.role.toUpperCase()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Hackathon link */}
          {hackathon && (
            <Link href={`/hackathon/${hackathon.slug}`} className="block">
              <div className="border border-border/40 p-4 space-y-1 hover:border-brand-green/40 transition-colors group">
                <p className="font-mono text-[10px] text-muted-foreground">
                  HACKATHON
                </p>
                <p className="font-pixel text-xs text-foreground group-hover:text-brand-green transition-colors">
                  {hackathon.title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* Apply dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="rounded-none border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle>
              <CodeText className="tracking-wider">
                APPLY — {team.name.toUpperCase()}
              </CodeText>
            </DialogTitle>
          </DialogHeader>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center space-y-2"
            >
              <Send size={20} className="mx-auto text-brand-green mb-3" />
              <p className="font-pixel text-lg text-brand-green">SENT.</p>
              <p className="font-mono text-xs text-muted-foreground">
                Your application was submitted.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {team.questions.map((q, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="font-mono text-xs text-foreground">
                    {q}
                  </label>
                  <input
                    type="text"
                    required
                    value={answers[i] || ""}
                    onChange={(e) => {
                      const next = [...answers];
                      next[i] = e.target.value;
                      setAnswers(next);
                    }}
                    placeholder="Your answer..."
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground">
                  COVER MESSAGE (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell the team why you want to join..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-none font-pixel text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 h-9"
              >
                SEND APPLICATION →
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
