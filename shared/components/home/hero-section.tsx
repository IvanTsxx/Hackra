"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Users, Trophy, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TextFlip } from "@/components/ui/text-flip";

import { CodeText } from "../code-text";

const Globe3D = dynamic(
  async () => {
    const mod = await import("./globe-3d");
    return mod.Globe3D;
  },
  { ssr: false }
);

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      y: 0,
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 pixel-grid opacity-40" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Two-column layout */}
      <div className="flex-1 flex items-center relative z-10 pt-2">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column — Main Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col text-left"
            >
              {/* Terminal badge */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/80 backdrop-blur-sm">
                  <Terminal className="w-4 h-4 text-primary" />
                  <CodeText
                    as="span"
                    className="text-xs font-mono uppercase tracking-widest"
                  >
                    hackra.init()
                  </CodeText>
                </div>
              </motion.div>

              {/* Main Heading with Text Flip */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-mono"
              >
                <span className="block text-muted-foreground">
                  {">"} BUILD.
                </span>
                <span className="block">
                  <span className="text-muted-foreground">{">"} </span>
                  <TextFlip
                    words={["COMPETE.", "LEARN.", "SHIP.", "WIN."]}
                    className="text-primary"
                    duration={2000}
                  />
                </span>
                <span className="block text-muted-foreground">
                  {">"} TOGETHER.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-muted-foreground max-w-xl mb-10 font-mono"
              >
                {
                  "/* Join thousands of developers in hackathons that matter. Build real projects, make connections, and launch your ideas. */"
                }
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-16"
              >
                <Link href="/hackathons">
                  <Button
                    size="lg"
                    className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
                  >
                    {"<"} Browse Hackathons {"/>"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto uppercase tracking-wider text-xs"
                  >
                    {"<"} Create Account {"/>"}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { icon: Trophy, label: "HACKATHONS", value: "150+" },
                  { icon: Users, label: "DEVELOPERS", value: "50K+" },
                  { icon: Zap, label: "PROJECTS", value: "12K+" },
                  { icon: Terminal, label: "PRIZE_POOL", value: "$2M+" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 p-4 border border-border bg-card/50 backdrop-blur-sm"
                  >
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-xl md:text-2xl font-bold font-mono">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right column — 3D Globe */}
            <div className="relative hidden lg:flex items-center justify-center h-[600px]">
              <Globe3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
