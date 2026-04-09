"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ParticipantsList } from "./participants-list";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParticipantUser {
  id: string;
  name: string | null;
  username: string;
  email: string;
}

interface Participant {
  id: string;
  status: string;
  createdAt: Date;
  user: ParticipantUser;
}

interface ParticipantsDialogProps {
  hackathonId: string;
  hackathonTitle: string;
  requiresApproval: boolean;
  participants: Participant[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ParticipantsDialog({
  hackathonId,
  hackathonTitle,
  requiresApproval,
  participants,
  open,
  onOpenChange,
}: ParticipantsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Participants — {hackathonTitle}</DialogTitle>
          <DialogDescription>
            Manage participants and review join requests.
          </DialogDescription>
        </DialogHeader>
        <ParticipantsList
          participants={participants}
          requiresApproval={requiresApproval}
          hackathonId={hackathonId}
        />
      </DialogContent>
    </Dialog>
  );
}
