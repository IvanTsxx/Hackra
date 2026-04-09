"use client";

import { format } from "date-fns";
import { Edit, Eye, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { HackathonDTO } from "./my-hackathons-client";

// ─── Types ───────────────────────────────────────────────────────────────────

type HackathonRow = HackathonDTO;

interface HackathonsTableProps {
  hackathons: HackathonRow[];
  pendingCounts: Map<string, number>;
  onEditClick: (hackathon: HackathonRow) => void;
  onDeleteClick: (hackathon: HackathonRow) => void;
  onParticipantsClick: (hackathon: HackathonRow) => void;
}

// ─── Status Config ───────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  CANCELLED: { label: "CANCELLED", variant: "destructive" },
  DRAFT: { label: "DRAFT", variant: "outline" },
  ENDED: { label: "ENDED", variant: "secondary" },
  LIVE: { label: "LIVE", variant: "default" },
  UPCOMING: { label: "UPCOMING", variant: "secondary" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function HackathonsTable({
  hackathons,
  pendingCounts,
  onEditClick,
  onDeleteClick,
  onParticipantsClick,
}: HackathonsTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">TITLE</TableHead>
              <TableHead scope="col">STATUS</TableHead>
              <TableHead scope="col">START DATE</TableHead>
              <TableHead scope="col">PARTICIPANTS</TableHead>
              <TableHead scope="col">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="font-mono text-xs text-muted-foreground">
                    No hackathons found.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              hackathons.map((hackathon) => (
                <HackathonRow
                  key={hackathon.id}
                  hackathon={hackathon}
                  pendingCount={pendingCounts.get(hackathon.id) ?? 0}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onParticipantsClick={onParticipantsClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Row Component ───────────────────────────────────────────────────────────

function actionButton(
  button: React.ReactNode,
  tooltip: string,
  disabled: boolean
) {
  if (disabled) {
    return (
      <TooltipProvider delay={0}>
        <Tooltip>
          <TooltipTrigger>{button}</TooltipTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return button;
}

function HackathonRow({
  hackathon,
  pendingCount,
  onEditClick,
  onDeleteClick,
  onParticipantsClick,
}: {
  hackathon: HackathonRow;
  pendingCount: number;
  onEditClick: (hackathon: HackathonRow) => void;
  onDeleteClick: (hackathon: HackathonRow) => void;
  onParticipantsClick: (hackathon: HackathonRow) => void;
}) {
  const isLive = hackathon.status === "LIVE";
  const cfg = statusConfig[hackathon.status] ?? {
    label: hackathon.status,
    variant: "outline" as const,
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <a
            href={`/hackathon/${hackathon.slug}`}
            className="font-pixel text-xs text-foreground hover:text-brand-green transition-colors"
          >
            {hackathon.title.toUpperCase()}
          </a>
          {pendingCount > 0 && (
            <Badge
              variant="outline"
              className="border-brand-green/40 text-brand-green bg-brand-green/5 font-mono text-xs"
            >
              {pendingCount} PENDING
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {format(new Date(hackathon.startDate), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {hackathon._count.participants}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {actionButton(
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs font-pixel"
              disabled={isLive}
              onClick={() => onEditClick(hackathon)}
              aria-label={`Edit ${hackathon.title}`}
            >
              <Edit size={12} />
              EDIT
            </Button>,
            "Cannot modify a live hackathon",
            isLive
          )}
          {actionButton(
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs font-pixel text-destructive border-destructive/30 hover:bg-destructive/10"
              disabled={isLive}
              onClick={() => onDeleteClick(hackathon)}
              aria-label={`Delete ${hackathon.title}`}
            >
              <Trash2 size={12} />
              DELETE
            </Button>,
            "Cannot modify a live hackathon",
            isLive
          )}
          <button
            type="button"
            onClick={() => onParticipantsClick(hackathon)}
            className="inline-flex items-center gap-1 shrink-0 h-7 px-2 text-xs font-pixel border border-border bg-input/30 hover:bg-input/50 hover:text-foreground rounded-4xl transition-colors cursor-pointer"
            aria-label={`View participants for ${hackathon.title}`}
          >
            <Eye size={12} />
            VIEW
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
