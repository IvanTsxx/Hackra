"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const THEME_TRANSITION_DURATION = 350;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4 text-yellow-500" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    const overlay = document.createElement("div");
    overlay.id = "theme-transition-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      background-color: ${isDark ? "#000" : "#fff"};
      transform: scaleX(0);
      transform-origin: ${isDark ? "left" : "right"};
      transition: transform ${THEME_TRANSITION_DURATION}ms ${EASING};
    `;
    document.body.append(overlay);

    requestAnimationFrame(() => {
      overlay.style.transform = "scaleX(1)";

      setTimeout(() => {
        setTheme(isDark ? "light" : "dark");

        overlay.style.transformOrigin = isDark ? "right" : "left";

        requestAnimationFrame(() => {
          overlay.style.transform = "scaleX(0)";

          setTimeout(() => {
            overlay.remove();
            setIsTransitioning(false);
          }, THEME_TRANSITION_DURATION);
        });
      }, 50);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-9 h-9 overflow-hidden rounded-full"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      disabled={isTransitioning}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "rotate(0deg) scale(1)"
            : "rotate(180deg) scale(0)",
        }}
      >
        <Moon className="h-4 w-4 text-blue-400" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "rotate(-180deg) scale(0)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <Sun className="h-4 w-4 text-yellow-500" />
      </span>
    </Button>
  );
}
