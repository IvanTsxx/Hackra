"use client";

import { format } from "date-fns";
import { Calendar, MapPin, Users, Trophy, Wifi, Globe } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import type { HackathonGetPayload } from "@/app/generated/prisma/models";
import { Badge } from "@/components/ui/badge";

import { StatusPill, TagBadge } from "./tag-badge";
import { TimeLabel } from "./ui/time-label";

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

const DEFAULT_ACCENT = "oklch(0.72 0.19 145)";

export function HackathonCard({
  hackathon,
  variant = "default",
  i,
}: HackathonCardProps) {
  const accent = DEFAULT_ACCENT;
  /* const accentHex = hackathon.theme.bg; */
  const isLive = hackathon.status === "LIVE";
  const topPrize = hackathon.prizes[0]?.amount;

  const endDate = new Date(hackathon.endDate);
  const startDate = new Date(hackathon.startDate);

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

            <div className="shrink-0 flex items-center gap-1.5">
              <StatusPill index={i} status={hackathon.status} />
              {hackathon.source === "luma" && (
                <Badge
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 text-[8px] py-0 h-5 w-auto px-1"
                >
                  LUMA
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs text-foreground group-hover:text-brand-green transition-colors truncate">
                {hackathon.title}
              </p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={9} />
                  <span className=" text-xs">
                    {format(startDate, "MMM d")} –{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {hackathon.isOnline ? <Wifi size={9} /> : <MapPin size={9} />}
                  <span className=" text-xs">
                    {hackathon.isOnline ? "Online" : hackathon.location}
                  </span>
                </div>
              </div>
            </div>

            {topPrize && (
              <div className="flex items-center gap-1 shrink-0">
                <Trophy size={9} className="text-brand-green" />
                <span className="text-xs text-brand-green">{topPrize}</span>
              </div>
            )}
          </article>
        </Link>
      </motion.div>
    );
  }

  const hasImage = hackathon.image && !hackathon.image.includes("/placeholder");

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <section
        className="border border-border/40 hover:border-border/60 transition-all duration-200 bg-card/30 overflow-hidden relative flex flex-col pb-10 group h-[300px]"
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
          <span className="absolute bottom-0 text-4xl leading-none opacity-[0.15] dark:opacity-[0.025] whitespace-nowrap">
            {hackathon.title
              .split(" ")
              .slice(0, 3)
              .join(" ")
              .split(":")
              .slice(0, 2)
              .join(" ")}
          </span>
        </div>

        {/* Header bar */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill index={i} status={hackathon.status} />
            {hackathon.source === "luma" && (
              <Badge
                variant="outline"
                className="border-purple-500/50 text-purple-400 text-[8px] py-0 h-5 px-1.5"
              >
                LUMA
              </Badge>
            )}
            {hackathon.isOnline ? (
              <span className="flex items-center gap-1  text-xs text-muted-foreground border border-border/30 px-1.5 py-0.5">
                <Globe size={8} /> REMOTE
              </span>
            ) : (
              hackathon.location !== "Online" && (
                <span className="flex items-center gap-1  text-xs text-muted-foreground border border-border/30 px-1.5 py-0.5">
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
              <span className="text-sm" style={{ color: accent }}>
                {topPrize}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="px-4 pb-3 relative z-10">
          <div className="flex items-start gap-3">
            {hasImage && hackathon.image && (
              <div className="shrink-0 w-12 h-12">
                <Image
                  src={hackathon.image}
                  alt={hackathon.title}
                  width={96}
                  height={96}
                  quality={75}
                  sizes="48px"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!hasImage && (
              <div className="shrink-0 w-12 h-12">
                <Image
                  src="/hackra-logo-sm.webp"
                  alt={hackathon.title}
                  width={96}
                  height={96}
                  sizes="48px"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-1 min-w-0">
              <Link href={`/hackathon/${hackathon.slug}`}>
                <h3 className="text-base md:text-lg group-hover:text-foreground/90 transition-colors text-balance hover:underline hover:decoration-brand-green hover:decoration-wavy hover:decoration-2 duration-200 ease-out line-clamp-2">
                  {hackathon.title}
                </h3>
              </Link>
              <TimeLabel
                status={hackathon.status}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 px-4 pb-3 relative z-10 border-t border-border/20 pt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={10} />
            <span className="text-xs">
              {format(startDate, "MMM d")} – {format(endDate, "MMM d")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={10} />
            <span className="text-xs">
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
      </section>
    </motion.article>
  );
}
