import { format } from "date-fns";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ParticipantActionButtons } from "./participant-action-buttons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParticipantData {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
  };
}

interface Props {
  hackathonId: string;
  requiresApproval: boolean;
  participants: ParticipantData[];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    APPROVED: {
      className: "border-brand-green/40 text-brand-green bg-brand-green/5",
      label: "APPROVED",
    },
    PENDING: {
      className:
        "border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5",
      label: "PENDING",
    },
    REJECTED: {
      className: "border-destructive/40 text-destructive bg-destructive/5",
      label: "REJECTED",
    },
  };

  const cfg = config[status] ?? { className: "", label: status };

  return (
    <Badge variant="outline" className={`  text-xs ${cfg.className}`}>
      {cfg.label}
    </Badge>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ParticipantsManager({
  hackathonId,
  requiresApproval,
  participants,
}: Props) {
  if (participants.length === 0) {
    return (
      <div className="glass border border-border/40 p-12 text-center">
        <p className="  text-xs text-muted-foreground">No participants yet.</p>
      </div>
    );
  }

  return (
    <div className="glass border border-border/40 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead
                scope="col"
                className="  text-xs text-muted-foreground tracking-widest h-10"
              >
                USER
              </TableHead>
              <TableHead
                scope="col"
                className="  text-xs text-muted-foreground tracking-widest h-10 hidden md:table-cell"
              >
                EMAIL
              </TableHead>
              <TableHead
                scope="col"
                className="  text-xs text-muted-foreground tracking-widest h-10"
              >
                STATUS
              </TableHead>
              <TableHead
                scope="col"
                className="  text-xs text-muted-foreground tracking-widest h-10 hidden sm:table-cell"
              >
                JOINED
              </TableHead>
              {requiresApproval && (
                <TableHead
                  scope="col"
                  className="  text-xs text-muted-foreground tracking-widest h-10"
                >
                  ACTIONS
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((p) => (
              <TableRow key={p.id} className="border-border/40">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {p.user.image && (
                      <Image
                        src={p.user.image}
                        alt={p.user.name ?? p.user.username}
                        width={24}
                        height={24}
                        className="rounded-full shrink-0"
                        sizes="24px"
                      />
                    )}
                    <div>
                      <p className="  text-xs text-foreground">
                        {p.user.name ?? p.user.username}
                      </p>
                      <p className="  text-xs text-muted-foreground">
                        @{p.user.username}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="  text-xs text-muted-foreground hidden md:table-cell">
                  {p.user.email}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="  text-xs text-muted-foreground hidden sm:table-cell">
                  {format(new Date(p.createdAt), "MMM dd, yyyy")}
                </TableCell>
                {requiresApproval && (
                  <TableCell>
                    {p.status === "PENDING" && (
                      <ParticipantActionButtons
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
