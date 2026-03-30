import { HackathonCard } from "@/components/hackathons/hackathon-card";
import { getHackathons } from "@/lib/actions/hackathons";

export const metadata = {
  description: "Browse and join amazing hackathons",
  title: "Hackathons - Hackathon Hub",
};

export default async function HackathonsPage() {
  const hackathons = await getHackathons();

  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Hackathons</h1>
          <p className="text-lg text-muted-foreground">
            Discover and join exciting hackathon events
          </p>
        </div>

        {hackathons.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-lg bg-card/50">
            <p className="text-muted-foreground text-lg">
              No hackathons available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                id={hackathon.id}
                title={hackathon.title}
                slug={hackathon.slug}
                description={hackathon.description || ""}
                location={hackathon.location || "Virtual"}
                start_date={hackathon.startDate?.toISOString() || ""}
                end_date={hackathon.endDate?.toISOString() || ""}
                max_participants={hackathon.maxParticipants || 100}
                participant_count={hackathon.participantCount}
                bg_color={hackathon.accentColor || "#3b82f6"}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
