"use client";

import { Trophy, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Leader {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  karmaPoints: number;
  position: string | null;
}

interface LeadershipBoardProps {
  leaders: Leader[];
}

function getRankStyles(index: number) {
  switch (index) {
    case 0: {
      return {
        badge: "bg-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/40",
        icon: "text-yellow-500",
      };
    }
    case 1: {
      return {
        badge: "bg-gray-400",
        bg: "bg-gray-400/10",
        border: "border-gray-400/40",
        icon: "text-gray-400",
      };
    }
    case 2: {
      return {
        badge: "bg-amber-600",
        bg: "bg-amber-600/10",
        border: "border-amber-600/40",
        icon: "text-amber-600",
      };
    }
    default: {
      return {
        badge: "bg-muted",
        bg: "bg-secondary/10",
        border: "border-border/30",
        icon: "text-muted-foreground",
      };
    }
  }
}

export function LeadershipBoard({ leaders }: LeadershipBoardProps) {
  if (leaders.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass border border-border/40 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-brand-green" />
          <h2 className="text-lg text-foreground">Top Contributors</h2>
        </div>

        {/* Top 3 - prominent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaders.slice(0, 3).map((leader, index) => {
            const styles = getRankStyles(index);
            return (
              <Link
                key={leader.id}
                href={`/user/${leader.username}`}
                className={`${styles.bg} ${styles.border} border p-4 transition-all hover:scale-[1.02] hover:border-brand-green/30`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {index < 3 ? (
                      <div
                        className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full ${styles.badge} text-black text-xs font-bold`}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    ) : null}
                    <Image
                      src={leader.image || "/hackra-logo-sm.webp"}
                      alt={leader.name || leader.username}
                      width={48}
                      height={48}
                      className="rounded-full border border-border/40"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">
                      {leader.name || leader.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{leader.username}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={12} className={styles.icon} />
                      <span className={`text-sm font-bold ${styles.icon}`}>
                        {leader.karmaPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Rest - compact list */}
        {leaders.length > 3 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex flex-wrap gap-2">
              {leaders.slice(3, 10).map((leader, index) => (
                <Link
                  key={leader.id}
                  href={`/user/${leader.username}`}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary/10 border border-border/30 hover:border-brand-purple/30 transition-colors"
                >
                  <span className="text-xs text-muted-foreground w-5">
                    {index + 4}
                  </span>
                  <Image
                    src={leader.image || "/hackra-logo-sm.webp"}
                    alt={leader.name || leader.username}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-xs text-foreground whitespace-nowrap">
                    {leader.username}
                  </span>
                  <Zap size={10} className="text-brand-green" />
                  <span className="text-xs text-brand-green font-medium">
                    {leader.karmaPoints}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
