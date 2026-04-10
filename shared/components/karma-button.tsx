"use client";

import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { SessionDTO } from "@/data/auth-dal";
import { giveKarma } from "@/shared/actions/karma";

import type { User } from "../lib/auth";
import { AuthModalDialog } from "./auth";

interface KarmaButtonProps {
  user?: SessionDTO | User | null;
  targetId: string;
  currentKarma: number;
  onKarmaGiven?: (newKarma: number) => void;
}

export const KarmaButton = ({
  user,
  targetId,
  currentKarma,
  onKarmaGiven,
}: KarmaButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [karma, setKarma] = useState(currentKarma);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (direction: "up" | "down") => {
    startTransition(async () => {
      const result = await giveKarma(targetId);

      if (result.success) {
        // Ensure no negative karma
        const newKarma = Math.max(0, result.newKarmaPoints);
        setKarma(newKarma);
        // Toggle vote: if clicking same direction, remove vote; otherwise switch
        setUserVote((prev) => (prev === direction ? null : direction));
        onKarmaGiven?.(newKarma);
      }
    });
  };

  const voteButton = (direction: "up" | "down") => {
    const isActive = userVote === direction;
    const activeClass =
      direction === "up"
        ? "text-brand-green hover:text-brand-green/80"
        : "text-red-500 hover:text-red-400";
    const baseClass =
      direction === "up" ? "hover:text-brand-green" : "hover:text-red-400";

    const button = (
      <Button
        size="sm"
        variant="ghost"
        className={`p-1 h-6 ${isActive ? activeClass : baseClass}`}
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          handleVote(direction);
        }}
      >
        {direction === "up" ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </Button>
    );

    if (!user) {
      return (
        <AuthModalDialog
          isRender
          renderComponent={
            <Button
              size="sm"
              variant="ghost"
              className={`p-1 h-6 ${baseClass}`}
            >
              {direction === "up" ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
            </Button>
          }
        >
          Vote
        </AuthModalDialog>
      );
    }

    return button;
  };

  const karmaDisplay = (
    <span
      className={`font-pixel text-xs tracking-wider min-w-[2rem] text-center ${
        userVote === "up"
          ? "text-brand-green"
          : userVote === "down"
            ? "text-red-500"
            : "text-foreground"
      }`}
    >
      {isPending ? "..." : karma}
    </span>
  );

  return (
    <div className="flex items-center gap-0.5">
      {voteButton("up")}
      {karmaDisplay}
      {voteButton("down")}
    </div>
  );
};
