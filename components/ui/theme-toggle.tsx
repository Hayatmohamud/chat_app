"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
    >
      <Sun
        className="absolute h-4 w-4 text-[var(--text-secondary)] transition-all duration-300"
        style={{
          opacity: theme === "light" ? 1 : 0,
          transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
        }}
      />
      <Moon
        className="absolute h-4 w-4 text-[var(--text-secondary)] transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
        }}
      />
    </button>
  );
}
