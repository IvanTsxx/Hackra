import { ChevronRight, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import {
  getHackathonPendingCounts,
  getOrganizerHackathons,
  getTotalPendingParticipants,
  getCoOrganizerHackathons,
} from "@/data/organizer-hackathons";
import { CodeText } from "@/shared/components/code-text";
import { auth } from "@/shared/lib/auth";

import { AnimatedSection } from "../_components/animated-section";
import { MyHackathonsClient } from "./_components/my-hackathons-client";

export const metadata = {
  description: "Manage your hackathons as an organizer.",
  title: "My Hackathons | Hackra",
};

export default async function MyHackathonsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id as string;

  const [hackathons, coOrganizedHackathons, totalPending, pendingCounts] =
    await Promise.all([
      getOrganizerHackathons(userId),
      getCoOrganizerHackathons(userId),
      getTotalPendingParticipants(userId),
      getHackathonPendingCounts(userId),
    ]);

  const hasAnyHackathons =
    hackathons.length > 0 || coOrganizedHackathons.length > 0;

  return (
    <section>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4">
        <Link
          href={`/user/${session.user.username}`}
          className="hover:text-foreground"
        >
          {session.user.username?.toUpperCase()}
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">MY HACKATHONS</span>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">navigation</CodeText>
          <div className="flex items-center gap-3">
            <h1 className="font-pixel text-2xl text-foreground">
              MY HACKATHONS
            </h1>
            {totalPending > 0 && (
              <span className="inline-flex items-center border border-brand-green/40 bg-brand-green/5   rounded-none px-2 py-0.5 text-xs text-brand-green">
                {totalPending} PENDING
              </span>
            )}
          </div>
        </div>
      </AnimatedSection>

      {hasAnyHackathons === false ? (
        <div className="glass border border-border/40 p-12 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Users
                size={48}
                className="text-muted-foreground/30"
                strokeWidth={1}
              />
            </div>
          </div>
          <h3 className="font-pixel text-sm text-foreground tracking-wider">
            NO HACKATHONS YET
          </h3>
          <p className="  text-xs text-muted-foreground max-w-sm mx-auto">
            Create your first hackathon and start accepting participants.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 font-pixel text-xs tracking-wider text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/10 transition-colors"
          >
            CREATE YOUR FIRST HACKATHON →
          </Link>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="glass border border-border/40 p-8 text-center">
              <p className="  text-xs text-muted-foreground animate-pulse">
                Loading hackathons...
              </p>
            </div>
          }
        >
          <MyHackathonsClient
            hackathons={hackathons}
            coOrganizedHackathons={coOrganizedHackathons}
            pendingCounts={pendingCounts}
          />
        </Suspense>
      )}
    </section>
  );
}
