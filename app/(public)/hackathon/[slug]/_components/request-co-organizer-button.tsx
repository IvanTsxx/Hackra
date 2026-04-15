"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { requestCoOrganizer } from "@/shared/actions/co-organizer-request";

interface RequestCoOrganizerButtonProps {
  hackathonId: string;
  _hackathonSlug: string;
  hackathonTitle: string;
  _hasExistingRequest: boolean;
  isAlreadyCoOrganizer: boolean;
  isOwner: boolean;
}

export function RequestCoOrganizerButton({
  hackathonId,
  _hackathonSlug,
  hackathonTitle,
  _hasExistingRequest,
  isAlreadyCoOrganizer,
  isOwner,
}: RequestCoOrganizerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Don't show if already a co-organizer or is the owner
  if (isAlreadyCoOrganizer || isOwner) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await requestCoOrganizer(hackathonId, message);
    setIsLoading(false);

    if (result.success) {
      toast.success("Request sent! The organizer will review your request.");
      setIsOpen(false);
      setMessage("");
    } else {
      toast.error(result.error || "Failed to send request");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          className="text-xs tracking-wider rounded-none h-9 px-4 border-brand-purple/50 text-brand-purple hover:bg-brand-purple/10"
        >
          REQUEST CO-ORGANIZER
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Request Co-Organizer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            You are requesting to become a co-organizer for{" "}
            <span className="text-foreground font-medium">
              {hackathonTitle}
            </span>
            .
          </p>
          <Textarea
            placeholder="Introduce yourself and explain why you'd like to co-organize this hackathon (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-none text-xs min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-xs rounded-none h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="text-xs rounded-none h-8 bg-brand-purple hover:bg-brand-purple/90"
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
