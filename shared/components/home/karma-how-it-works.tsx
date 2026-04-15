"use client";

import { Trophy, Users, Rocket, Handshake, Zap } from "lucide-react";
import { useState } from "react";

import { CodeText } from "@/shared/components/code-text";
import { cn } from "@/shared/lib/utils";

const WAYS_TO_EARN = [
  {
    action: "CREATE HACKATHON",
    color: "text-brand-green",
    description: "Organize your own hackathon",
    icon: Trophy,
    karma: "+10",
  },
  {
    action: "CREATE TEAM",
    color: "text-brand-purple",
    description: "Form a team for a hackathon",
    icon: Users,
    karma: "+5",
  },
  {
    action: "JOIN HACKATHON",
    color: "text-blue-400",
    description: "Participate in a hackathon",
    icon: Rocket,
    karma: "+2",
  },
  {
    action: "JOIN TEAM",
    color: "text-orange-400",
    description: "Become part of a team",
    icon: Handshake,
    karma: "+2",
  },
  {
    action: "RECEIVE UPVOTES",
    color: "text-yellow-400",
    description: "Other users upvote your profile",
    icon: Zap,
    karma: "+1",
  },
];

export function KarmaHowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="glass border border-border/40 p-8 md:p-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <CodeText as="p" className="text-xs text-brand-green mb-2">
              KARMA_SYSTEM
            </CodeText>
            <h2 className="text-xl md:text-2xl text-foreground">
              {"// Earn karma by participating in the community"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-green">UNLOCK PERKS</p>
            <p className="text-xs text-muted-foreground">
              Higher karma = more benefits
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px">
          {WAYS_TO_EARN.map((way, index) => {
            const IconComponent = way.icon;
            return (
              <button
                key={way.action}
                type="button"
                className={cn(
                  "relative p-5 text-center transition-all duration-300",
                  "hover:scale-105 hover:z-10",
                  hoveredIndex !== null &&
                    hoveredIndex !== index &&
                    "opacity-50 scale-95"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <IconComponent
                  size={24}
                  className={cn("mx-auto mb-2", way.color)}
                />
                <p className={cn("text-lg font-bold mb-1", way.color)}>
                  {way.karma}
                </p>
                <p className="text-xs text-foreground font-medium mb-1">
                  {way.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {way.description}
                </p>
                {hoveredIndex === index && (
                  <div className="absolute inset-0 border border-brand-green/30 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <p className="text-xs text-muted-foreground">
              Earn karma continuously
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
            <p className="text-xs text-muted-foreground">
              Unlock exclusive perks
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          {"/* Karma reflects your activity. Earn more to unlock perks! */"}
        </p>
      </div>
    </section>
  );
}
