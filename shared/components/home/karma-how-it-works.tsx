import { CodeText } from "@/shared/components/code-text";

const WAYS_TO_EARN = [
  {
    action: "CREATE HACKATHON",
    description: "Organize your own hackathon",
    karma: "+10",
  },
  {
    action: "CREATE TEAM",
    description: "Form a team for a hackathon",
    karma: "+5",
  },
  {
    action: "JOIN HACKATHON",
    description: "Participate in a hackathon",
    karma: "+2",
  },
  {
    action: "JOIN TEAM",
    description: "Become part of a team",
    karma: "+2",
  },
  {
    action: "RECEIVE UPVOTES",
    description: "Other users upvote your profile",
    karma: "+1",
  },
];

export function KarmaHowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="glass border border-border/40 p-8 md:p-12">
        <CodeText as="p" className="text-xs text-brand-green mb-6">
          KARMA_SYSTEM
        </CodeText>

        <h2 className="text-xl md:text-2xl text-foreground mb-8">
          {"// Earn karma by participating in the community"}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px">
          {WAYS_TO_EARN.map((way) => (
            <div
              key={way.action}
              className="bg-secondary/10 p-5 text-center hover:bg-secondary/20 transition-colors"
            >
              <p className="font-pixel text-brand-green text-lg mb-1">
                {way.karma}
              </p>
              <p className="text-xs text-foreground font-medium mb-2">
                {way.action}
              </p>
              <p className="text-xs text-muted-foreground">{way.description}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          {"/* Karma reflects your activity. Earn more to unlock perks! */"}
        </p>
      </div>
    </section>
  );
}
