// oxlint-disable typescript/no-non-null-assertion
// oxlint-disable typescript/no-non-null-asserted-optional-chain
import { formatDistanceToNow } from "date-fns";
import { FileText, Rocket } from "lucide-react";
import Link from "next/link";

import {
  getUserApplications,
  getUserParticipations,
} from "@/data/applications";
import { requireUser } from "@/data/auth-dal";
import { CodeText } from "@/shared/components/code-text";
import { cn } from "@/shared/lib/utils";

import { AnimatedSection } from "../_components/animated-section";
import { ApplicationCard } from "./_components/application-card";
import { statusConfig } from "./constants";

export default async function MyApplicationsPage() {
  const user = await requireUser();

  const [applications, participations] = await Promise.all([
    getUserApplications(user.id),
    getUserParticipations(user.id),
  ]);

  const hasAnyContent = applications.length > 0 || participations.length > 0;

  return (
    <section>
      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">navigation</CodeText>
          <h1 className="font-pixel text-2xl text-foreground">
            MY APPLICATIONS
          </h1>
        </div>
      </AnimatedSection>

      {/* Empty state when nothing at all */}
      {!hasAnyContent ? (
        <div className="glass border border-border/40 p-12 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <FileText
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
            NO APPLICATIONS YET
          </h3>
          <p className="  text-xs text-muted-foreground max-w-sm mx-auto">
            Join a team and start applying to hackathons. Your applications will
            appear here.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-pixel text-xs tracking-wider text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/10 transition-colors"
          >
            BROWSE HACKATHONS →
          </Link>
        </div>
      ) : (
        <>
          {/* Team Applications */}
          <section className="mb-10">
            <h2 className="font-pixel text-sm text-brand-green tracking-wider mb-4">
              TEAM APPLICATIONS ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="glass border border-border/40 p-8 text-center">
                <p className="  text-xs text-muted-foreground">
                  No team applications yet.{" "}
                  <Link
                    href="/explore"
                    className="text-brand-green hover:underline"
                  >
                    Browse hackathons
                  </Link>{" "}
                  to find a team.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app, i) => {
                  const cfg = statusConfig[app.status];
                  return (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      statusConfig={cfg}
                      index={i}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Hackathon Participations */}
          <section>
            <h2 className="font-pixel text-sm text-brand-purple tracking-wider mb-4">
              HACKATHON REGISTRATIONS ({participations.length})
            </h2>

            {participations.length === 0 ? (
              <div className="glass border border-border/40 p-8 text-center">
                <p className="  text-xs text-muted-foreground">
                  No hackathon registrations yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {participations.map((p, i) => {
                  const cfg = statusConfig[p.status];
                  return (
                    <div
                      key={p.id}
                      className="glass border border-border/40 p-4 flex items-center justify-between gap-4"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center border   rounded-none px-1.5 py-0.5 text-xs",
                            cfg.variant === "status-upcoming" &&
                              "border-foreground/20 text-muted-foreground",
                            cfg.variant === "status-live" &&
                              "border-brand-green/40 text-brand-green bg-brand-green/5",
                            cfg.variant === "status-ended" &&
                              "border-border/30 text-muted-foreground/50"
                          )}
                        >
                          {cfg.label}
                        </span>
                        <Link
                          href={`/hackathon/${p.hackathon.slug}`}
                          className="font-pixel text-xs text-foreground hover:text-brand-green transition-colors"
                        >
                          {p.hackathon.title.toUpperCase()}
                        </Link>
                      </div>
                      <span className="  text-xs text-muted-foreground/60">
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
