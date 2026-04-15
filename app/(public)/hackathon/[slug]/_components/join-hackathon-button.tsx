"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { joinHackathon } from "@/app/(private)/(user)/teams/_actions";
import { Button } from "@/components/ui/button";

interface JoinHackathonButtonProps {
  hackathonId: string;
  isJoined: boolean;
  isOwner?: boolean;
}

export function JoinHackathonButton({
  hackathonId,
  isJoined: initialIsJoined,
  isOwner,
}: JoinHackathonButtonProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [isLoading, setIsLoading] = useState(false);

  // Don't show button if user is the organizer
  if (isOwner) return null;

  const handleJoin = async () => {
    setIsLoading(true);
    const result = await joinHackathon(hackathonId);
    setIsLoading(false);

    if (result.success) {
      setIsJoined(true);
      toast.success("You have joined the hackathon!");
    } else {
      toast.error(result.error || "Failed to join hackathon");
    }
  };

  return (
    <Button
      onClick={handleJoin}
      disabled={isLoading || isJoined}
      className={` text-xs tracking-wider rounded-none h-9 px-5 transition-all ${
        isJoined
          ? "bg-brand-green text-background hover:bg-brand-green/90"
          : "bg-foreground text-background hover:bg-foreground/90"
      }`}
    >
      {isLoading ? (
        "JOINING..."
      ) : isJoined ? (
        <span className="flex items-center gap-1">
          <Check size={14} className="mr-1.5" />
          JOINED
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Plus size={14} className="mr-1.5" />
          JOIN HACKATHON
        </span>
      )}
    </Button>
  );
}
