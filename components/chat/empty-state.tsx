"use client";

import {
  Code,
  Sparkles,
  Brain,
  Calculator,
  CloudSun,
  Globe,
  Image,
  Clock,
} from "lucide-react";

type EmptyStateProps = {
  onSuggestion: (text: string) => void;
  userName?: string;
};

const suggestions = [
  {
    icon: Code,
    title: "Write code",
    text: "Write a Python function to sort a list of dictionaries by a specific key",
    color: "var(--accent)",
    bg: "var(--accent-light)",
  },
  {
    icon: Brain,
    title: "Explain concepts",
    text: "Explain the difference between TCP and UDP in simple terms",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: Calculator,
    title: "Calculate",
    text: "Calculate 15 * 37 + 128 / 16 and explain each step",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    icon: CloudSun,
    title: "Check weather",
    text: "What's the weather like in London right now?",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: Globe,
    title: "Search web",
    text: "Search for the latest news about artificial intelligence",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
  },
  {
    icon: Clock,
    title: "Current time",
    text: "What is the current date and time?",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
  },
];

export default function EmptyState({ onSuggestion, userName }: EmptyStateProps) {
  const greeting = userName
    ? `Hello, ${userName.split(" ")[0]}! 👋`
    : "How can I help?";

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12 animate-fade-in">
      {/* Logo */}
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
          boxShadow: "0 8px 32px var(--accent-glow)",
        }}
      >
        <Sparkles className="h-8 w-8 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        {greeting}
      </h1>
      <p className="mb-10 max-w-md text-center text-sm text-[var(--text-secondary)]">
        I can write code, do math, check the weather, search the web, generate
        images, and much more. Just ask!
      </p>

      {/* Suggestion grid */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => onSuggestion(s.text)}
            className="group flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-left transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-md hover:-translate-y-0.5"
          >
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
              style={{ background: s.bg }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {s.title}
              </div>
              <div className="mt-0.5 line-clamp-2 text-xs text-[var(--text-tertiary)]">
                {s.text}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
