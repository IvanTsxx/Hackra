"use client";

import { ArrowRight } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import Link from "next/link";

import { useSession } from "@/shared/lib/auth-client";

import { AuthModalDialog } from "../auth";
import { CodeText } from "../code-text";
import { Button } from "../ui/button";
import { TextFlip } from "../ui/text-flip";
import { Stats } from "./stats";

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

export const HeroLeft = ({
  stats,
}: {
  stats: { icon: string; label: string; value: string }[];
}) => {
  const { data } = useSession();
  const user = data?.user;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col text-left"
    >
      {/* Terminal badge */}
      <motion.div variants={itemVariants} className="mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/80 backdrop-blur-sm">
          <CodeText as="span">{">_"} hackra.init()</CodeText>
        </div>
      </motion.div>

      {/* Main Heading with Text Flip */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6  "
      >
        <span className="block text-muted-foreground">{">"} BUILD.</span>
        <span className="block">
          <span className="text-muted-foreground">{">"} </span>
          <TextFlip
            words={["COMPETE.", "LEARN.", "SHIP.", "WIN."]}
            className="text-primary"
            duration={2000}
          />
        </span>
        <span className="block text-muted-foreground">{">"} TOGETHER.</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={itemVariants}
        className="text-sm md:text-base text-muted-foreground max-w-xl mb-10  "
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
        <Link href="/explore">
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto uppercase tracking-wider text-xs glow-primary"
          >
            {"<"} Browse Hackathons {"/>"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        {!user && (
          <AuthModalDialog
            isRender
            renderComponent={
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto uppercase tracking-wider text-xs"
              />
            }
          >
            {"<"} Create Account {"/>"}
          </AuthModalDialog>
        )}
      </motion.div>

      {/* Stats */}
      <Stats stats={stats} />
    </motion.div>
  );
};
