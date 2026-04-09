import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HackathonCard } from "@/components/hackathon-card";
import { TagBadge } from "@/components/tag-badge";
import { getAllUsers, getUserByUsername } from "@/data/user";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { ProfileHeader } from "./_components/profile-header";

export async function generateStaticParams() {
  const users = await getAllUsers();
  return users.map((user) => ({
    username: user.username,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: "User Not Found | Hackra",
    };
  }

  const hackathonsCount = user.organizedHackathons.length;
  const participationsCount = user.participations.length;

  const userDescription =
    user.bio ||
    `${user.name} has participated in ${participationsCount} hackathons and organized ${hackathonsCount} hackathons on Hackra.`;

  return {
    description: userDescription,
    openGraph: {
      description:
        user.bio ||
        `${user.name} on Hackra - ${participationsCount} participations, ${hackathonsCount} organized`,
      title: `${user.name} | Hackra`,
      type: "profile",
    },
    title: `${user.name} | Hackra`,
    twitter: {
      card: "summary_large_image",
      description: userDescription,
      title: `${user.name} | Hackra`,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const userHackathonsCreated = user.organizedHackathons;
  const userHackathonsParticipated = user.participations.map(
    (participation) => participation.hackathon
  );
  const isOwnProfile = user.username === "evilrabbit";

  const statItems = [
    {
      icon: "created",
      label: "HACKATHONS CREATED",
      value: user.organizedHackathons.length,
    },
    {
      icon: "participated",
      label: "HACKATHONS PARTICIPATED",
      value: user.participations.length,
    },
    {
      icon: "karma",
      label: "KARMA",
      value: user.karmaPoints,
    },
    {
      icon: "teams",
      label: "TEAMS CREATED",
      value: user.ownedTeams.length,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Profile header */}
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        stats={statItems}
      />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Tech stack sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass border border-border/40 p-5 space-y-3">
            <p className="  text-xs tracking-widest text-muted-foreground">
              TECH_STACK
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.techStack.map((tech, i) => (
                <TagBadge key={tech} label={tech} variant="tech" index={i} />
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="created" className="md:col-span-2 space-y-4 ">
          <TabsList className="w-full" variant="line">
            <TabsTrigger value="created">HACKATHONS CREATED</TabsTrigger>
            <TabsTrigger value="participated">
              HACKATHONS PARTICIPATED
            </TabsTrigger>
          </TabsList>
          <TabsContent value="created">
            {userHackathonsCreated.length === 0 ? (
              <div className="border border-dashed border-border/30 p-8 text-center">
                <p className="  text-xs text-muted-foreground/50">
                  No hackathons yet.
                </p>
              </div>
            ) : (
              userHackathonsCreated.map((hackathon, i) => (
                <HackathonCard
                  key={hackathon.slug}
                  hackathon={hackathon}
                  variant="compact"
                  i={i}
                />
              ))
            )}
          </TabsContent>
          <TabsContent value="participated">
            {userHackathonsParticipated.length === 0 ? (
              <div className="border border-dashed border-border/30 p-8 text-center">
                <p className="  text-xs text-muted-foreground/50">
                  No hackathons yet.
                </p>
              </div>
            ) : (
              userHackathonsParticipated.map((hackathon, i) => (
                <HackathonCard
                  key={hackathon.slug}
                  hackathon={hackathon}
                  variant="compact"
                  i={i}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
