import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { getCurrentUser } from "@/data/auth-dal";
import { CodeText } from "@/shared/components/code-text";
import { Stats } from "@/shared/components/home/stats";
import { Button } from "@/shared/components/ui/button";
import { TextFlip } from "@/shared/components/ui/text-flip";

const AuthModalDialog = dynamic(
  async () => {
    const mod = await import("@/shared/components/auth");
    return { default: mod.AuthModalDialog };
  },
  {
    loading: () => (
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto uppercase tracking-wider text-xs"
      >
        {"<"} Create Account {"/>"}
      </Button>
    ),
  }
);

export async function HeroLeft({
  stats,
}: {
  stats: { icon: string; label: string; value: string }[];
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col text-left">
      {/* Terminal badge */}
      <div className="mb-2 animate-reveal-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/80 backdrop-blur-sm">
          <CodeText as="span">{">_"} hackra.init()</CodeText>
        </div>
      </div>

      {/* Main Heading with Text Flip */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-reveal-up [animation-delay:100ms]">
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
      </h1>

      {/* Subheading — LCP element, renders immediately with NO animation */}
      <p className="text-sm md:text-base text-muted-foreground max-w-xl mb-10">
        {
          "/* Join thousands of developers in hackathons that matter. Build real projects, make connections, and launch your ideas. */"
        }
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-reveal-up [animation-delay:200ms]">
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
      </div>

      {/* Stats */}
      <Stats stats={stats} />
    </div>
  );
}
