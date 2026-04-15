"use client";

import { format } from "date-fns";
import { Edit, Settings, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

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
  pendingCounts: Record<string, number>;
  isCoOrganizer?: boolean;
  onEditClick: (hackathon: HackathonRow) => void;
  onDeleteClick: (hackathon: HackathonRow) => void;
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
  isCoOrganizer,
  onEditClick,
  onDeleteClick,
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
                  <p className="  text-xs text-muted-foreground">
                    No hackathons found.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              hackathons.map((hackathon) => (
                <HackathonRow
                  key={hackathon.id}
                  hackathon={hackathon}
                  pendingCount={pendingCounts[hackathon.id] ?? 0}
                  isCoOrganizer={isCoOrganizer}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
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
            <p className="  text-xs">{tooltip}</p>
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
  isCoOrganizer,
  onEditClick,
  onDeleteClick,
}: {
  hackathon: HackathonRow;
  pendingCount: number;
  isCoOrganizer?: boolean;
  onEditClick: (hackathon: HackathonRow) => void;
  onDeleteClick: (hackathon: HackathonRow) => void;
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
            className=" text-xs text-foreground hover:text-brand-green transition-colors"
          >
            {hackathon.title.toUpperCase()}
          </a>
          {pendingCount > 0 && (
            <Badge
              variant="outline"
              className="border-brand-green/40 text-brand-green bg-brand-green/5   text-xs"
            >
              {pendingCount} PENDING
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </TableCell>
      <TableCell className="  text-xs text-muted-foreground">
        {format(new Date(hackathon.startDate), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="  text-xs text-muted-foreground">
        {hackathon._count.participants}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {!isCoOrganizer &&
            actionButton(
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
          {!isCoOrganizer &&
            actionButton(
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs  text-destructive border-destructive/30 hover:bg-destructive/10"
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
          <Link
            href={`/my-hackathons/${hackathon.id}/manage` as Route}
            className="inline-flex items-center gap-1 shrink-0 h-7 px-2 text-xs  border border-border bg-input/30 hover:bg-input/50 hover:text-foreground transition-colors"
            aria-label={`Manage ${hackathon.title}`}
          >
            <Settings size={12} />
            MANAGE
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
