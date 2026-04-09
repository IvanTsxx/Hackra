"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { approveParticipantAction, rejectParticipantAction } from "../_actions";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParticipantRowActionsProps {
  hackathonId: string;
  participantId: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ParticipantRowActions({
  hackathonId,
  participantId,
}: ParticipantRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await toast.promise(
        approveParticipantAction({ hackathonId, participantId }),
        {
          error: (err: { error?: string }) =>
            err.error ?? "Failed to approve participant.",
          loading: "Approving participant...",
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
          loading: "Rejecting participant...",
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
        className="h-7 px-2 text-xs font-pixel text-green-600 border-green-600/30 hover:bg-green-600/10"
        disabled={isPending}
        onClick={handleApprove}
      >
        APPROVE
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-xs font-pixel text-red-600 border-red-600/30 hover:bg-red-600/10"
        disabled={isPending}
        onClick={handleReject}
      >
        REJECT
      </Button>
    </div>
  );
}
