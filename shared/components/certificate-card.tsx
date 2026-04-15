"use client";

import { format } from "date-fns";
import { Download, Link2, Share2, Trophy } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface CertificateData {
  id: string;
  recipientName: string;
  recipientEmail: string;
  role: string;
  place?: string | null;
  token: string;
  createdAt: Date;
  hackathon: {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    startDate: Date;
    endDate: Date;
    location: string;
  };
  user: {
    id: string;
    name: string;
    image?: string | null;
    username: string;
  };
}

interface CertificateCardProps {
  certificate: CertificateData;
  accentColor?: string;
  showActions?: boolean;
  className?: string;
}

const ROLE_LABELS: Record<string, string> = {
  CO_ORGANIZER: "Co-Organizer",
  FIRST_PLACE: "1st Place Winner",
  JUDGE: "Judge",
  MENTOR: "Mentor",
  ORGANIZER: "Organizer",
  PARTICIPANT: "Participant",
  SECOND_PLACE: "2nd Place Winner",
  THIRD_PLACE: "3rd Place Winner",
  WINNER: "Winner",
};

export function CertificateCard({
  certificate,
  accentColor,
  showActions = true,
  className,
}: CertificateCardProps) {
  const { hackathon } = certificate;

  // Generate accent color from hackathon image or use default
  const brandColor = accentColor || "#22c55e";

  // Generate variations
  const accentLight = `${brandColor}15`;
  const accentMedium = `${brandColor}30`;
  const accentStrong = brandColor;

  // Format dates
  const eventDate = format(hackathon.startDate, "MMMM d, yyyy");

  const roleLabel = ROLE_LABELS[certificate.role] || certificate.role;

  const certificateUrl = `/${certificate.token}`;
  const shareText = encodeURIComponent(
    `I just completed ${hackathon.title} as ${roleLabel}! 🎉`
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hackra.com";
  const shareUrl = encodeURIComponent(`${siteUrl}${certificateUrl}`);

  return (
    <Card
      className={cn("relative overflow-hidden border-2", className)}
      style={{
        borderColor: accentStrong,
        boxShadow: `0 0 40px ${accentLight}`,
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${accentLight} 0%, transparent 50%, ${accentMedium} 100%)`,
        }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-4 p-6 border-b"
        style={{ borderColor: accentMedium }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: accentLight }}
        >
          <Trophy className="h-6 w-6" style={{ color: accentStrong }} />
        </div>
        <div className="flex-1">
          <h3
            className="font-heading text-lg font-bold"
            style={{ color: accentStrong }}
          >
            {roleLabel}
          </h3>
          <p className="text-sm text-muted-foreground">{hackathon.title}</p>
        </div>
        {certificate.place && (
          <Badge
            className="font-heading text-base"
            style={{
              backgroundColor: accentStrong,
              color: "white",
            }}
          >
            #{certificate.place}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Recipient */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={certificate.user.image || ""} />
            <AvatarFallback>{certificate.recipientName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{certificate.user.name}</p>
            <p className="text-sm text-muted-foreground">
              @{certificate.user.username}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Event Date</p>
            <p className="font-medium">{eventDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{hackathon.location}</p>
          </div>
        </div>

        {/* Verification Token */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link2 className="h-3 w-3" />
          <span>Certificate ID: {certificate.token.slice(0, 12)}...</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div
          className="flex gap-2 border-t p-4"
          style={{ borderColor: accentMedium }}
        >
          <a
            href={`/certificate/${certificate.token}`}
            className={buttonVariants({
              className: "flex-1 gap-2",
              size: "sm",
              variant: "outline",
            })}
            target="_blank"
          >
            <Link2 className="h-4 w-4" />
            View
          </a>
          <a
            href={`/certificate/${certificate.token}`}
            className={buttonVariants({
              className: "flex-1 gap-2",
              size: "sm",
              variant: "outline",
            })}
            target="_blank"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            className={buttonVariants({
              className: "flex-1 gap-2",
              size: "sm",
            })}
            style={{ backgroundColor: accentStrong }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Share2 className="h-4 w-4" />
            Share
          </a>
        </div>
      )}
    </Card>
  );
}

interface CertificateBadgeProps {
  count: number;
  label?: string;
  className?: string;
}

export function CertificateBadge({
  count,
  label = "Hackathons",
  className,
}: CertificateBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Trophy className="h-5 w-5 text-yellow-500" />
      <span className="font-heading text-lg font-bold">{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
