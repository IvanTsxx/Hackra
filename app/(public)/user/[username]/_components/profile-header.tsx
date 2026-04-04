"use client";
import { MapPin, Settings } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import type { User } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/shared/components/icons";

export const ProfileHeader = ({
  user,
  isOwnProfile,
  statItems,
}: {
  user: User;
  isOwnProfile: boolean;
  statItems: { icon: React.ReactNode; label: string; value: number }[];
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
              <p className="font-mono text-xs text-brand-green">@{username}</p>
            </div>
            <div className="flex items-center gap-2">
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
                    className="font-pixel text-[10px] tracking-wider rounded-none h-8 border-border/40 hover:border-brand-green/50 hover:text-brand-green"
                  >
                    <Settings size={11} className="mr-1.5" /> EDIT
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-lg">
            {bio}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={11} />
              <span className="font-mono text-[11px]">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-mono text-[11px]">{position}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-px mt-6 border border-border/30 overflow-hidden">
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
  );
};
