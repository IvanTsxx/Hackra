"use client";

import { useState, useCallback } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ThemeValue {
  bg: string;
  gradient: string;
  gradientCss: string;
  style:
    | "default"
    | "neon"
    | "minimal"
    | "cyber"
    | "aurora"
    | "infrared"
    | "void"
    | "custom";
}

interface ThemeCustomizerProps {
  value: ThemeValue;
  onChange: (theme: ThemeValue) => void;
}

// ── Color utilities ────────────────────────────────────────────────────────────

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

/** Auto-generates a CSS gradient from a background hex color by shifting hue */
function autoGradient(bg: string): string {
  try {
    const [h, s, l] = hexToHsl(bg);
    // Shift hue by +40 degrees for analogous color, slightly lighter
    const accentHex = hslToHex(h + 40, Math.max(s, 25), Math.min(l + 8, 35));
    return `linear-gradient(135deg, ${bg} 0%, ${accentHex} 100%)`;
  } catch {
    return `linear-gradient(135deg, ${bg} 0%, #1a1a2e 100%)`;
  }
}

// ── Presets ────────────────────────────────────────────────────────────────────

const PRESETS: { label: string; value: ThemeValue; swatch: string }[] = [
  {
    label: "DEFAULT",
    swatch: "#18181b",
    value: {
      bg: "#0a0a0a",
      gradient: "from-zinc-950 to-zinc-900",
      gradientCss: "linear-gradient(135deg, #0a0a0a 0%, #18181b 100%)",
      style: "default",
    },
  },
  {
    label: "NEON",
    swatch: "#052016",
    value: {
      bg: "#030d0a",
      gradient: "from-emerald-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #030d0a 0%, #052016 100%)",
      style: "neon",
    },
  },
  {
    label: "CYBER",
    swatch: "#1a0d2e",
    value: {
      bg: "#0d0d1a",
      gradient: "from-purple-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 100%)",
      style: "cyber",
    },
  },
  {
    label: "INFRARED",
    swatch: "#2d1000",
    value: {
      bg: "#1a0a00",
      gradient: "from-orange-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #1a0a00 0%, #2d1000 100%)",
      style: "infrared",
    },
  },
  {
    label: "AURORA",
    swatch: "#081a1a",
    value: {
      bg: "#050a12",
      gradient: "from-sky-950 to-emerald-950",
      gradientCss: "linear-gradient(135deg, #050a12 0%, #05120a 100%)",
      style: "aurora",
    },
  },
  {
    label: "VOID",
    swatch: "#080808",
    value: {
      bg: "#000000",
      gradient: "from-zinc-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #000000 0%, #080808 100%)",
      style: "void",
    },
  },
  {
    label: "BLOOD",
    swatch: "#200012",
    value: {
      bg: "#0f0005",
      gradient: "from-rose-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #0f0005 0%, #200012 100%)",
      style: "custom",
    },
  },
  {
    label: "GOLD",
    swatch: "#1a1400",
    value: {
      bg: "#0d0a00",
      gradient: "from-yellow-950 to-zinc-950",
      gradientCss: "linear-gradient(135deg, #0d0a00 0%, #1a1400 100%)",
      style: "custom",
    },
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export function ThemeCustomizer({ value, onChange }: ThemeCustomizerProps) {
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleBgChange = useCallback(
    (hex: string) => {
      const gradientCss = autoGradient(hex);
      onChange({ ...value, bg: hex, gradientCss, style: "custom" });
    },
    [value, onChange]
  );

  const handleCssGradientChange = (css: string) => {
    onChange({ ...value, gradientCss: css });
  };

  const handleTailwindChange = (tw: string) => {
    onChange({ ...value, gradient: tw });
  };

  return (
    <div className="space-y-5">
      {/* Preset grid */}
      <div className="space-y-2">
        <span className="  text-xs text-muted-foreground tracking-widest">
          PRESETS
        </span>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={cn(
                "border p-2.5 space-y-1.5 transition-all text-left group",
                value.style === preset.value.style &&
                  value.bg === preset.value.bg
                  ? "border-brand-green/60 bg-brand-green/5"
                  : "border-border/40 hover:border-border/70"
              )}
            >
              {/* Gradient swatch */}
              <div
                className="h-7 w-full"
                style={{ background: preset.value.gradientCss }}
              />
              <span className="  text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Background color + auto gradient */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="  text-xs text-muted-foreground tracking-widest">
            BACKGROUND COLOR
          </span>
          <span className="  text-xs text-muted-foreground/50">
            gradient auto-generated
          </span>
        </div>
        <div className="flex items-stretch gap-2">
          {/* Color picker */}
          <label className="flex items-center gap-2 border border-border/40 px-3 py-2 flex-1 cursor-pointer hover:border-border/60 transition-colors">
            <input
              type="color"
              value={value.bg}
              onChange={(e) => handleBgChange(e.target.value)}
              className="w-5 h-5 cursor-pointer border-none bg-transparent shrink-0"
            />
            <span className="  text-xs text-muted-foreground">{value.bg}</span>
          </label>
          {/* Gradient preview strip */}
          <div
            className="w-16 border border-border/30 shrink-0"
            style={{ background: value.gradientCss }}
            title="Auto-generated gradient"
          />
        </div>
      </div>

      {/* Advanced mode toggle */}
      <div className="flex items-center justify-between p-3 border border-border/30 bg-secondary/5">
        <div className="space-y-0.5">
          <p className="  text-xs text-foreground">ADVANCED MODE</p>
          <p className="  text-xs text-muted-foreground">
            Edit raw CSS gradient or Tailwind classes
          </p>
        </div>
        <Switch
          checked={advancedMode}
          onCheckedChange={setAdvancedMode}
          aria-label="Toggle advanced mode"
        />
      </div>

      {/* Advanced fields */}
      {advancedMode && (
        <div className="space-y-3 border border-border/20 p-4 bg-secondary/5">
          <div className="space-y-1">
            <label className="  text-xs text-muted-foreground tracking-widest">
              CSS GRADIENT
            </label>
            <input
              type="text"
              value={value.gradientCss}
              onChange={(e) => handleCssGradientChange(e.target.value)}
              placeholder="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)"
              className="w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="  text-xs text-muted-foreground tracking-widest">
              TAILWIND GRADIENT CLASSES
            </label>
            <input
              type="text"
              value={value.gradient}
              onChange={(e) => handleTailwindChange(e.target.value)}
              placeholder="from-zinc-950 to-zinc-900"
              className="w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors"
            />
            <p className="  text-xs text-muted-foreground/50">
              {"Used as bg-gradient-to-br {value} in hackathon banners"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
