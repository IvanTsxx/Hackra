import { Heart } from "lucide-react";

import { CodeText } from "@/shared/components/code-text";

export const metadata = {
  description: "Sponsors - Hackra",
  title: "Sponsors - Hackra",
};

export default function SponsorsPage() {
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
              sponsors()
            </CodeText>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
              {">"} OUR SPONSORS
            </h1>
            <p className="text-lg text-muted-foreground ">
              {
                "/* Thank you to the amazing companies that make Hackra possible */"
              }
            </p>
          </div>
        </div>
      </section>

      {/* Become Sponsor */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CodeText
              as="p"
              className="text-xs text-primary  uppercase tracking-widest mb-4"
            >
              become_a_sponsor
            </CodeText>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 ">
              {">"} PARTNER WITH US
            </h2>
            <p className="text-muted-foreground  text-sm mb-8">
              {
                "/* Join industry leaders in supporting the developer community. Reach talented developers, showcase your brand, and shape the future of tech. */"
              }
            </p>
            <div className="p-6 border border-border bg-card/50 mb-8">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold  uppercase tracking-wider mb-2">
                Interested in Sponsoring?
              </h3>
              <p className="text-muted-foreground  text-sm mb-4">
                {
                  "/* Contact us at sponsors@hackra.dev to learn about sponsorship opportunities. */"
                }
              </p>
              <a
                href="mailto:sponsors@hackra.dev"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs  uppercase tracking-wider"
              >
                {"<"} Contact Us {"/>"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Benefits */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <CodeText
              as="p"
              className="text-xs text-primary  uppercase tracking-widest mb-4"
            >
              sponsorship_tiers
            </CodeText>
            <h2 className="text-2xl md:text-3xl font-bold ">
              {">"} SPONSORSHIP TIERS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                features: [
                  "Logo on website",
                  "Social media shoutout",
                  "2 hackathon mentions",
                ],
                price: "$1,000",
                tier: "STARTUP",
              },
              {
                features: [
                  "All Startup features",
                  "Logo on all materials",
                  "Dedicated hackathon page",
                  "10 hackathon mentions",
                ],
                price: "$5,000",
                tier: "GROWTH",
              },
              {
                features: [
                  "All Growth features",
                  "Workshop hosting",
                  "Branded challenges",
                  "Unlimited mentions",
                ],
                price: "$10,000+",
                tier: "ENTERPRISE",
              },
            ].map((plan, idx) => (
              <div key={idx} className="p-6 border border-border bg-card/50">
                <h3 className="text-sm font-bold  uppercase tracking-wider mb-2">
                  {plan.tier}
                </h3>
                <p className="text-2xl font-bold  mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-xs text-muted-foreground ">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
