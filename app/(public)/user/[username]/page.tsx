import { Trophy, Zap, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { HackathonCard } from "@/components/hackathon-card";
import { TagBadge } from "@/components/tag-badge";
import { getUserByUsername } from "@/data/user";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { ProfileHeader } from "./_components/profile-header";

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
      icon: <Trophy size={12} />,
      label: "HACKATHONS CREATED",
      value: user.organizedHackathons.length,
    },
    {
      icon: <Trophy size={12} />,
      label: "HACKATHONS PARTICIPATED",
      value: user.participations.length,
    },
    {
      icon: <Zap size={12} />,
      label: "KARMA",
      value: user.karmaPoints,
    },
    {
      icon: <Users size={12} />,
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
        statItems={statItems}
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
