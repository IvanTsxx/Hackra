import Link from "next/link";

import { CodeText } from "@/shared/components/code-text";

export const Banner = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
    <div className="glass border border-border/40 p-10 md:p-16 text-center space-y-6">
      <CodeText as="p" className="text-xs text-brand-green">
        GET_STARTED
      </CodeText>
      <h2 className="text-2xl md:text-4xl text-foreground text-balance">
        READY TO BUILD SOMETHING GREAT?
      </h2>
      <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
        {
          "/* Join the next wave of hackathons. Meet your future co-founders. Launch your next big idea. */"
        }
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background text-xs tracking-wider hover:opacity-90 transition-opacity"
        >
          EXPLORE HACKATHONS
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-border/60 text-foreground text-xs tracking-wider hover:border-brand-green/50 hover:text-brand-green transition-all"
        >
          HOST ONE
        </Link>
      </div>
    </div>
  </section>
);
