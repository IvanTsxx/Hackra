import Link from "next/link";

export const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
        <p>{"// hackathon_hub v1.0.0 | built with <3"}</p>
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="hover:text-foreground transition-colors uppercase tracking-wider"
          >
            About
          </Link>
          <Link
            href="/sponsors"
            className="hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Sponsors
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
