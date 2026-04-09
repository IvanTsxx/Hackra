import { format } from "date-fns";
import { headers } from "next/headers";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganizerHackathonById } from "@/data/organizer-hackathons";
import { auth } from "@/shared/lib/auth";

import { ParticipantRowActions } from "./participant-row-actions";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParticipantsListProps {
  hackathonId: string;
  requiresApproval: boolean;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    APPROVED: {
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
      label: "APPROVED",
    },
    PENDING: {
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      label: "PENDING",
    },
    REJECTED: {
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
      label: "REJECTED",
    },
  };

  const cfg = config[status] ?? { className: "", label: status };

  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export async function ParticipantsList({
  hackathonId,
  requiresApproval,
}: ParticipantsListProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id as string;

  const hackathon = await getOrganizerHackathonById(hackathonId, userId);
  const { participants } = hackathon;

  if (participants.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          No participants yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">NAME</TableHead>
              <TableHead scope="col">EMAIL</TableHead>
              <TableHead scope="col">STATUS</TableHead>
              <TableHead scope="col">JOINED</TableHead>
              {requiresApproval && <TableHead scope="col">ACTIONS</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.user.name ?? p.user.username}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.user.email}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {format(new Date(p.createdAt), "MMM dd, yyyy")}
                </TableCell>
                {requiresApproval && (
                  <TableCell>
                    {p.status === "PENDING" && (
                      <ParticipantRowActions
                        hackathonId={hackathonId}
                        participantId={p.id}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
