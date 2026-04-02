"use client";

import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Trophy,
  Share2,
  Plus,
  CalendarPlus,
  ChevronRight,
  Building,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

import { AvatarGroup } from "@/components/avatar-group";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareModal } from "@/components/share-modal";
import { TagBadge, StatusPill } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { USERS } from "@/lib/mock-data";
import {
  getHackathon,
  getUserById,
  getSponsorsForHackathon,
  getTeamsForHackathon,
} from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";

export default function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const hackathon = getHackathon(slug);

  if (!hackathon) notFound();

  const organizer = getUserById(hackathon.organizerId);
  const sponsors = getSponsorsForHackathon(hackathon);
  const teams = getTeamsForHackathon(slug);
  const participants = hackathon.participants
    .map((id) => getUserById(id))
    .filter(Boolean) as (typeof USERS)[0][];

  const [shareOpen, setShareOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://hackra.dev/hackathon/${slug}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link
          href="/explore"
          className="hover:text-foreground transition-colors"
        >
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground truncate">{hackathon.title}</span>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="space-y-4">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden border border-border/40 bg-secondary/30">
            {hackathon.image && (
              <Image
                src={hackathon.image}
                alt={hackathon.title}
                fill
                className="object-cover opacity-70"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="font-pixel text-xl text-foreground/30 text-center leading-tight">
                {hackathon.title}
              </span>
            </div>
            <div className="absolute top-2 left-2">
              <StatusPill status={hackathon.status} />
            </div>
          </div>

          {/* Organizer */}
          {organizer && (
            <div className="glass border border-border/40 p-4 space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                ORGANIZER
              </p>
              <Link
                href={`/user/${organizer.username}`}
                className="flex items-center gap-3 group"
              >
                <Image
                  src={organizer.avatar}
                  alt={organizer.name}
                  width={36}
                  height={36}
                  className="border border-border/40"
                />
                <div>
                  <p className="font-mono text-xs text-foreground group-hover:text-brand-green transition-colors">
                    {organizer.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    @{organizer.username}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Participants */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
              PARTICIPANTS
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setParticipantsOpen(true)}
                className="flex items-center gap-2 group"
              >
                <AvatarGroup users={participants} max={5} />
                <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {participants.length} / {hackathon.maxParticipants}
                </span>
              </button>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(participants.length / hackathon.maxParticipants) * 100}%`,
                }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-brand-green"
              />
            </div>
          </div>

          {/* Teams */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TEAMS
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-foreground">
                {teams.length} teams formed
              </span>
              <Link href={`/hackathon/${slug}/teams`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 rounded-none"
                >
                  VIEW →
                </Button>
              </Link>
            </div>
          </div>

          {/* Tags */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TAGS
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.tags.map((t) => (
                <TagBadge key={t} label={t} variant="default" size="md" />
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TECHNOLOGIES
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.techs.map((t) => (
                <TagBadge key={t} label={t} variant="tech" size="md" />
              ))}
            </div>
          </div>

          {/* Sponsors */}
          {sponsors.length > 0 && (
            <div className="glass border border-border/40 p-4 space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                SPONSORS
              </p>
              <div className="space-y-2">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="flex items-center gap-2">
                    <Building size={11} className="text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {sponsor.name}
                    </span>
                    <TagBadge
                      label={sponsor.tier.toUpperCase()}
                      variant="green"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="space-y-6">
          {/* Title + actions */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-pixel text-2xl md:text-3xl text-foreground leading-tight text-balance"
            >
              {hackathon.title}
            </motion.h1>

            {/* Meta */}
            <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-brand-green" />
                <span>
                  {format(new Date(hackathon.startDate), "MMM d, yyyy HH:mm")} —{" "}
                  {format(new Date(hackathon.endDate), "MMM d, yyyy HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-brand-green" />
                <span>
                  {hackathon.isOnline ? "Online Event" : hackathon.location}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setJoined(!joined)}
                className={`font-pixel text-xs tracking-wider rounded-none h-9 px-5 transition-all ${
                  joined
                    ? "bg-brand-green text-background hover:bg-brand-green/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {joined ? "✓ JOINED" : "+ JOIN HACKATHON"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShareOpen(true)}
                className="font-pixel text-xs tracking-wider rounded-none h-9 px-4 border-border/50 hover:border-brand-green/50 hover:text-brand-green transition-all"
              >
                <Share2 size={12} className="mr-1.5" />
                INVITE
              </Button>
              <Button
                variant="ghost"
                className="font-pixel text-xs tracking-wider rounded-none h-9 px-4 text-muted-foreground hover:text-foreground"
              >
                <CalendarPlus size={12} className="mr-1.5" />
                CALENDAR
              </Button>
            </div>
          </div>

          {/* Prizes */}
          <div className="glass border border-border/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy size={13} className="text-brand-green" />
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                PRIZES
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {hackathon.prizes.map((prize, i) => (
                <div
                  key={i}
                  className={`border p-3 space-y-1 ${
                    i === 0
                      ? "border-brand-green/40 bg-brand-green/5"
                      : "border-border/30"
                  }`}
                >
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {prize.place}
                  </p>
                  <p className="font-pixel text-lg text-foreground">
                    {prize.amount}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/70">
                    {prize.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description (Markdown) */}
          <div className="glass border border-border/40 p-5">
            <CodeText as="p">ABOUT</CodeText>
            <MarkdownRenderer content={hackathon.description} />
          </div>

          {/* Teams CTA */}
          <div className="glass border border-border/40 p-5 flex items-center justify-between">
            <div>
              <p className="font-pixel text-sm text-foreground">
                FIND YOUR TEAM
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {teams.length} team{teams.length !== 1 ? "s" : ""} looking for
                members
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/hackathon/${slug}/teams`}>
                <Button
                  variant="outline"
                  className="tracking-wider rounded-none border-border/50 hover:border-brand-green/50 hover:text-brand-green h-8 px-4 transition-all"
                >
                  BROWSE TEAMS
                </Button>
              </Link>
              <Button
                className="tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-8 px-4"
                nativeButton={false}
                type="button"
              >
                <Link
                  href={`/hackathon/${slug}/teams/create`}
                  className="flex items-center"
                >
                  <Plus size={11} className="mr-1" />
                  CREATE TEAM
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        url={shareUrl}
        title={hackathon.title}
      />

      {/* Participants modal */}
      <Dialog open={participantsOpen} onOpenChange={setParticipantsOpen}>
        <DialogContent className="rounded-none border-border/50 max-w-md max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              <CodeText>PARTICIPANTS ({participants.length})</CodeText>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {participants.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.username}`}
                onClick={() => setParticipantsOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-secondary/40 transition-colors"
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div>
                  <p className="font-mono text-xs text-foreground">
                    {user.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
                <TagBadge
                  label={user.role}
                  variant="default"
                  className="ml-auto"
                />
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
