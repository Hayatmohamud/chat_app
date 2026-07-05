"use client";

import { FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { ArrowUp, Plus, Square } from "lucide-react";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  modelName?: string;
};

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
  modelName,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isLoading) onSubmit();
    }
  }

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="w-full bg-[var(--bg-primary)] pb-4 pt-2">
      <div className="mx-auto max-w-3xl px-3 sm:px-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 shadow-md transition-all duration-200 focus-within:border-[var(--border-hover)] focus-within:shadow-lg"
          style={{
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Mentorship AI..."
            className="block w-full resize-none bg-transparent px-2 py-2.5 text-[15px] leading-6 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ maxHeight: "200px" }}
          />

          <div className="flex h-10 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                title="Add attachment"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
              >
                <Plus className="h-4 w-4" />
              </button>
              {modelName && (
                <span className="truncate rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                  {modelName}
                </span>
              )}
            </div>

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                title="Stop generating"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-secondary)]"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                title="Send message (Enter)"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-35"
                style={{
                  background: canSend ? "var(--text-primary)" : "var(--bg-tertiary)",
                  color: canSend ? "var(--bg-primary)" : "var(--text-tertiary)",
                }}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <div className="mt-2 flex items-center justify-center px-1">
          {isLoading && (
            <span className="text-xs text-[var(--text-tertiary)] animate-pulse">
              Generating...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
