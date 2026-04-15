"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { approveParticipantAction, rejectParticipantAction } from "../_actions";

interface Props {
  hackathonId: string;
  participantId: string;
}

export function ParticipantActionButtons({
  hackathonId,
  participantId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await toast.promise(
        approveParticipantAction({ hackathonId, participantId }),
        {
          error: (err: { error?: string }) =>
            err.error ?? "Failed to approve participant.",
          loading: "Approving...",
          success: "Participant approved.",
        }
      );

      if ((result as { success?: boolean }).success) {
        router.refresh();
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await toast.promise(
        rejectParticipantAction({ hackathonId, participantId }),
        {
          error: (err: { error?: string }) =>
            err.error ?? "Failed to reject participant.",
          loading: "Rejecting...",
          success: "Participant rejected.",
        }
      );

      if ((result as { success?: boolean }).success) {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-3 text-xs  text-brand-green border-brand-green/30 hover:bg-brand-green/10"
        disabled={isPending}
        onClick={handleApprove}
      >
        APPROVE
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-3 text-xs  text-destructive border-destructive/30 hover:bg-destructive/10"
        disabled={isPending}
        onClick={handleReject}
      >
        REJECT
      </Button>
    </div>
  );
}
