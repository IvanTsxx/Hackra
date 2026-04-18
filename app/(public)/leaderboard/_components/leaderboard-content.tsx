"use client";

import { Trophy, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { LeaderboardUser } from "@/data/user";

interface LeaderboardContentProps {
  initialData: {
    users: LeaderboardUser[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
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

export function LeaderboardContent({ initialData }: LeaderboardContentProps) {
  const [users, setUsers] = useState(initialData.users);
  const [page, setPage] = useState(initialData.page);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/leaderboard?page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => [...prev, ...data.users]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoading(false);
    }
  };

  const globalRank = (page - 1) * 10;

  return (
    <main className="px-2 lg:px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-brand-green" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Top {initialData.total.toLocaleString()} developers ranked by karma
            points
          </p>
        </div>

        {/* Users list */}
        <div className="space-y-3">
          {users.map((user, index) => {
            const rank = globalRank + index + 1;
            const styles = getRankStyles(index);
            return (
              <Link
                key={user.id}
                href={`/user/${user.username}`}
                className={`block ${styles.bg} ${styles.border} border p-4 transition-all hover:scale-[1.01] hover:border-brand-green/30`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {rank <= 3 ? (
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${styles.badge} text-black text-sm font-bold`}
                      >
                        {rank === 0 ? "🥇" : rank === 1 ? "🥈" : "🥉"}
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-mono text-sm">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Image
                    src={user.image || "/hackra-logo-sm.webp"}
                    alt={user.name || user.username}
                    width={48}
                    height={48}
                    className="rounded-full border border-border/40"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                      {user.position && ` · ${user.position}`}
                    </p>
                  </div>

                  {/* Karma */}
                  <div className="flex items-center gap-1">
                    <Zap size={16} className={styles.icon} />
                    <span className={`text-lg font-bold ${styles.icon}`}>
                      {user.karmaPoints.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-8 text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              variant="outline"
              className="rounded-none border-border/40 hover:border-brand-green/40"
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {/* Footer stats */}
        {!hasMore && users.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>End of leaderboard</p>
          </div>
        )}
      </div>
    </main>
  );
}
