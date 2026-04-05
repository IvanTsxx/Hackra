import { ChevronRight, Rocket, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserTeams } from "@/data/applications";
import { auth } from "@/shared/lib/auth";

import { MemberTeamCard, OwnedTeamCard } from "./_components/team-card";

export default async function MyTeamsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const { owned, memberOf } = await getUserTeams(session.user.id);

  const hasAnyContent = owned.length > 0 || memberOf.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link
          href={`/user/${session.user.username}`}
          className="hover:text-foreground"
        >
          {session.user.username?.toUpperCase()}
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">MY TEAMS</span>
      </div>

      <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8">
        MY TEAMS
      </h1>

      {/* Empty state when nothing at all */}
      {!hasAnyContent ? (
        <div className="glass border border-border/40 p-12 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Users
                size={48}
                className="text-muted-foreground/30"
                strokeWidth={1}
              />
              <Rocket
                size={20}
                className="text-brand-green/40 absolute -top-1 -right-2"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h3 className="font-pixel text-sm text-foreground tracking-wider">
            NO TEAMS YET
          </h3>
          <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
            Create a team or join one to start collaborating on hackathons.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-pixel text-[10px] tracking-wider text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/10 transition-colors"
          >
            BROWSE HACKATHONS →
          </Link>
        </div>
      ) : (
        <>
          {/* Teams you own */}
          <section className="mb-10">
            <h2 className="font-pixel text-sm text-brand-green tracking-wider mb-4">
              TEAMS YOU OWN ({owned.length})
            </h2>

            {owned.length === 0 ? (
              <div className="glass border border-border/40 p-8 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  You don&apos;t own any teams yet.{" "}
                  <Link
                    href="/explore"
                    className="text-brand-green hover:underline"
                  >
                    Browse hackathons
                  </Link>{" "}
                  to create one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {owned.map((team, i) => (
                  <OwnedTeamCard key={team.id} team={team} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Teams you're in */}
          <section>
            <h2 className="font-pixel text-sm text-brand-purple tracking-wider mb-4">
              TEAMS YOU&apos;RE IN ({memberOf.length})
            </h2>

            {memberOf.length === 0 ? (
              <div className="glass border border-border/40 p-8 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  You&apos;re not a member of any teams yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberOf.map((member, i) => (
                  <MemberTeamCard key={member.id} team={member} index={i} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
