import { ArrowRight, Terminal, Shield, Globe } from "lucide-react";
import Link from "next/link";

import { FeaturedHackathon } from "@/components/home/featured-hackathon";
import { HeroSection } from "@/components/home/hero-section";
import { TechStackMarquee } from "@/components/home/tech-stack-marquee";
import { Button } from "@/components/ui/button";
import { getFeaturedHackathon } from "@/lib/actions/hackathons";
import { CodeText } from "@/shared/components/code-text";

export const metadata = {
  description:
    "Connect with developers, build innovative projects, and compete in exciting hackathon events worldwide.",
  title: "Hackra | Build. Compete. Together.",
};

export default async function Home() {
  const featuredHackathon = await getFeaturedHackathon();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <TechStackMarquee />
      {featuredHackathon && <FeaturedHackathon hackathon={featuredHackathon} />}

      {/* Features Section */}
      <section className="py-24 relative border-b border-border">
        <div className="absolute inset-0 pixel-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <CodeText
              className="text-xs text-primary font-mono uppercase tracking-widest mb-4"
              as="p"
            >
              features.map()
            </CodeText>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
              {">"} EVERYTHING YOU NEED TO HACK
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              {"/* From discovery to deployment, we have got you covered */"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                description:
                  "Browse and filter hackathons by date, location, technology, and prize pools.",
                icon: Terminal,
                title: "EASY_DISCOVERY",
              },
              {
                description:
                  "One-click registration with your GitHub or Google account. Form teams instantly.",
                icon: Shield,
                title: "SEAMLESS_AUTH",
              },
              {
                description:
                  "Connect with developers worldwide and build projects that matter.",
                icon: Globe,
                title: "GLOBAL_NETWORK",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
                    {feature.title}
                  </h3>
                </div>
                <CodeText
                  as="p"
                  className="text-xs text-muted-foreground font-mono"
                >
                  {feature.description}
                </CodeText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 pixel-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <CodeText
              as="p"
              className="text-xs text-primary font-mono uppercase tracking-widest mb-4"
            >
              call_to_action
            </CodeText>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-mono">
              {">"} READY TO START BUILDING?
            </h2>
            <p className="text-sm text-muted-foreground mb-8 font-mono">
              {
                "/* Join thousands of developers who are already competing, learning, and shipping. */"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hackathons">
                <Button
                  size="lg"
                  className="gap-2 uppercase tracking-wider text-xs glow-primary"
                >
                  {"<"} Explore Hackathons {"/>"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup?type=organizer">
                <Button
                  size="lg"
                  variant="outline"
                  className="uppercase tracking-wider text-xs"
                >
                  {"<"} Organize Event {"/>"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
