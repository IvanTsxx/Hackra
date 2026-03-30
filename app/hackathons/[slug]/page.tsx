import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHackathonBySlug } from "@/lib/actions/hackathons";

import { HackathonDetailContent } from "./_components/detail-content";

export const metadata = {
  description: "View details about this amazing hackathon",
  title: "Hackathon Details - Hackathon Hub",
};

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);

  if (!hackathon) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Hackathon Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The hackathon you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/hackathons">
            <Button>Back to Hackathons</Button>
          </Link>
        </div>
      </main>
    );
  }

  const startDate = new Date(hackathon.startDate);
  const endDate = new Date(hackathon.endDate);
  const isFull = hackathon.participantCount >= (hackathon.maxParticipants || 0);
  const spotsLeft =
    (hackathon.maxParticipants || 0) - hackathon.participantCount;

  return (
    <main className="min-h-screen bg-background">
      {hackathon.coverImage && (
        <div className="relative w-full h-72 bg-muted overflow-hidden">
          <img
            src={hackathon.coverImage}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{hackathon.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {hackathon.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <CalendarIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {format(startDate, "MMM dd")} -{" "}
                    {format(endDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPinIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{hackathon.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <UsersIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-semibold">
                    {hackathon.participantCount} / {hackathon.maxParticipants}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Badge variant={isFull ? "destructive" : "secondary"}>
                {isFull ? "Full" : `${spotsLeft} spots left`}
              </Badge>
              <Button disabled={isFull} size="lg">
                {isFull ? "Event Full" : "Register Now"}
              </Button>
              <Link href="/hackathons">
                <Button variant="outline" size="lg">
                  Back
                </Button>
              </Link>
            </div>
          </div>

          <HackathonDetailContent
            requirements={hackathon.requirements}
            technologies={hackathon.technologies}
            prizes={hackathon.prizes}
          />
        </div>
      </div>
    </main>
  );
}
