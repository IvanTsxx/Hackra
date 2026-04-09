import {
  ChevronRight,
  Users,
  FileText,
  UserCheck,
  Clock,
  UserX,
  Target,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getTeamApplicationsForOwner,
  getTeamMembers,
  getTeamWithOwner,
} from "@/data/applications";
import { getAllTeams } from "@/data/teams";
import { auth } from "@/shared/lib/auth";
import { cn } from "@/shared/lib/utils";

import { ManageApplicationCard } from "./_components/manage-application-card";

export async function generateStaticParams() {
  const teams = await getAllTeams();
  return teams.map((team) => ({
    teamId: team.id,
  }));
}

export default async function ManageTeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const { teamId } = await params;

  const team = await getTeamWithOwner(teamId);
  if (!team) notFound();
  if (team.ownerId !== session.user.id) {
    redirect(`/team/${teamId}`);
  }

  const [applications, members] = await Promise.all([
    getTeamApplicationsForOwner(teamId, session.user.id),
    getTeamMembers(teamId),
  ]);

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const acceptedApps = applications.filter((a) => a.status === "ACCEPTED");
  const rejectedApps = applications.filter((a) => a.status === "REJECTED");
  const capacity = team.maxMembers;
  const currentMembers = members.length;
  const capacityPercent =
    capacity > 0 ? Math.round((currentMembers / capacity) * 100) : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4">
        <Link
          href={`/hackathon/${team.hackathon.slug}/teams`}
          className="hover:text-foreground"
        >
          TEAMS
        </Link>
        <ChevronRight size={10} />
        <Link href={`/team/${team.id}`} className="hover:text-foreground">
          {team.name.toUpperCase()}
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">MANAGE</span>
      </div>

      {/* Team header */}
      <div className="mb-8 space-y-2">
        <p className="  text-xs text-brand-green tracking-widest">manage</p>
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
          {team.name.toUpperCase()}
        </h1>
        {team.description && (
          <p className="  text-sm text-muted-foreground max-w-xl">
            {team.description}
          </p>
        )}
      </div>

      {/* Team stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<Users size={14} />}
          label="MEMBERS"
          value={`${currentMembers}/${capacity}`}
          color="text-brand-purple"
        />
        <StatCard
          icon={<FileText size={14} />}
          label="TOTAL APPS"
          value={String(applications.length)}
          color="text-foreground"
        />
        <StatCard
          icon={<Clock size={14} />}
          label="PENDING"
          value={String(pendingApps.length)}
          color="text-muted-foreground"
        />
        <StatCard
          icon={<UserCheck size={14} />}
          label="ACCEPTED"
          value={String(acceptedApps.length)}
          color="text-brand-green"
        />
      </div>

      {/* Capacity bar */}
      {capacity > 0 && (
        <div className="mb-8 glass border border-border/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs tracking-wider text-muted-foreground">
              TEAM CAPACITY
            </span>
            <span className="  text-xs text-foreground">
              {currentMembers} / {capacity} ({capacityPercent}%)
            </span>
          </div>
          <div className="h-2 bg-secondary/30 border border-border/30">
            <div
              className={cn(
                "h-full transition-all",
                capacityPercent >= 100
                  ? "bg-brand-green/60"
                  : capacityPercent >= 75
                    ? "bg-brand-purple/60"
                    : "bg-brand-green/40"
              )}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Applications section with tabs */}
      <section className="mb-10">
        <h2 className="font-pixel text-sm text-brand-green tracking-wider mb-4 flex items-center gap-2">
          <Target size={14} />
          APPLICATIONS
        </h2>

        {applications.length === 0 ? (
          <div className="glass border border-border/40 p-12 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <FileText
                size={48}
                className="text-muted-foreground/30"
                strokeWidth={1}
              />
            </div>
            <h3 className="font-pixel text-sm text-foreground tracking-wider">
              NO APPLICATIONS YET
            </h3>
            <p className="  text-xs text-muted-foreground max-w-sm mx-auto">
              When people apply to join your team, their applications will
              appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending */}
            {pendingApps.length > 0 && (
              <div>
                <h3 className="font-pixel text-xs tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Clock size={12} />
                  PENDING ({pendingApps.length})
                </h3>
                <div className="space-y-4">
                  {pendingApps.map((app, i) => (
                    <ManageApplicationCard
                      key={app.id}
                      application={app}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Accepted */}
            {acceptedApps.length > 0 && (
              <div>
                <h3 className="font-pixel text-xs tracking-wider text-brand-green/70 mb-3 flex items-center gap-1.5">
                  <UserCheck size={12} />
                  ACCEPTED ({acceptedApps.length})
                </h3>
                <div className="space-y-3">
                  {acceptedApps.map((app, i) => (
                    <ManageApplicationCard
                      key={app.id}
                      application={app}
                      index={i}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected */}
            {rejectedApps.length > 0 && (
              <div>
                <h3 className="font-pixel text-xs tracking-wider text-muted-foreground/50 mb-3 flex items-center gap-1.5">
                  <UserX size={12} />
                  REJECTED ({rejectedApps.length})
                </h3>
                <div className="space-y-3">
                  {rejectedApps.map((app, i) => (
                    <ManageApplicationCard
                      key={app.id}
                      application={app}
                      index={i}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Team members section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} className="text-brand-purple" />
          <h2 className="font-pixel text-sm text-brand-purple tracking-wider">
            TEAM MEMBERS ({members.length})
          </h2>
        </div>

        {members.length === 0 ? (
          <div className="glass border border-border/40 p-12 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <Users
                size={48}
                className="text-muted-foreground/30"
                strokeWidth={1}
              />
            </div>
            <h3 className="font-pixel text-sm text-foreground tracking-wider">
              NO MEMBERS YET
            </h3>
            <p className="  text-xs text-muted-foreground max-w-sm mx-auto">
              Accept applications to build your team.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="glass border border-border/40 p-4 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-none border border-border/40 bg-secondary/20 flex items-center justify-center font-pixel text-xs text-foreground shrink-0">
                  {member.user.image ? (
                    <img
                      src={member.user.image}
                      alt={member.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.user.name?.charAt(0).toUpperCase() || "?"
                  )}
                </div>
                <div>
                  <p className="font-pixel text-xs text-foreground">
                    {member.user.name.toUpperCase()}
                  </p>
                  <p className="  text-xs text-muted-foreground">
                    @{member.user.username}
                  </p>
                </div>
                {member.user.techStack && member.user.techStack.length > 0 && (
                  <div className="ml-auto flex gap-1 flex-wrap justify-end">
                    {member.user.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="border border-border/40   text-xs px-1.5 py-0.5 text-foreground/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass border border-border/40 p-3 space-y-1">
      <div className={cn("flex items-center gap-1.5", color)}>
        {icon}
        <span className="font-pixel text-xs tracking-wider">{label}</span>
      </div>
      <p className="  text-lg text-foreground">{value}</p>
    </div>
  );
}
