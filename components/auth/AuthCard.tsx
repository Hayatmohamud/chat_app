"use client";

import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="auth-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
              boxShadow: "0 8px 32px var(--accent-glow)",
            }}
          >
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Mentorship Chat
          </span>
        </div>

        {/* Card */}
        <div
          className="glass-card rounded-2xl p-8"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
              {description}
            </p>
          </div>

          {children}
        </div>

        {/* Footer */}
        {footer && (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
