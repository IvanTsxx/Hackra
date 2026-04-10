"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useThemeTransition } from "@/hooks/use-theme-transition";

export function ThemeToggle() {
  const { changeTheme, theme } = useThemeTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  );
}
