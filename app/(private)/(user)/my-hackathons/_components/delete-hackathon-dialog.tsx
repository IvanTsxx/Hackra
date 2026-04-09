"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { deleteHackathonAction } from "../_actions";

interface DeleteHackathonDialogProps {
  hackathonId: string;
  hackathonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteHackathonDialog({
  hackathonId,
  hackathonTitle,
  open,
  onOpenChange,
  onSuccess,
}: DeleteHackathonDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      const promise = deleteHackathonAction({ id: hackathonId });

      toast.promise(promise, {
        error: (err: unknown) =>
          err instanceof Error
            ? err.message
            : "Failed to delete hackathon. Please try again.",
        loading: "Deleting hackathon...",
        success: (result: { success: boolean; error?: string }) => {
          if (result.success) {
            onOpenChange(false);
            onSuccess?.();
            return "Hackathon deleted successfully.";
          }
          throw new Error(result.error ?? "Failed to delete hackathon.");
        },
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Hackathon</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {hackathonTitle}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">This will permanently delete:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>All teams</li>
            <li>All participants</li>
            <li>All sponsors</li>
            <li>All prizes</li>
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Hackathon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
