import { ChevronRight, Settings, Shield, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/data/auth-dal";
import { hasManageAccess } from "@/data/hackathon-organizer";
import { getHackathonForManage } from "@/data/organizer-hackathons";
import { CodeText } from "@/shared/components/code-text";

import { AnimatedSection } from "../../../_components/animated-section";
import { OrganizersManager } from "./_components/organizers-manager";
import { ParticipantsManager } from "./_components/participants-manager";
import { SendEmailSection } from "./_components/send-email-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const hackathon = await getHackathonForManage(id, user.id, user.role);
  return {
    description:
      "Manage participants, co-organizers, and communicate with your hackathon attendees.",
    openGraph: {
      description:
        "Manage participants, co-organizers, and communicate with your hackathon attendees.",
      title: `${hackathon.title} | Manage Hackathon | Hackra`,
    },
    title: `${hackathon.title} | Manage Hackathon | Hackra`,
    twitter: {
      description:
        "Manage participants, co-organizers, and communicate with your hackathon attendees.",
      title: `${hackathon.title} | Manage Hackathon | Hackra`,
    },
  };
}

export default async function ManageHackathonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  // Check access before loading data
  const hasAccess = await hasManageAccess(id, user.id, user.role);
  if (!hasAccess) redirect("/my-hackathons");

  const hackathon = await getHackathonForManage(id, user.id, user.role);
  const isOwnerOrAdmin =
    user.role === "ADMIN" || hackathon.organizerId === user.id;

  // Serialize Dates for client components
  const participants = hackathon.participants.map((p) => ({
    createdAt: p.createdAt,
    id: p.id,
    status: p.status,
    user: {
      email: p.user.email,
      id: p.user.id,
      image: p.user.image,
      name: p.user.name,
      username: p.user.username,
    },
  }));

  const coOrganizers = hackathon.organizers.map((o) => ({
    addedBy: o.addedBy,
    createdAt: o.createdAt,
    id: o.id,
    user: {
      email: o.user.email,
      id: o.user.id,
      image: o.user.image,
      name: o.user.name,
      username: o.user.username,
    },
  }));

  const pendingCount = participants.filter(
    (p) => p.status === "PENDING"
  ).length;

  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4 flex-wrap">
        <Link
          href={`/user/${user.username}`}
          className="hover:text-foreground transition-colors"
        >
          {user.username.toUpperCase()}
        </Link>
        <ChevronRight size={10} />
        <Link
          href="/my-hackathons"
          className="hover:text-foreground transition-colors"
        >
          MY HACKATHONS
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground truncate max-w-[200px]">
          {hackathon.title.toUpperCase()}
        </span>
        <ChevronRight size={10} />
        <span className="text-brand-green">MANAGE</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">hackathon management</CodeText>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-pixel text-2xl text-foreground">
              {hackathon.title.toUpperCase()}
            </h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center border border-brand-green/40 bg-brand-green/5   rounded-none px-2 py-0.5 text-xs text-brand-green">
                {pendingCount} PENDING
              </span>
            )}
            {!isOwnerOrAdmin && (
              <span className="inline-flex items-center border border-brand-purple/40 bg-brand-purple/5   rounded-none px-2 py-0.5 text-xs text-brand-purple">
                <Shield size={10} className="mr-1.5" />
                CO-ORGANIZER
              </span>
            )}
          </div>
        </div>
      </AnimatedSection>

      <Tabs defaultValue="participants" className="space-y-6">
        <TabsList className="h-auto p-0 bg-transparent border border-border/40 w-full sm:w-auto">
          <TabsTrigger
            value="participants"
            className="rounded-none font-pixel text-xs tracking-wider data-[state=active]:bg-brand-green/10 data-[state=active]:text-brand-green gap-1.5 px-4 h-9"
          >
            <Users size={12} />
            PARTICIPANTS
            {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-green text-background text-[9px] font-bold">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="organizers"
            className="rounded-none font-pixel text-xs tracking-wider data-[state=active]:bg-brand-green/10 data-[state=active]:text-brand-green gap-1.5 px-4 h-9"
          >
            <Shield size={12} />
            CO-ORGANIZERS
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="rounded-none font-pixel text-xs tracking-wider data-[state=active]:bg-brand-green/10 data-[state=active]:text-brand-green gap-1.5 px-4 h-9"
          >
            <Settings size={12} />
            EMAILS
          </TabsTrigger>
        </TabsList>

        {/* ── Participants Tab ── */}
        <TabsContent value="participants" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="  text-xs text-muted-foreground">
                {participants.length} total participant
                {participants.length !== 1 ? "s" : ""}
                {hackathon.requiresApproval && " — approval required"}
              </p>
            </div>
            <ParticipantsManager
              hackathonId={hackathon.id}
              requiresApproval={hackathon.requiresApproval}
              participants={participants}
            />
          </div>
        </TabsContent>

        {/* ── Co-Organizers Tab ── */}
        <TabsContent value="organizers" className="mt-0">
          <OrganizersManager
            hackathonId={hackathon.id}
            organizerId={hackathon.organizerId}
            coOrganizers={coOrganizers}
            canManage={isOwnerOrAdmin}
          />
        </TabsContent>

        {/* ── Email Tab ── */}
        <TabsContent value="email" className="mt-0">
          <SendEmailSection hackathonId={hackathon.id} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
