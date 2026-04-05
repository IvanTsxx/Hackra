"use client";

import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import {
  deleteHackathonAction,
  publishHackathonAction,
  syncLumaEventAction,
} from "../../_actions";

export function PublishButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        const result = await publishHackathonAction(id);
        if (result.success) {
          toast.success("Hackathon published!");
        } else {
          toast.error(result.error ?? "Failed to publish.");
        }
      }}
    >
      <Button type="submit" variant="default" size="sm">
        Publish
      </Button>
    </form>
  );
}

export function SyncButton({
  id,
  externalUrl: _externalUrl,
}: {
  id: string;
  externalUrl: string;
}) {
  return (
    <form
      action={async () => {
        const result = await syncLumaEventAction(id);
        if (result.success) {
          toast.success("Event synced from Luma!");
        } else {
          toast.error(result.error ?? "Failed to sync.");
        }
      }}
    >
      <Button type="submit" variant="outline" size="sm">
        Sync
      </Button>
    </form>
  );
}

export function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={async () => {
        const result = await deleteHackathonAction(id);
        if (result.success) {
          toast.success(`"${title}" deleted.`);
        } else {
          toast.error(result.error ?? "Failed to delete.");
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
