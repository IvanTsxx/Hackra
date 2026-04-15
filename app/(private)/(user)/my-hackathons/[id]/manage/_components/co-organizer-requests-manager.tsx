"use client";

import { format } from "date-fns";
import { Check, X, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { CoOrganizerRequestDTO } from "@/data/co-organizer-request";
import { respondToCoOrganizerRequest } from "@/shared/actions/co-organizer-request";

interface CoOrganizerRequestsManagerProps {
  _hackathonId: string;
  requests: CoOrganizerRequestDTO[];
}

export function CoOrganizerRequestsManager({
  _hackathonId,
  requests,
}: CoOrganizerRequestsManagerProps) {
  if (requests.length === 0) {
    return (
      <div className="glass border border-border/40 p-8 text-center">
        <p className="text-xs text-muted-foreground">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass border border-border/40 p-4 space-y-4">
        {requests.map((request) => (
          <RequestItem key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}

function RequestItem({ request }: { request: CoOrganizerRequestDTO }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [action, setAction] = useState<"accept" | "reject">("accept");

  const handleRespond = async () => {
    setIsProcessing(true);
    const result = await respondToCoOrganizerRequest(
      request.id,
      action === "accept",
      responseMessage || undefined
    );
    setIsProcessing(false);

    if (result.success) {
      toast.success(
        action === "accept"
          ? "Request accepted! The user is now a co-organizer."
          : "Request rejected."
      );
      // Force refresh
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to respond to request");
    }
  };

  const openResponseDialog = (selectedAction: "accept" | "reject") => {
    setAction(selectedAction);
    setShowResponseDialog(true);
  };

  return (
    <div className="border border-border/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/user/${request.user.username}`}
          className="flex items-center gap-3 group"
        >
          <Image
            src={request.user.image || ""}
            alt={request.user.name || ""}
            width={40}
            height={40}
            sizes="40px"
            className="rounded-full border border-border/40"
          />
          <div>
            <p className="text-xs text-foreground group-hover:text-brand-purple transition-colors">
              {request.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              @{request.user.username}
            </p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => openResponseDialog("accept")}
            disabled={isProcessing}
            className="h-8 text-xs rounded-none bg-brand-green hover:bg-brand-green/90"
          >
            <Check size={12} className="mr-1.5" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openResponseDialog("reject")}
            disabled={isProcessing}
            className="h-8 text-xs rounded-none"
          >
            <X size={12} className="mr-1.5" />
            Reject
          </Button>
        </div>
      </div>

      {request.message && (
        <div className="bg-secondary/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare size={10} className="text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Message
            </p>
          </div>
          <p className="text-xs text-foreground">{request.message}</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        Requested{" "}
        {format(new Date(request.createdAt), "MMM d, yyyy 'at' h:mm a")}
      </p>

      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="rounded-none border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {action === "accept" ? "Accept" : "Reject"} Request
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              You are about to{" "}
              <span
                className={
                  action === "accept" ? "text-brand-green" : "text-destructive"
                }
              >
                {action}
              </span>{" "}
              the request from{" "}
              <span className="text-foreground font-medium">
                {request.user.name} (@{request.user.username})
              </span>
              .
            </p>
            <Textarea
              placeholder={`Add a message (optional - ${
                action === "accept"
                  ? "congratulations!"
                  : "reason for rejection)"
              })`}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="rounded-none text-xs min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowResponseDialog(false)}
                className="text-xs rounded-none h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRespond}
                disabled={isProcessing}
                className={`text-xs rounded-none h-8 ${
                  action === "accept"
                    ? "bg-brand-green hover:bg-brand-green/90"
                    : "bg-destructive hover:bg-destructive/90"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : action === "accept"
                    ? "Accept Request"
                    : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
