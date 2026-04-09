import { Code2, Terminal, Users, Trophy } from "lucide-react";
import Link from "next/link";

import { CodeText } from "@/shared/components/code-text";

export const metadata = {
  description: "About Hackra - The platform for hackathons",
  title: "About - Hackra",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <CodeText
              as="p"
              className="text-xs text-primary  uppercase tracking-widest mb-4"
            >
              about_hackra()
            </CodeText>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
              {">"} BUILD TOGETHER
            </h1>
            <p className="text-lg text-muted-foreground ">
              {
                "/* Hackra is the platform where developers connect, compete, and create amazing projects */"
              }
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <CodeText
                as="p"
                className="text-xs text-primary  uppercase tracking-widest mb-4"
              >
                our_mission
              </CodeText>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 ">
                {">"} DEMOCRATIZING HACKATHONS
              </h2>
              <p className="text-muted-foreground  text-sm mb-6">
                {
                  "/* We believe every developer deserves access to opportunities to learn, grow, and showcase their skills. Hackathons are more than competitions — they're launchpads for careers, friendships, and revolutionary ideas. */"
                }
              </p>
              <p className="text-muted-foreground  text-sm">
                {
                  "/* Our mission is to make organizing and participating in hackathons as seamless as possible, connecting organizers with passionate developers worldwide. */"
                }
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Trophy, label: "150+", value: "HACKATHONS" },
                { icon: Users, label: "50K+", value: "DEVELOPERS" },
                { icon: Code2, label: "12K+", value: "PROJECTS" },
                { icon: Terminal, label: "$2M+", value: "PRIZES" },
              ].map((stat, idx) => (
                <div key={idx} className="p-4 border border-border bg-card/50">
                  <stat.icon className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold  block">
                    {stat.label}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest ">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <CodeText
              as="p"
              className="text-xs text-primary  uppercase tracking-widest mb-4"
            >
              core_values
            </CodeText>
            <h2 className="text-2xl md:text-3xl font-bold ">
              {">"} WHAT WE BELIEVE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                description:
                  "Every developer deserves equal opportunity to participate and shine.",
                title: "OPENNESS",
              },
              {
                description:
                  "Great things happen when passionate people come together.",
                title: "COMMUNITY",
              },
              {
                description:
                  "We celebrate creativity and bold ideas that push boundaries.",
                title: "INNOVATION",
              },
            ].map((value, idx) => (
              <div key={idx} className="p-6 border border-border bg-card/50">
                <h3 className="text-sm font-bold  uppercase tracking-wider mb-2">
                  {value.title}
                </h3>
                <CodeText as="p" className="text-xs text-muted-foreground ">
                  {value.description}
                </CodeText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <CodeText
            as="p"
            className="text-xs text-primary  uppercase tracking-widest mb-4"
          >
            join_the_movement
          </CodeText>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 ">
            {">"} START YOUR JOURNEY
          </h2>
          <p className="text-muted-foreground  text-sm mb-8 max-w-xl mx-auto">
            {
              "/* Whether you want to compete or organize, there's a place for you in the Hackra community. */"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs  uppercase tracking-wider"
            >
              {"<"} Browse Hackathons {"/>"}
            </Link>
            {/*   <Link
              href="/signup?type=organizer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-primary/50 text-xs  uppercase tracking-wider"
            >
              {"<"} Organize Event {"/>"}
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
}
