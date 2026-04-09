"use client";

import { cn } from "@/shared/lib/utils";
import { autoGradient } from "@/shared/utils";

interface HackathonBackgroundProps {
  themeBg?: string | null;
  themeStyle?: string | null;
  children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function HackathonBackground({
  themeBg,
  themeStyle,
  children,
}: HackathonBackgroundProps) {
  if (!themeBg) {
    return <>{children}</>;
  }

  // Generate gradient from themeBg (same logic as ThemeCustomizer)
  const gradientCss = autoGradient(themeBg);

  const styleClasses = cn(
    themeStyle === "neon" && "glow-green",
    themeStyle === "cyber" && "scanlines relative"
  );

  return (
    <article
      className={cn("w-full h-full", styleClasses)}
      style={{ background: gradientCss }}
    >
      {themeStyle === "cyber" && (
        <div className="pixel-grid absolute inset-0 opacity-20 pointer-events-none" />
      )}
      {children}
    </article>
  );
}
