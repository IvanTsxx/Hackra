"use client";

import { ExternalLink, Send, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { TagBadge } from "@/components/tag-badge";
import type { getUserApplications } from "@/data/applications";
import { TimeLabel } from "@/shared/components/ui/time-label";

import { cancelApplication } from "../../teams/_actions";

type Application = Awaited<ReturnType<typeof getUserApplications>>[number];

interface ApplicationCardProps {
  application: Application;
  statusConfig: { label: string; variant: string; color: string };
  index: number;
}

export function ApplicationCard({
  application,
  statusConfig,
  index,
}: ApplicationCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelApplication(application.id);
    setIsCancelling(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application cancelled");
    }
  };

  const statusVariant =
    statusConfig.variant === "status-live"
      ? "green"
      : statusConfig.variant === "status-upcoming"
        ? "default"
        : "status-ended";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="glass border border-border/40 p-4 space-y-3"
    >
      {/* Header: status + team name + hackathon */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <TagBadge
            label={statusConfig.label}
            variant={statusVariant}
            index={0}
          />
          <div className="flex flex-col">
            <span className=" text-xs text-foreground">
              {application.team.name.toUpperCase()}
            </span>
            <span className="  text-xs text-muted-foreground">
              {application.team.hackathon.title.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TimeLabel date={application.createdAt}>
            <Send size={10} />
          </TimeLabel>
          {application.status === "ACCEPTED" && (
            <Link
              href={`/team/${application.team.id}`}
              className=" text-xs tracking-wider text-brand-green/80 hover:text-brand-green transition-colors flex items-center gap-1"
            >
              VIEW TEAM <ExternalLink size={10} />
            </Link>
          )}
        </div>
      </div>

      {/* Message */}
      {application.message && (
        <p className="  text-xs text-muted-foreground line-clamp-2 border-l-2 border-border/30 pl-3">
          {application.message}
        </p>
      )}

      {/* Rejection reason */}
      {application.status === "REJECTED" &&
        "rejectionReason" in application &&
        (application as { rejectionReason?: string | null })
          .rejectionReason && (
          <div className="border border-destructive/30 bg-destructive/5 p-3">
            <p className="  text-xs text-destructive/70 tracking-wider mb-1">
              REASON:
            </p>
            <p className="  text-xs text-muted-foreground">
              {
                (application as { rejectionReason?: string | null })
                  .rejectionReason
              }
            </p>
          </div>
        )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <span className="  text-xs text-muted-foreground/40 flex items-center gap-1">
          <Users size={10} />
          Owner: @{application.team.owner.username}
        </span>
        {application.status === "PENDING" && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className=" text-xs tracking-wider text-destructive/70 hover:text-destructive transition-colors disabled:opacity-50"
          >
            {isCancelling ? "CANCELLING..." : "CANCEL →"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
