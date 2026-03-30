import { ArrowRight, Sparkles, Shield, Globe } from "lucide-react";
import Link from "next/link";

import { HeroSection } from "@/components/home/hero-section";
import { Button } from "@/components/ui/button";
import { getFeaturedHackathon } from "@/lib/actions/hackathons";

export const metadata = {
  description:
    "Connect with developers, build innovative projects, and compete in exciting hackathon events worldwide.",
  title: "Hackathon Hub - Discover & Join Amazing Hackathons",
};

export default async function Home() {
  const featuredHackathon = await getFeaturedHackathon();

  return (
    <main className="min-h-screen">
      <HeroSection hackathon={featuredHackathon} />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to hack
            </h2>
            <p className="text-muted-foreground">
              From discovery to deployment, we have got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                description:
                  "Browse and filter hackathons by date, location, technology, and prize pools.",
                icon: Sparkles,
                title: "Easy Discovery",
              },
              {
                description:
                  "One-click registration with your GitHub or Google account. Form teams instantly.",
                icon: Shield,
                title: "Seamless Registration",
              },
              {
                description:
                  "Connect with developers worldwide and build projects that matter.",
                icon: Globe,
                title: "Global Community",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start building?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who are already competing, learning,
              and shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hackathons">
                <Button size="lg" className="gap-2">
                  Explore Hackathons
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup?type=organizer">
                <Button size="lg" variant="outline">
                  Organize a Hackathon
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
