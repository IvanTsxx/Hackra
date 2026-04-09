"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import {
  acceptApplication,
  rejectApplication,
} from "@/app/(private)/(user)/teams/_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { getTeamApplicationsForOwner } from "@/data/applications";
import { cn } from "@/shared/lib/utils";

type Application = Awaited<
  ReturnType<typeof getTeamApplicationsForOwner>
>[number];

const statusConfig: Record<string, { label: string; variant: string }> = {
  ACCEPTED: {
    label: "ACCEPTED",
    variant: "border-brand-green/40 text-brand-green bg-brand-green/5",
  },
  PENDING: {
    label: "PENDING",
    variant: "border-foreground/20 text-muted-foreground",
  },
  REJECTED: {
    label: "REJECTED",
    variant: "border-border/30 text-muted-foreground/50",
  },
};

export function ManageApplicationCard({
  application,
  index,
  readOnly = false,
}: {
  application: Application;
  index: number;
  readOnly?: boolean;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleAccept = async () => {
    setIsProcessing(true);
    const result = await acceptApplication(application.id);
    setIsProcessing(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application accepted");
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    const result = await rejectApplication({
      applicationId: application.id,
      reason: rejectReason || undefined,
    });
    setIsProcessing(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application rejected");
    }
  };

  const cfg = statusConfig[application.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="glass border border-border/40 p-5 space-y-4"
    >
      {/* Applicant info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none border border-border/40 bg-secondary/20 flex items-center justify-center font-pixel text-xs text-foreground shrink-0">
            {application.user.image ? (
              <img
                src={application.user.image}
                alt={application.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              application.user.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          <div>
            <p className="font-pixel text-xs text-foreground">
              {application.user.name.toUpperCase()}
            </p>
            <p className="  text-xs text-muted-foreground">
              @{application.user.username} · {application.user.email}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center border   rounded-none px-1.5 py-0.5 text-xs",
            cfg.variant
          )}
        >
          {cfg.label}
        </span>
      </div>

      {/* Bio */}
      {application.user.bio && (
        <p className="  text-xs text-muted-foreground line-clamp-2">
          {application.user.bio}
        </p>
      )}

      {/* Tech stack */}
      {application.user.techStack && application.user.techStack.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {application.user.techStack.map((tech) => (
            <span
              key={tech}
              className="border border-border/40   text-xs px-1.5 py-0.5 text-foreground/70"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Message */}
      {application.message && (
        <div className="border border-border/30 bg-secondary/10 p-3">
          <p className="  text-xs text-muted-foreground/60 tracking-wider mb-1">
            MESSAGE:
          </p>
          <p className="  text-xs text-foreground">{application.message}</p>
        </div>
      )}

      {/* Answers to questions */}
      {application.answers.length > 0 && (
        <div className="space-y-2">
          <p className="  text-xs text-muted-foreground/60 tracking-wider">
            ANSWERS:
          </p>
          {application.answers.map((a) => (
            <div key={a.id} className="border-l-2 border-border/30 pl-3">
              <p className="  text-xs text-muted-foreground">
                {a.question.question}
              </p>
              <p className="  text-xs text-foreground">{a.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {!readOnly && application.status === "PENDING" && (
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            size="sm"
            className="rounded-none font-pixel text-xs tracking-wider bg-brand-green/20 text-brand-green border border-brand-green/40 hover:bg-brand-green/30 h-8"
          >
            {isProcessing ? "PROCESSING..." : "ACCEPT →"}
          </Button>

          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-pixel text-xs tracking-wider border-destructive/40 text-destructive hover:bg-destructive/10 h-8"
                />
              }
            >
              REJECT →
            </DialogTrigger>
            <DialogContent className="rounded-none border-border/50 max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-pixel text-sm tracking-wider">
                  REJECT APPLICATION
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <label
                  htmlFor="reject-reason"
                  className="  text-xs text-muted-foreground"
                >
                  REASON (optional)
                </label>
                <Textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Tell the applicant why..."
                  className="rounded-none resize-none   text-xs"
                />
              </div>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button
                      variant="outline"
                      className="rounded-none font-pixel text-xs tracking-wider h-8"
                    />
                  }
                >
                  CANCEL
                </DialogClose>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="rounded-none font-pixel text-xs tracking-wider bg-destructive text-white hover:bg-destructive/90 h-8"
                >
                  {isProcessing ? "PROCESSING..." : "CONFIRM REJECT"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <p className="  text-xs text-muted-foreground/40">
        Applied{" "}
        {formatDistanceToNow(new Date(application.createdAt), {
          addSuffix: true,
        })}
      </p>
    </motion.div>
  );
}
