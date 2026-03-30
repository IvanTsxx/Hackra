"use client";

import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  image_url,
  start_date,
  end_date,
  location,
  max_participants,
  participant_count,
  bg_color,
  text_color,
}: HackathonCardProps) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const isFull = participant_count >= max_participants;
  const spotsLeft = max_participants - participant_count;

  return (
    <Link href={`/hackathons/${slug}`}>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
        style={{
          backgroundColor: bg_color || "var(--background)",
        }}
      >
        {image_url && (
          <div className="relative w-full h-40 bg-muted overflow-hidden">
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col gap-4">
          <div>
            <h3
              className="text-xl font-bold line-clamp-2 mb-2"
              style={{ color: text_color || "var(--foreground)" }}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {format(startDate, "MMM dd")} -{" "}
                {format(endDate, "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="w-4 h-4" />
              <span>
                {participant_count} / {max_participants} participants
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <Badge variant={isFull ? "destructive" : "secondary"}>
              {isFull ? "Full" : `${spotsLeft} spots left`}
            </Badge>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
