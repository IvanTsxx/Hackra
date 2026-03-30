import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon, Terminal } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CodeText } from "../code-text";

interface HackathonCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  participant_count: number;
  bg_color?: string;
  text_color?: string;
}

export function HackathonCard({
  title,
  slug,
  description,
  start_date,
  end_date,
  location,
  max_participants,
  participant_count,
}: HackathonCardProps) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const isFull = participant_count >= max_participants;
  const spotsLeft = max_participants - participant_count;

  return (
    <Link href={`/hackathons/${slug}`} className="block group">
      <article className="h-full border border-border bg-card hover:border-primary/50 transition-colors p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">
              hackathon
            </span>
          </div>
          <Badge
            variant={isFull ? "destructive" : "secondary"}
            className="text-[10px] uppercase tracking-wider font-mono"
          >
            {isFull ? "FULL" : `${spotsLeft} SLOTS`}
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="flex-1">
          <h3 className="text-base font-bold font-mono line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {">"} {title}
          </h3>
          <CodeText
            as="p"
            className="text-xs text-muted-foreground font-mono line-clamp-2"
          >
            {description}
          </CodeText>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="w-3 h-3 text-primary" />
            <span>
              {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="w-3 h-3 text-primary" />
            <span className="uppercase tracking-wider">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UsersIcon className="w-3 h-3 text-primary" />
            <span>
              [{participant_count}/{max_participants}] participants
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${Math.min((participant_count / max_participants) * 100, 100)}%`,
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="text-[10px] uppercase tracking-wider font-mono"
          >
            {">"} view_details
          </Button>
        </div>
      </article>
    </Link>
  );
}
