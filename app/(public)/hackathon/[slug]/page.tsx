import { format } from "date-fns";
import { Calendar, MapPin, Trophy, ChevronRight, Building } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvatarGroup } from "@/components/avatar-group";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareModal } from "@/components/share-modal";
import { TagBadge, StatusPill } from "@/components/tag-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllHackathons, getHackathon } from "@/data/hackatons";
import { getSponsorsForHackathon } from "@/data/sponsors";
import { getTeamsForHackathon } from "@/data/teams";
import { getUserById } from "@/data/user";
import { CodeText } from "@/shared/components/code-text";
import { auth } from "@/shared/lib/auth";

import { CreateTeamButton } from "./_components/create-team-button";
import { HackatonTitle } from "./_components/hackaton-title";
import { JoinHackathonButton } from "./_components/join-hackathon-button";
import { ProgressParticipants } from "./_components/progress-participants";

export const generateStaticParams = async () => {
  const hackathons = await getAllHackathons();
  return hackathons.map((hackathon) => ({
    slug: hackathon.slug,
  }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);
  if (!hackathon) notFound();

  const keywords = [...hackathon.tags, ...hackathon.techs].slice(0, 10);

  return {
    alternates: {
      canonical: `https://hackra.vercel.app/hackathon/${slug}`,
    },
    description: hackathon.description,
    keywords: [
      ...keywords,
      "hackathon",
      "coding competition",
      "prizes",
      hackathon.isOnline ? "online hackathon" : "in-person hackathon",
    ],
    openGraph: {
      description: hackathon.description,
      locale: "en_US",
      siteName: "Hackra",
      title: `${hackathon.title} | Hackra`,
      type: "website",
      url: `https://hackra.vercel.app/hackathon/${slug}`,
    },
    title: `${hackathon.title} | Hackra`,
    twitter: {
      card: "summary_large_image",
      description: hackathon.description,
      title: `${hackathon.title} | Hackra`,
    },
  };
}

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hackathon = await getHackathon(slug);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await getUserById(session?.user?.id || "");

  if (!hackathon) notFound();

  const [organizer, sponsors, teams] = await Promise.all([
    getUserById(hackathon.organizerId),
    getSponsorsForHackathon(hackathon.id),
    getTeamsForHackathon(slug),
  ]);

  const participants = hackathon.participants.map(({ user }) => user);

  const joined = participants.some(
    (participant) => participant?.id === user?.id
  );

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://hackra.vercel.app/hackathon/${slug}`;

  const hasImage = hackathon.image && !hackathon.image.includes("/placeholder");

  return (
    <main className="px-4 lg:px-6 py-20 bg-background">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4">
        <Link
          href="/explore"
          className="hover:text-foreground transition-colors"
        >
          HACKATHONS
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground truncate">{hackathon.title}</span>
        {hackathon.source === "luma" && (
          <Badge
            variant="outline"
            className="ml-2 border-purple-500/50 text-purple-400 text-[10px]"
          >
            LUMA
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="space-y-4">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden border border-border/40 bg-secondary/30">
            {hasImage && (
              <Image
                // oxlint-disable-next-line typescript/no-non-null-assertion
                src={hackathon.image!}
                alt={hackathon.title}
                width={1600}
                height={1600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                priority
                className="object-cover object-center w-full h-full"
              />
            )}
            {!hasImage && (
              <div className="relative">
                <Image
                  src="/hackra-logo.webp"
                  alt={hackathon.title}
                  width={1600}
                  height={1600}
                  className="w-full h-full aspect-4/3 object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                />

                <span className="text-xl absolute bottom-0 inset-x-0 pb-2 text-muted-foreground dark:text-foreground/30 text-center leading-tight">
                  {hackathon.title}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <StatusPill index={0} status={hackathon.status} />
            </div>
          </div>

          {/* Organizer */}
          {organizer && (
            <div className="glass border border-border/40 p-4 space-y-3">
              <p className="  text-xs text-muted-foreground tracking-widest">
                ORGANIZER
              </p>
              <Link
                href={`/user/${organizer.username}`}
                className="flex items-center gap-3 group"
              >
                <Image
                  src={organizer.image || ""}
                  alt={organizer.name}
                  width={36}
                  height={36}
                  className="border rounded-full border-border/40"
                />
                <div>
                  <p className="  text-xs text-foreground group-hover:text-brand-green transition-colors">
                    {organizer.name}
                  </p>
                  <p className="  text-xs text-muted-foreground">
                    @{organizer.username}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Participants */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground tracking-widest">
              PARTICIPANTS
            </p>
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger className="flex items-center gap-2 group">
                  <AvatarGroup users={participants} max={5} />
                  <span className="  text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {participants.length} / {hackathon.maxParticipants}
                  </span>
                </DialogTrigger>
                <DialogContent className="rounded-none border-border/50 max-w-md max-h-[70vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      <CodeText>PARTICIPANTS ({participants.length})</CodeText>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                    {participants.map((user, index) => (
                      <Link
                        key={user?.id}
                        href={`/user/${user?.username}`}
                        className="flex items-center gap-3 p-2 hover:bg-secondary/40 transition-colors"
                      >
                        <Image
                          src={user?.image || ""}
                          alt={user?.name || ""}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <div>
                          <p className="  text-xs text-foreground">
                            {user?.name}
                          </p>
                          <p className="  text-xs text-muted-foreground">
                            @{user?.username}
                          </p>
                        </div>
                        <TagBadge
                          label={user?.position || "N/A"}
                          variant="default"
                          className="ml-auto"
                          index={index}
                        />
                      </Link>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Progress bar */}
            <ProgressParticipants
              participants={participants.length}
              hackathon={hackathon.maxParticipants || 1}
            />
          </div>

          {/* Teams */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground tracking-widest">
              TEAMS
            </p>
            <div className="flex items-center justify-between">
              <span className="  text-xs text-foreground">
                {teams.length} teams formed
              </span>
              <Link href={`/hackathon/${slug}/teams`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 rounded-none"
                >
                  VIEW →
                </Button>
              </Link>
            </div>
          </div>

          {/* Tags */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground tracking-widest">
              TAGS
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.tags.map((t, index) => (
                <TagBadge
                  key={t}
                  label={t}
                  variant="default"
                  size="md"
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="glass border border-border/40 p-4 space-y-3">
            <p className="  text-xs text-muted-foreground tracking-widest">
              TECHNOLOGIES
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.techs.map((t, index) => (
                <TagBadge
                  key={t}
                  label={t}
                  variant="tech"
                  size="md"
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Sponsors */}
          {sponsors.length > 0 && (
            <div className="glass border border-border/40 p-4 space-y-3">
              <p className="  text-xs text-muted-foreground tracking-widest">
                SPONSORS
              </p>
              <div className="space-y-2">
                {sponsors.map((sponsor, index) => (
                  <div key={sponsor.id} className="flex items-center gap-2">
                    <Building size={11} className="text-muted-foreground" />
                    <span className="  text-xs text-muted-foreground">
                      {sponsor.name}
                    </span>
                    <TagBadge
                      label={sponsor.name.toUpperCase()}
                      variant="green"
                      size="sm"
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="space-y-6">
          {/* Title + actions */}
          <div className="space-y-4">
            <HackatonTitle title={hackathon.title} />

            {/* Meta */}
            <div className="flex flex-col sm:flex-row gap-3   text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-brand-green" />
                <span>
                  {format(new Date(hackathon.startDate), "MMM d, yyyy HH:mm")} —{" "}
                  {format(new Date(hackathon.endDate), "MMM d, yyyy HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-brand-green" />
                <span>
                  {hackathon.isOnline ? "Online Event" : hackathon.location}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <JoinHackathonButton
                hackathonId={hackathon.id}
                isJoined={joined}
                isOwner={user?.id === hackathon.organizerId}
              />
              <ShareModal url={shareUrl} title={hackathon.title} />

              {/*   <Button
                  variant="ghost"
                  className="font-pixel text-xs tracking-wider rounded-none h-9 px-4 text-muted-foreground hover:text-foreground"
                >
                  <CalendarPlus size={12} className="mr-1.5" />
                  CALENDAR
                </Button> */}
            </div>
          </div>

          {/* Prizes - solo mostrar si hay prizes */}
          {hackathon.prizes && hackathon.prizes.length > 0 && (
            <div className="glass border border-border/40 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy size={13} className="text-brand-green" />
                <p className="  text-xs text-muted-foreground tracking-widest">
                  PRIZES
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {hackathon.prizes.map((prize, i) => (
                  <div
                    key={`${prize.place}-${prize.amount}-${i}`}
                    className={`border p-3 space-y-1 ${
                      i === 0
                        ? "border-brand-green/40 bg-brand-green/5"
                        : "border-border/30"
                    }`}
                  >
                    <p className="  text-xs text-muted-foreground">
                      {prize.place}
                    </p>
                    <p className="font-pixel text-lg text-foreground">
                      {prize.amount}
                    </p>
                    <p className="  text-xs text-muted-foreground/70">
                      {prize.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description (Markdown) */}
          <div className="glass border border-border/40 p-5">
            <CodeText as="p">ABOUT</CodeText>
            <MarkdownRenderer content={hackathon.description} />
          </div>

          {/* Teams CTA */}
          <div className="glass border border-border/40 p-5 flex items-center justify-between">
            <div>
              <p className="font-pixel text-sm text-foreground">
                FIND YOUR TEAM
              </p>
              <p className="  text-xs text-muted-foreground mt-1">
                {teams.length} team{teams.length !== 1 ? "s" : ""} looking for
                members
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="tracking-wider rounded-none border-border/50 hover:border-brand-green/50 hover:text-brand-green h-8 px-4 transition-all"
                nativeButton={false}
                render={<Link href={`/hackathon/${slug}/teams`} />}
              >
                BROWSE TEAMS
              </Button>
              <CreateTeamButton
                isLoggedIn={!!user}
                slug={slug}
                isOwner={user?.id === hackathon.organizerId}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
