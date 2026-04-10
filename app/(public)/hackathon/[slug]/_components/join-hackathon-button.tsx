"use client";

import { useState } from "react";
import { toast } from "sonner";

import { joinHackathon } from "@/app/(private)/(user)/teams/_actions";
import { Button } from "@/components/ui/button";

interface JoinHackathonButtonProps {
  hackathonId: string;
  isJoined: boolean;
}

export function JoinHackathonButton({
  hackathonId,
  isJoined: initialIsJoined,
}: JoinHackathonButtonProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [isLoading, setIsLoading] = useState(false);

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
      className={`font-pixel text-xs tracking-wider rounded-none h-9 px-5 transition-all ${
        isJoined
          ? "bg-brand-green text-background hover:bg-brand-green/90"
          : "bg-foreground text-background hover:bg-foreground/90"
      }`}
    >
      {isLoading ? "JOINING..." : isJoined ? "✓ JOINED" : "+ JOIN HACKATHON"}
    </Button>
  );
}
