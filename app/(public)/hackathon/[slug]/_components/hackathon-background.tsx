"use client";

import { cn } from "@/shared/lib/utils";

interface HackathonBackgroundProps {
  themeBg?: string | null;
  themeStyle?: string | null;
  children: React.ReactNode;
}

// ── Color utilities (mirrored from theme-customizer.tsx) ───────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const h = ((hue % 360) + 360) % 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return (
    // oxlint-disable-next-line prefer-template
    "#" +
    [f(0), f(8), f(4)]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function autoGradient(bg: string): string {
  try {
    const [h, s, l] = hexToHsl(bg);
    const accentHex = hslToHex(h + 40, Math.max(s, 25), Math.min(l + 8, 35));
    return `linear-gradient(135deg, ${bg} 0%, ${accentHex} 100%)`;
  } catch {
    return `linear-gradient(135deg, ${bg} 0%, #1a1a2e 100%)`;
  }
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
