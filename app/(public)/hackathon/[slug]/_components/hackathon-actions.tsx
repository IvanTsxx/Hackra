import { ExternalLink, Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ShareModal } from "@/components/share-modal";
import { getCurrentUser } from "@/data/auth-dal";
import { AuthModalDialog } from "@/shared/components/auth";
import { Button } from "@/shared/components/ui/button";

import { JoinHackathonButton } from "./join-hackathon-button";

interface Props {
  hackathonId: string;
  organizerId: string;
  status: string;
  participants: { id: string }[];
  shareUrl: string;
  title: string;
  source: string | null;
  externalUrl: string | null;
  slug: string;
}

export async function HackathonActions({
  hackathonId,
  organizerId,
  status,
  participants,
  shareUrl,
  title,
  source,
  externalUrl,
}: Props) {
  const user = await getCurrentUser();

  const joined = participants.some((p) => p?.id === user?.id);
  const isOwner = user?.id === organizerId;

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:gap-2">
      {status === "UPCOMING" && !joined && !isOwner && user ? (
        <JoinHackathonButton
          hackathonId={hackathonId}
          isJoined={joined}
          isOwner={isOwner}
        />
      ) : (
        <AuthModalDialog
          isRender
          renderComponent={
            <Button
              variant="outline"
              className={` text-xs tracking-wider rounded-none h-9 px-5 transition-all ${
                joined
                  ? "bg-brand-green text-background hover:bg-brand-green/90"
                  : "bg-foreground text-background hover:bg-brand-purple/90"
              }`}
            />
          }
        >
          <span className="flex items-center gap-1">
            <Plus size={14} className="mr-1.5" />
            JOIN HACKATHON
          </span>
        </AuthModalDialog>
      )}
      <ShareModal url={shareUrl} title={title} />
      {source === "luma" && externalUrl && (
        <Button
          variant="outline"
          className="tracking-wider rounded-none border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-9 px-4"
          nativeButton={false}
          render={
            <Link
              href={externalUrl as Route}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <ExternalLink size={14} className="mr-1.5" />
          LUMA
        </Button>
      )}
    </div>
  );
}
