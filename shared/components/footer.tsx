import Link from "next/link";

import { CodeText } from "./code-text";
import { Icons } from "./icons";

export const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground ">
        <CodeText as="p">hackra v1.0.0 | built with &lt;3</CodeText>
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
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Terms
          </Link>
          <Link
            href="https://github.com/IvanTsxx/hackra"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <Icons.Github className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
