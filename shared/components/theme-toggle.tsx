"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent flash on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-9 h-9 overflow-hidden"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </div>

      {/* Moon Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Moon className="h-4 w-4 text-blue-400" />
      </div>

      {/* Background slide effect */}
      <div
        className={`absolute inset-0.5 rounded-md transition-colors duration-300 ${
          isDark ? "bg-slate-800" : "bg-amber-100"
        }`}
      />
    </Button>
  );
}
