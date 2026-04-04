import "server-only";
import { formatDistanceToNow } from "date-fns";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

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
import { getAdminHackathons } from "@/data/admin-hackatons";
import { CodeText } from "@/shared/components/code-text";
import { MarkdownRenderer } from "@/shared/components/markdown-renderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import {
  deleteHackathonAction,
  publishHackathonAction,
  syncLumaEventAction,
} from "../_actions";

const statusColors: Record<string, string> = {
  CANCELLED: "bg-red-500/10 text-red-500",
  DRAFT: "bg-yellow-500/10 text-yellow-500",
  ENDED: "bg-gray-500/10 text-gray-500",
  LIVE: "bg-green-500/10 text-green-500",
  UPCOMING: "bg-blue-500/10 text-blue-500",
};

export default async function AdminHackathonsPage() {
  const hackathons = await getAdminHackathons();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hackathons</h1>
        <p className="text-muted-foreground">
          Manage all hackathons — publish, sync, or delete.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hackathons yet. Import one from Luma or create manually.
                </TableCell>
              </TableRow>
            ) : (
              hackathons.map((h) => (
                <TableRow key={h.id}>
                  <Dialog>
                    <DialogTrigger>
                      <TableCell className="font-medium">{h.title}</TableCell>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{h.title}</DialogTitle>
                        <DialogDescription className="glass border border-border/40 p-5">
                          <CodeText as="p">ABOUT</CodeText>
                          <MarkdownRenderer content={h.description} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <TableCell>
                    {h.source === "luma" ? (
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-400"
                      >
                        Luma
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Manual</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[h.status] ?? ""}>
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{h.participants.length}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(h.startDate), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {h.status === "DRAFT" && h.source === "luma" && (
                        <PublishButton id={h.id} />
                      )}
                      {h.source === "luma" && (
                        <SyncButton
                          id={h.id}
                          externalUrl={h.externalUrl ?? ""}
                        />
                      )}
                      <DeleteButton id={h.id} title={h.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PublishButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const result = await publishHackathonAction(id);
        if (result.success) {
          revalidatePath("/admin/hackathons");
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

function SyncButton({
  id,
  externalUrl: _externalUrl,
}: {
  id: string;
  externalUrl: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        const result = await syncLumaEventAction(id);
        if (result.success) {
          revalidatePath("/admin/hackathons");
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

function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const result = await deleteHackathonAction(id);
        if (result.success) {
          revalidatePath("/admin/hackathons");
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
