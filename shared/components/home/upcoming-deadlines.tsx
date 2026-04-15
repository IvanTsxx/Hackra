"use client";

import { format, differenceInDays, differenceInHours } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpcomingDeadlinesProps {
  hackathons: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    endDate: Date;
  }[];
}

function getTimeRemaining(startDate: Date): string {
  const now = new Date();
  const days = differenceInDays(startDate, now);
  const hours = differenceInHours(startDate, now) % 24;

  if (days < 0) return "Ended";
  if (days === 0) return `${hours}h left`;
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

function getUrgencyLevel(startDate: Date): "urgent" | "soon" | "normal" {
  const now = new Date();
  const days = differenceInDays(startDate, now);

  if (days < 0) return "urgent";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "normal";
}

export function UpcomingDeadlines({ hackathons }: UpcomingDeadlinesProps) {
  // Filter only UPCOMING hackathons (startDate > now)
  const now = new Date();
  const upcomingHackathons = hackathons
    .filter((h) => new Date(h.startDate) > now)
    .toSorted(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  if (upcomingHackathons.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass border border-border/40 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={16} className="text-brand-purple" />
          <h2 className="text-lg text-foreground">Upcoming Deadlines</h2>
        </div>

        <div className="space-y-3">
          {upcomingHackathons.slice(0, 5).map((hackathon) => {
            const urgency = getUrgencyLevel(hackathon.startDate);
            const timeRemaining = getTimeRemaining(hackathon.startDate);

            return (
              <Link
                key={hackathon.id}
                href={`/hackathon/${hackathon.slug}`}
                className={`flex items-center justify-between p-4 border transition-all hover:scale-[1.01] ${
                  urgency === "urgent"
                    ? "border-destructive/30 bg-destructive/5"
                    : urgency === "soon"
                      ? "border-brand-purple/30 bg-brand-purple/5"
                      : "border-border/30 bg-secondary/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">
                    {hackathon.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Starts{" "}
                    {format(new Date(hackathon.startDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 ${
                      urgency === "urgent"
                        ? "text-destructive"
                        : urgency === "soon"
                          ? "text-brand-purple"
                          : "text-muted-foreground"
                    }`}
                  >
                    {timeRemaining}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {upcomingHackathons.length > 5 && (
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {upcomingHackathons.length} hackathons
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </section>
  );
}
