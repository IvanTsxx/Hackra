"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DeleteHackathonDialog } from "./delete-hackathon-dialog";
import { EditHackathonDialog } from "./edit-hackathon-dialog";
import { HackathonsTable } from "./hackathons-table";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HackathonDTO {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string;
  image: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  locationMode: string;
  isOnline: boolean;
  tags: string[];
  techs: string[];
  maxParticipants: number | null;
  maxTeamSize: number;
  requiresApproval: boolean;
  _count: {
    participants: number;
  };
}

interface MyHackathonsClientProps {
  hackathons: HackathonDTO[];
  pendingCounts: Record<string, number>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MyHackathonsClient({
  hackathons,
  pendingCounts,
}: MyHackathonsClientProps) {
  const router = useRouter();

  const [editHackathon, setEditHackathon] = useState<HackathonDTO | null>(null);
  const [deleteHackathon, setDeleteHackathon] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleEditSuccess = () => {
    setEditHackathon(null);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setDeleteHackathon(null);
    router.refresh();
  };

  return (
    <>
      <HackathonsTable
        hackathons={hackathons}
        pendingCounts={pendingCounts}
        onEditClick={(hackathon) => setEditHackathon(hackathon)}
        onDeleteClick={(hackathon) =>
          setDeleteHackathon({ id: hackathon.id, title: hackathon.title })
        }
      />

      {editHackathon && (
        <EditHackathonDialog
          hackathon={editHackathon}
          open={!!editHackathon}
          onOpenChange={(open) => {
            if (!open) {
              setEditHackathon(null);
            }
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {deleteHackathon && (
        <DeleteHackathonDialog
          hackathonId={deleteHackathon.id}
          hackathonTitle={deleteHackathon.title}
          open={!!deleteHackathon}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteHackathon(null);
            }
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
