"use client";

import { AlertCircle, CheckCircle } from "lucide-react";

type AuthMessageProps = {
  type: "error" | "success";
  message: string;
};

export default function AuthMessage({ type, message }: AuthMessageProps) {
  const isError = type === "error";
  return (
    <div
      className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in"
      style={{
        background: isError
          ? "rgba(225, 112, 85, 0.08)"
          : "rgba(0, 184, 148, 0.08)",
        borderColor: isError
          ? "rgba(225, 112, 85, 0.25)"
          : "rgba(0, 184, 148, 0.25)",
        color: isError ? "var(--error)" : "var(--success)",
      }}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
