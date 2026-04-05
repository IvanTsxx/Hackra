"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Calendar, MapPin, Users, Trophy, Wifi, Globe } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { HackathonGetPayload } from "@/app/generated/prisma/models";

import { StatusPill, TagBadge } from "./tag-badge";

interface HackathonCardProps {
  hackathon: HackathonGetPayload<{
    include: {
      prizes: true;
      participants: true;
    };
  }>;
  i: number;
  variant?: "default" | "compact";
}

// Derive accent color from hackathon theme bg
function getAccentFromBg(bg: string): string {
  // Map known theme colors to specific accents
  const map: Record<string, string> = {
    "#030d0a": "oklch(0.72 0.19 145)",
    "#0a0a0a": "oklch(0.72 0.19 145)",
    "#0d0d1a": "oklch(0.72 0.19 285)",
    "#1a0a00": "oklch(0.75 0.18 50)",
  };
  return map[bg] ?? "oklch(0.72 0.19 145)";
}

export function HackathonCard({
  hackathon,
  variant = "default",
  i,
}: HackathonCardProps) {
  const accent = getAccentFromBg(hackathon.themeBg || "#0a0a0a");
  /* const accentHex = hackathon.theme.bg; */
  const isLive = hackathon.status === "LIVE";
  const topPrize = hackathon.prizes[0]?.amount;

  const endDate = new Date(hackathon.endDate);
  const startDate = new Date(hackathon.startDate);
  const timeLabel =
    hackathon.status === "LIVE"
      ? `ends ${formatDistanceToNow(endDate, { addSuffix: true })}`
      : hackathon.status === "UPCOMING"
        ? `starts ${formatDistanceToNow(startDate, { addSuffix: true })}`
        : `ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2, duration: 0.1 }}
        whileHover={{ x: 2 }}
      >
        <Link href={`/hackathon/${hackathon.slug}`} className="block group">
          <article
            className="flex items-center gap-4 border border-border/40 p-3 hover:border-border/70 transition-all duration-200 bg-card/30 overflow-hidden relative"
            style={{
              borderLeftColor: `color-mix(in oklch, ${accent} 60%, transparent)`,
              borderLeftWidth: 3,
            }}
          >
            {/* Watermark title */}
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl pointer-events-none select-none leading-none opacity-[0.04] text-foreground whitespace-nowrap"
              aria-hidden="true"
            >
              {hackathon.title.split(" ").slice(0, 2).join(" ")}
            </span>

            <div className="shrink-0">
              <StatusPill index={i} status={hackathon.status} />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs text-foreground group-hover:text-brand-green transition-colors truncate">
                {hackathon.title}
              </p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={9} />
                  <span className=" text-[9px]">
                    {format(startDate, "MMM d")} –{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {hackathon.isOnline ? <Wifi size={9} /> : <MapPin size={9} />}
                  <span className=" text-[9px]">
                    {hackathon.isOnline ? "Online" : hackathon.location}
                  </span>
                </div>
              </div>
            </div>

            {topPrize && (
              <div className="flex items-center gap-1 shrink-0">
                <Trophy size={9} className="text-brand-green" />
                <span className="text-[10px] text-brand-green">{topPrize}</span>
              </div>
            )}
          </article>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div
        className={`absolute rounded-full w-44 h-44 blur-3xl opacity-5 -top-20 -right-20`}
        style={{ backgroundColor: accent }}
      />

      <article
        className="border border-border/40 hover:border-border/60 transition-all duration-200 bg-card/30 overflow-hidden relative flex flex-col pb-10 group"
        style={{
          borderTopColor: `color-mix(in oklch, ${accent} 55%, transparent)`,
          borderTopWidth: 2,
        }}
      >
        {/* Scanline watermark */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden "
          aria-hidden="true"
        >
          <span className="absolute bottom-0 text-5xl leading-none text-foreground opacity-[0.025] whitespace-nowrap">
            {hackathon.title.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>

        {/* Header bar */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill index={i} status={hackathon.status} />
            {hackathon.isOnline ? (
              <span className="flex items-center gap-1  text-[9px] text-muted-foreground border border-border/30 px-1.5 py-0.5">
                <Globe size={8} /> REMOTE
              </span>
            ) : (
              hackathon.location !== "Online" && (
                <span className="flex items-center gap-1  text-[9px] text-muted-foreground border border-border/30 px-1.5 py-0.5">
                  <MapPin size={8} /> {hackathon.location.split(",")[0]}
                </span>
              )
            )}
          </div>
          {topPrize && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 shrink-0"
              style={{
                backgroundColor: `color-mix(in oklch, ${accent} 12%, transparent)`,
                border: `1px solid color-mix(in oklch, ${accent} 30%, transparent)`,
              }}
            >
              <Trophy size={10} style={{ color: accent }} />
              <span className="text-[11px]" style={{ color: accent }}>
                {topPrize}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="px-4 pb-3 relative z-10">
          <Link href={`/hackathon/${hackathon.slug}`}>
            <h3 className="text-base md:text-lg leading-tight text-foreground group-hover:text-foreground/90 transition-colors text-balance hover:underline hover:decoration-brand-green hover:decoration-wavy hover:decoration-2 duration-200 ease-out">
              {hackathon.title}
            </h3>
          </Link>
          <p className=" text-[10px] text-muted-foreground/60 mt-1">
            {timeLabel}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 px-4 pb-3 relative z-10 border-t border-border/20 pt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={10} />
            <span className=" text-[10px]">
              {format(startDate, "MMM d")} – {format(endDate, "MMM d")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={10} />
            <span className=" text-[10px]">
              {hackathon.participants.length}
              <span className="text-muted-foreground/50">
                /{hackathon.maxParticipants}
              </span>
            </span>
          </div>
        </div>

        {/* Tags + Techs */}
        <div className="px-4 pb-4 pt-1 space-y-2 relative z-10">
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.slice(0, 3).map((tag, index) => (
              <TagBadge key={tag} index={index} label={tag} variant="default" />
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {hackathon.techs.slice(0, 4).map((tech, index) => (
              <TagBadge key={tech} index={index} label={tech} variant="tech" />
            ))}
            {hackathon.techs.length > 4 && (
              <TagBadge
                index={hackathon.techs.length - 4 + 1}
                label={`+${hackathon.techs.length - 4}`}
                variant="tech"
              />
            )}
          </div>
        </div>

        {/* Bottom live indicator */}
        {isLive && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
            style={{
              background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
            }}
          />
        )}
      </article>
    </motion.div>
  );
}
