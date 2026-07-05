"use client";

import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type SubmitButtonProps = {
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger";
};

export default function SubmitButton({
  loading,
  children,
  onClick,
  variant = "primary",
}: SubmitButtonProps) {
  if (variant === "danger") {
    return (
      <button
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #e17055 0%, #d63031 100%)" }}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className="btn-gradient w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
