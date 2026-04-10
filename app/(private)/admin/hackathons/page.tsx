import "server-only";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, MapPin, Users, Calendar, User } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
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
  DeleteButton,
  PublishButton,
  SyncButton,
} from "./_components/button-actions";

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
                    <DialogContent className="max-w-2xl overflow-x-hidden max-h-[80vh] overflow-y-auto">
                      <DialogHeader className="gap-3">
                        <DialogTitle className="text-lg">{h.title}</DialogTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={statusColors[h.status] ?? ""}>
                            {h.status}
                          </Badge>
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
                        </div>
                      </DialogHeader>
                      <DialogDescription className="flex flex-col gap-4 text-sm text-foreground">
                        {h.image && (
                          <Image
                            src={h.image}
                            alt={h.title}
                            width={600}
                            height={200}
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="w-full rounded-lg object-cover"
                            style={{ maxHeight: "200px" }}
                          />
                        )}

                        <div className="grid grid-cols-2 gap-3 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-5 shrink-0" />
                            <span>
                              {format(new Date(h.startDate), "MMM d, yyyy")}
                              {h.endDate &&
                                ` — ${format(new Date(h.endDate), "MMM d, yyyy")}`}
                            </span>
                          </div>
                          {h.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="size-5 shrink-0" />
                              <span className="truncate">{h.location}</span>
                            </div>
                          )}
                          {h.organizer && (
                            <div className="flex items-center gap-2">
                              <User className="size-5 shrink-0" />
                              <span className="truncate">
                                {h.organizer.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="size-5 shrink-0" />
                            <span>{h.participants.length} participants</span>
                          </div>
                        </div>

                        {h.externalUrl && (
                          <a
                            href={h.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-brand-green underline underline-offset-2 hover:opacity-80"
                          >
                            <ExternalLink className="size-5" />
                            View on Luma
                          </a>
                        )}

                        {h.tags && h.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {h.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {h.techs && h.techs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {h.techs.map((tech: string) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <CodeText as="p" className="mb-2">
                            ABOUT
                          </CodeText>
                          <MarkdownRenderer content={h.description} />
                        </div>
                      </DialogDescription>
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
