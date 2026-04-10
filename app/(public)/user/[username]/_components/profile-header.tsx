"use client";
import { MapPin, Settings, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import type { User as DatabaseUser } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import type { SessionDTO } from "@/data/auth-dal";
import { Icons } from "@/shared/components/icons";
import { KarmaButton } from "@/shared/components/karma-button";
import type { User as SessionUser } from "@/shared/lib/auth";

type AnyUser = SessionDTO | SessionUser | DatabaseUser | null;

/*   const statItems = [
    {
      icon: <Trophy size={12} />,
      label: "HACKATHONS CREATED",
      value: user.organizedHackathons.length,
    },
    {
      icon: <Trophy size={12} />,
      label: "HACKATHONS PARTICIPATED",
      value: user.participations.length,
    },
    {
      icon: <Zap size={12} />,
      label: "KARMA",
      value: user.karmaPoints,
    },
    {
      icon: <Users size={12} />,
      label: "TEAMS CREATED",
      value: user.ownedTeams.length,
    },
  ]; */

const mapStatsIcons = {
  created: Trophy,
  karma: Zap,
  participated: Trophy,
  teams: Users,
};

export const ProfileHeader = ({
  user,
  isOwnProfile,
  stats,
  currentUser,
}: {
  user: DatabaseUser;
  isOwnProfile: boolean;
  stats: { icon: string; label: string; value: number }[];
  currentUser?: AnyUser;
}) => {
  const { name, username, githubUsername, location, position, bio, image } =
    user;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 mb-10"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          {image && !image.includes("/placeholder") ? (
            <Image
              src={image}
              alt={name}
              width={80}
              height={80}
              loading="eager"
              priority
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-secondary border border-border/50 flex items-center justify-center">
              <span className="font-pixel text-center text-2xl text-muted-foreground">
                {name}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-green border-2 border-background" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-pixel text-xl md:text-2xl text-foreground">
                {name}
              </h1>
              <p className="  text-xs text-brand-green mt-1">@{username}</p>
            </div>
            <div className="flex items-center gap-2">
              <KarmaButton
                user={currentUser}
                targetId={user.id}
                currentKarma={user.karmaPoints}
              />
              {githubUsername && (
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors"
                  aria-label="GitHub profile"
                >
                  <Icons.Github className="size-6" />
                </a>
              )}
              {isOwnProfile && (
                <Link href="/settings/profile">
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-pixel text-xs tracking-wider rounded-none h-8 border-border/40 hover:border-brand-green/50 hover:text-brand-green"
                  >
                    <Settings size={11} className="mr-1.5" /> EDIT
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <p className="  text-xs text-muted-foreground leading-relaxed max-w-lg">
            {bio}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={11} />
              <span className="  text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="  text-sm">{position}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-px mt-6 border border-border/30 overflow-hidden">
        {stats.map((item, i) => {
          const Icon = mapStatsIcons[item.icon as keyof typeof mapStatsIcons];
          return (
            <div key={i} className="bg-secondary/10 p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                <Icon size={12} />
                <span className="  text-xs tracking-widest">{item.label}</span>
              </div>
              <p className="font-pixel text-xl text-foreground">{item.value}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
