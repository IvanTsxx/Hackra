import { ChevronRight, Users, Code2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvatarGroup } from "@/components/avatar-group";
import { TagBadge } from "@/components/tag-badge";
import { getHackathon } from "@/data/hackatons";
import { getAllTeams, getTeamById } from "@/data/teams";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import { TeamHeader } from "./_components/team-header";

export async function generateStaticParams() {
  const teams = await getAllTeams();
  return teams.length > 0
    ? teams.map((team) => ({
        id: team.id,
      }))
    : [
        {
          id: "fallback",
        },
      ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) {
    return {
      title: "Team Not Found | Hackra",
    };
  }

  const hackathon = await getHackathon(team.hackathon.slug);

  const teamDescription =
    team.description ||
    `Team ${team.name} for ${hackathon?.title || "hackathon"}. Looking for ${team.maxMembers - team.members.length} more members.`;

  return {
    description: teamDescription,
    openGraph: {
      description:
        team.description || `Join team ${team.name} for ${hackathon?.title}`,
      title: `${team.name} | Hackra`,
      type: "website",
    },
    title: `${team.name} | Hackra`,
  };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);
  if (!team) notFound();

  const hackathon = await getHackathon(team.hackathon.slug);
  const memberUsers = team.members.map(({ user }) => user).filter(Boolean);

  const openSpots = team.maxMembers - team.members.length;
  const isFull = openSpots <= 0;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4 flex-wrap">
        <Link href="/explore" className="hover:text-foreground">
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        {hackathon && (
          <>
            <Link
              href={`/hackathon/${hackathon.slug}`}
              className="hover:text-foreground truncate max-w-[160px]"
            >
              {hackathon.title}
            </Link>
            <ChevronRight size={10} />
            <Link
              href={`/hackathon/${hackathon.slug}/teams`}
              className="hover:text-foreground"
            >
              TEAMS
            </Link>
            <ChevronRight size={10} />
          </>
        )}
        <span className="text-foreground">{team.name.toUpperCase()}</span>
      </div>

      {/* Header */}
      <TeamHeader team={team} openSpots={openSpots} isFull={isFull} />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Tech stack */}
          <div className="glass border border-border/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 size={12} />
              <span className="  text-xs tracking-widest">TECH_STACK</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.techs.map((tech, i) => (
                <TagBadge key={tech} label={tech} variant="tech" index={i} />
              ))}
            </div>
          </div>

          {/* Application questions */}
          {team.questions.length > 0 && (
            <div className="glass border border-border/40 p-5 space-y-3">
              <p className="  text-xs tracking-widest text-muted-foreground">
                APPLICATION_QUESTIONS
              </p>
              <div className="space-y-2">
                {team.questions.map((q, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="  text-xs text-brand-green/60 mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span className="  text-xs text-foreground/80">
                      {q.question}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicants count */}
          {team.applications.length > 0 && (
            <div className="border border-border/30 p-4 flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-green/30 flex items-center justify-center">
                <span className="font-pixel text-sm text-brand-green">
                  {team.applications.length}
                </span>
              </div>
              <div>
                <p className="  text-xs text-foreground">
                  PENDING APPLICATIONS
                </p>
                <p className="  text-xs text-muted-foreground">
                  Awaiting owner review
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Members */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={12} />
              <span className="  text-xs tracking-widest">
                MEMBERS ({team.members.length}/{team.maxMembers})
              </span>
            </div>
            <AvatarGroup
              users={memberUsers.filter((u): u is NonNullable<typeof u> => !!u)}
              max={4}
            />
            <div className="space-y-2 pt-1">
              {team.members.map(({ user }) => {
                if (!user) return null;
                return (
                  <Link
                    key={user.id}
                    href={`/user/${user.username}`}
                    className="flex px-2 py-3 items-center gap-4 group"
                  >
                    <div className="w-4 h-4 bg-secondary flex items-center justify-center shrink-0">
                      <Avatar>
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="  text-xs text-foreground group-hover:text-brand-green transition-colors truncate">
                        {user.name}
                      </p>
                      <p className="  text-xs text-muted-foreground">
                        {user.position}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Hackathon link */}
          {hackathon && (
            <Link href={`/hackathon/${hackathon.slug}`} className="block">
              <div className="border border-border/40 p-4 space-y-1 hover:border-brand-green/40 transition-colors group">
                <p className="  text-xs text-muted-foreground">HACKATHON</p>
                <p className="font-pixel text-xs text-foreground group-hover:text-brand-green transition-colors">
                  {hackathon.title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
