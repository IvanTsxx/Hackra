"use client";

import { formatDate } from "date-fns";
import { Download, Link2, Share2, Trophy, Verified } from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface CertificateViewProps {
  certificate: {
    id: string;
    recipientName: string;
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
  };
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

export function CertificateView({ certificate }: CertificateViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { hackathon, user, role, place, token, createdAt } = certificate;
  const roleLabel = ROLE_LABELS[role] || role;

  // Get accent color (would come from hackathon image extraction)
  const brandColor = "#22c55e";
  const accentLight = `${brandColor}20`;
  const accentStrong = brandColor;

  const certificateUrl = `/certificate/${token}`;
  const shareText = encodeURIComponent(
    `I just completed ${hackathon.title} as ${roleLabel}! 🎉`
  );
  const shareUrl = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://hackra.com"}${certificateUrl}`
  );

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    // In a real implementation, this would generate a PDF
    // For now, we'll use the print-to-PDF approach
    window.print();
    setIsGenerating(false);
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      {/* Certificate Container */}
      <div
        id="certificate_print"
        className="max-w-4xl mx-auto rounded-3xl border-4 p-8 md:p-12 relative overflow-hidden"
        style={{
          borderColor: accentStrong,
          boxShadow: `0 0 60px ${accentLight}, 0 20px 40px rgba(0,0,0,0.1)`,
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${accentStrong} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8" style={{ color: accentStrong }} />
            <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              Certificate of Completion
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold font-heading"
            style={{ color: accentStrong }}
          >
            {roleLabel}
          </h1>
        </div>

        {/* Recipient */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground mb-2">
            This certifies that
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        {/* Event Details */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground mb-2">
            successfully completed
          </p>
          <h3 className="text-xl md:text-2xl font-bold">{hackathon.title}</h3>
          <p className="text-muted-foreground">
            {formatDate(hackathon.startDate, "MMM dd, yyyy")} •{" "}
            {hackathon.location}
          </p>
        </div>

        {/* Winner Badge */}
        {place && (
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold"
              style={{
                backgroundColor: accentStrong,
                color: "white",
              }}
            >
              <Trophy className="h-6 w-6" />
              {place === "1st" ? "🥇" : place === "2nd" ? "🥈" : "🥉"}{" "}
              {place === "1st"
                ? "FIRST PLACE"
                : place === "2nd"
                  ? "SECOND PLACE"
                  : "THIRD PLACE"}
            </div>
          </div>
        )}

        {/* Footer with verification */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Verified className="h-4 w-4" style={{ color: accentStrong }} />
            <span>Certificate ID: {token.slice(0, 8)}...</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Awarded on {formatDate(createdAt, "MMM dd, yyyy")}
          </div>
        </div>

        {/* Hackra Branding */}
        <div className="text-center mt-8">
          <p
            className="text-2xl font-bold tracking-tight"
            style={{ color: accentStrong }}
          >
            HACKRA
          </p>
          <p className="text-sm text-muted-foreground">
            Build. Compete. Together.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-4xl mx-auto mt-8 flex flex-wrap justify-center gap-4 no-print">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "gap-2"
          )}
        >
          <Download className="h-5 w-5" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>

        <a
          href={`/${hackathon.slug}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "gap-2"
          )}
        >
          <Link2 className="h-5 w-5" />
          View Hackathon
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          style={{ backgroundColor: "#000" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Share2 className="h-5 w-5" />
          Share on Twitter
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          style={{ backgroundColor: "#0077b5" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Share2 className="h-5 w-5" />
          Share on LinkedIn
        </a>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          #certificate_print {
            box-shadow: none !important;
            border: 4px solid ${accentStrong} !important;
          }
        }
      `}</style>
    </main>
  );
}
