"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Users, Trophy, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { TextFlip } from "@/components/ui/text-flip";

interface HeroSectionProps {
  hackathon?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    startDate?: Date | null;
    participantCount: number;
    maxParticipants?: number | null;
  } | null;
}

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Rust",
  "Go",
  "Tailwind",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Vercel",
  "Supabase",
];

export function HeroSection({ hackathon }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      y: 0,
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid opacity-50 dark:opacity-30" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logo / Brand */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Hackathon Hub</span>
              </div>
            </motion.div>

            {/* Main Heading with Text Flip */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="block">Build.</span>
              <span className="block">
                <TextFlip
                  words={["Compete.", "Learn.", "Ship.", "Win."]}
                  className="text-muted-foreground"
                  duration={2500}
                />
              </span>
              <span className="block">Together.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Join thousands of developers in hackathons that matter. Build real
              projects, make connections, and launch your ideas.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/hackathons">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Browse Hackathons
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { icon: Trophy, label: "Hackathons", value: "150+" },
                { icon: Users, label: "Developers", value: "50K+" },
                { icon: Zap, label: "Projects", value: "12K+" },
                { icon: Code2, label: "Prize Pool", value: "$2M+" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                >
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Marquee */}
      <div className="relative z-10 border-y border-border bg-card/30 backdrop-blur-sm py-4">
        <Marquee speed="slow" pauseOnHover>
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Featured Hackathon */}
      {hackathon && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 border-b border-border"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Featured Event
                </p>
                <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {hackathon.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {hackathon.participantCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
                <Link href={`/hackathons/${hackathon.slug}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
