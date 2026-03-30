"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteHackathon, updateHackathon } from "@/lib/actions/hackathons";

interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  maxParticipants: number | null;
  participantCount: number;
  published: boolean | null;
}

interface DashboardContentProps {
  hackathons: Hackathon[];
}

export function DashboardContent({ hackathons }: DashboardContentProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    // oxlint-disable-next-line no-alert
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      try {
        await deleteHackathon(id);
        toast.success("Hackathon deleted successfully");
      } catch {
        toast.error("Failed to delete hackathon");
      }
    });
  };

  const handleTogglePublish = (id: string, currentlyPublished: boolean) => {
    startTransition(async () => {
      try {
        await updateHackathon(id, { published: !currentlyPublished });
        toast.success(
          currentlyPublished ? "Hackathon unpublished" : "Hackathon published"
        );
      } catch {
        toast.error("Failed to update hackathon");
      }
    });
  };

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-20 border border-border rounded-lg bg-card/50">
        <p className="text-muted-foreground mb-6">
          You haven&apos;t created any hackathons yet.
        </p>
        <Link href="/dashboard/create">
          <Button>Create Your First Hackathon</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hackathons.map((hackathon) => (
        <Card
          key={hackathon.id}
          className="p-6 hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{hackathon.title}</h2>
                <Badge
                  variant={hackathon.published ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() =>
                    handleTogglePublish(hackathon.id, !!hackathon.published)
                  }
                >
                  {hackathon.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {hackathon.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span>
                    {hackathon.startDate && hackathon.endDate
                      ? `${format(new Date(hackathon.startDate), "MMM dd")} - ${format(new Date(hackathon.endDate), "MMM dd, yyyy")}`
                      : "Date TBD"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="w-4 h-4 shrink-0" />
                  <span>{hackathon.location || "Virtual"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="w-4 h-4 shrink-0" />
                  <span>
                    {hackathon.participantCount} /{" "}
                    {hackathon.maxParticipants || 100} participants
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <Link href={`/dashboard/${hackathon.id}/edit`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <EditIcon className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => handleDelete(hackathon.id, hackathon.title)}
                className="gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Link href={`/hackathons/${hackathon.slug}`}>
              <Button variant="outline" size="sm">
                View Public Page
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
