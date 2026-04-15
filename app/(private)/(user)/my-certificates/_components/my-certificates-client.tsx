"use client";

import { formatDate } from "date-fns";
import { FileText, Award, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

interface CertificateData {
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
}

const ROLE_LABELS: Record<string, string> = {
  CO_ORGANIZER: "Co-Organizer",
  FIRST_PLACE: "1st Place",
  JUDGE: "Judge",
  MENTOR: "Mentor",
  ORGANIZER: "Organizer",
  PARTICIPANT: "Participant",
  SECOND_PLACE: "2nd Place",
  THIRD_PLACE: "3rd Place",
  WINNER: "Winner",
};

export function MyCertificatesClient({
  certificates,
}: {
  certificates: CertificateData[];
}) {
  if (certificates.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <h1 className="font-pixel text-2xl mb-8">MY CERTIFICATES</h1>

        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            You haven&apos;t earned any certificates yet.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Participate in hackathons to earn certificates!
          </p>
          <Link
            href="/explore"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse Hackathons
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      <h1 className="font-pixel text-2xl mb-2">MY CERTIFICATES</h1>
      <p className="text-muted-foreground mb-8">
        {certificates.length} certificate{certificates.length === 1 ? "" : "s"}{" "}
        earned
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((cert) => {
          const roleLabel = ROLE_LABELS[cert.role] || cert.role;
          const isWinner =
            cert.role === "WINNER" ||
            cert.place === "1st" ||
            cert.place === "2nd" ||
            cert.place === "3rd";

          return (
            <Card key={cert.id} className="overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isWinner
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-brand-green/20 text-brand-green"
                  }`}
                >
                  {isWinner ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{roleLabel}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {cert.hackathon.title}
                  </p>
                </div>
                {cert.place && (
                  <span className="text-sm font-bold text-yellow-500">
                    #{cert.place}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(cert.hackathon.startDate, "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{cert.hackathon.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0">
                <a
                  href={`/certificate/${cert.token}`}
                  className={buttonVariants({
                    className: "w-full",
                    size: "sm",
                    variant: "outline",
                  })}
                  target="_blank"
                >
                  View Certificate
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
