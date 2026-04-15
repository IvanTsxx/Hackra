import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  FileCode,
  Globe,
  MapPin,
  Medal,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PLATFORM_FEATURES: Feature[] = [
  {
    description: "Find in-person, remote, or hybrid hackathons worldwide",
    icon: <Globe className="h-5 w-5" />,
    title: "Discover Hackathons",
  },
  {
    description: "Build teams, post ideas, and recruit members",
    icon: <Users className="h-5 w-5" />,
    title: "Team Formation",
  },
  {
    description: "Create and manage your own hackathons",
    icon: <Calendar className="h-5 w-5" />,
    title: "Event Management",
  },
  {
    description: "Track prizes, sponsors, and track winners",
    icon: <Medal className="h-5 w-5" />,
    title: "Prizes & Sponsors",
  },
  {
    description: "Earn verifiable certificates for participation",
    icon: <FileCode className="h-5 w-5" />,
    title: "Certificates",
  },
  {
    description: "GitHub OAuth verification for all participants",
    icon: <Shield className="h-5 w-5" />,
    title: "Verified Profiles",
  },
  {
    description: "Explore hackathons on an interactive 3D globe",
    icon: <MapPin className="h-5 w-5" />,
    title: "Interactive Maps",
  },
  {
    description: "Manage applications with custom questions",
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Team Applications",
  },
  {
    description: "Earn points and build your reputation",
    icon: <Award className="h-5 w-5" />,
    title: "Karma System",
  },
  {
    description: "Modern stack ready for AI integration",
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Ready",
  },
  {
    description: "Free for organizers and participants",
    icon: <Wallet className="h-5 w-5" />,
    title: "No Fees",
  },
  {
    description: "Community-driven platform",
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Open Source",
  },
];

export function PlatformFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need to{" "}
          <span className="text-primary">Build & Compete</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A complete platform for hackathon organizers and participants.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px">
        {PLATFORM_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group p-6 bg-card/50 hover:bg-card transition-colors"
          >
            <div className="text-primary mb-3">{feature.icon}</div>
            <h3 className="font-heading text-base font-medium mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/explore">
          <Button size="lg" variant="outline" className="gap-2">
            Explore Hackathons <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
