"use client";

import { MapPin, Trophy, Zap, Users, Settings } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

import { HackathonCard } from "@/components/hackathon-card";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import { getUser, HACKATHONS } from "@/lib/mock-data";
import { Icons } from "@/shared/components/icons";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const user = getUser(username);
  if (!user) notFound();

  const userHackathons = HACKATHONS.filter((h) =>
    h.participants.includes(user.id)
  );
  const isOwnProfile = user.username === "evilrabbit";

  const statItems = [
    {
      icon: <Trophy size={12} />,
      label: "HACKATHONS",
      value: user.hackathonsJoined,
    },
    {
      icon: <Zap size={12} />,
      label: "KARMA",
      value: user.karma.toLocaleString(),
    },
    { icon: <Users size={12} />, label: "TEAMS", value: user.teamsCreated },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-10"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 bg-secondary border border-border/50 flex items-center justify-center">
              <span className="font-pixel text-2xl text-muted-foreground">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-green border-2 border-background" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-pixel text-xl md:text-2xl text-foreground">
                  {user.name}
                </h1>
                <p className="font-mono text-xs text-brand-green">
                  @{user.username}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {user.githubUsername && (
                  <a
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors"
                    aria-label="GitHub profile"
                  >
                    <Icons.Github className="size-14" />
                  </a>
                )}
                {isOwnProfile && (
                  <Link href="/settings/profile">
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-pixel text-[10px] tracking-wider rounded-none h-8 border-border/40 hover:border-brand-green/50 hover:text-brand-green"
                    >
                      <Settings size={11} className="mr-1.5" /> EDIT
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-lg">
              {user.bio}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={11} />
                <span className="font-mono text-[11px]">{user.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-mono text-[11px]">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px mt-6 border border-border/30 overflow-hidden">
          {statItems.map((item, i) => (
            <div key={i} className="bg-secondary/10 p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                {item.icon}
                <span className="font-mono text-[9px] tracking-widest">
                  {item.label}
                </span>
              </div>
              <p className="font-pixel text-xl text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Tech stack sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass border border-border/40 p-5 space-y-3">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              TECH_STACK
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.techs.map((tech) => (
                <TagBadge key={tech} label={tech} variant="tech" />
              ))}
            </div>
          </div>
        </div>

        {/* Hackathons */}
        <div className="md:col-span-2 space-y-4">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            HACKATHONS ({userHackathons.length})
          </p>
          {userHackathons.length === 0 ? (
            <div className="border border-dashed border-border/30 p-8 text-center">
              <p className="font-mono text-xs text-muted-foreground/50">
                No hackathons yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userHackathons.map((hackathon, i) => (
                <motion.div
                  key={hackathon.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <HackathonCard hackathon={hackathon} variant="compact" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
