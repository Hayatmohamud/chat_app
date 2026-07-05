"use client";

import { useState } from "react";
import type { UIMessage } from "ai";
import {
  Bot,
  Calculator,
  Check,
  Clock,
  Copy,
  Globe,
  Loader2,
  RefreshCw,
  User,
  Wind,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type MessageProps = {
  message: UIMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
};

/* ── Copy button ── */
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] transition-all duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[var(--success)]" />
          <span className="text-[var(--success)]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

/* ── Code copy button (inline in code block) ── */
function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-[#3a3a4e] bg-[#1a1a28] px-2 py-1 text-xs text-gray-400 opacity-0 transition-all group-hover/code:opacity-100 hover:text-gray-200"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ── Typing dots ── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

/* ── Tool result cards ── */
function ToolResult({ part }: { part: UIMessage["parts"][number] }) {
  const toolPart = part as {
    type: string;
    state?: string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
  };

  if (
    toolPart.state === "input-streaming" ||
    toolPart.state === "input-available"
  ) {
    const toolName = toolPart.type.replace("tool-", "");
    return (
      <div className="my-2 flex items-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-2.5 text-sm text-[var(--text-secondary)] animate-fade-in">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />
        <span>Using <strong>{toolName}</strong>...</span>
      </div>
    );
  }

  if (toolPart.state === "output-error") {
    return (
      <div className="my-2 rounded-xl border border-red-200/30 bg-red-500/8 px-4 py-3 text-sm text-red-400 animate-fade-in">
        {toolPart.errorText ?? "Tool failed."}
      </div>
    );
  }

  if (toolPart.state !== "output-available") return null;

  const output = toolPart.output as Record<string, unknown>;

  if (toolPart.type === "tool-weather") {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/8 to-blue-500/5 animate-fade-in">
        <div className="flex items-center gap-2 border-b border-sky-500/15 px-4 py-2.5">
          <Wind className="h-4 w-4 text-sky-400" />
          <span className="text-sm font-semibold text-sky-300">
            Weather — {String(output.city ?? "")}
          </span>
        </div>
        <div className="px-4 py-3">
          <div className="text-3xl font-bold text-sky-200">
            {output.temperature != null
              ? `${Math.round(Number(output.temperature))}°C`
              : "--"}
          </div>
          <p className="mt-1 text-sm capitalize text-sky-300/80">
            {String(output.description ?? "")}
          </p>
          {output.humidity != null && (
            <p className="mt-1 text-xs text-sky-400/60">
              Humidity: {String(output.humidity)}%
            </p>
          )}
        </div>
      </div>
    );
  }

  if (toolPart.type === "tool-calculator") {
    return (
      <div className="my-3 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-green-500/5 animate-fade-in">
        <div className="flex items-center gap-2 border-b border-emerald-500/15 px-4 py-2.5">
          <Calculator className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-300">Calculator</span>
        </div>
        <div className="px-4 py-3 font-mono text-lg text-emerald-200">
          {String(output.expression ?? "")} ={" "}
          <span className="font-bold">{String(output.result ?? "")}</span>
        </div>
      </div>
    );
  }

  if (toolPart.type === "tool-currentTime") {
    return (
      <div className="my-3 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/8 to-purple-500/5 animate-fade-in">
        <div className="flex items-center gap-2 border-b border-violet-500/15 px-4 py-2.5">
          <Clock className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-semibold text-violet-300">Current Time</span>
        </div>
        <div className="px-4 py-3">
          <p className="text-lg font-semibold text-violet-200">
            {String(output.date ?? "")}
          </p>
          <p className="text-sm text-violet-300/80">{String(output.time ?? "")}</p>
          <p className="mt-1 text-xs text-violet-400/60">{String(output.timezone ?? "")}</p>
        </div>
      </div>
    );
  }

  if (toolPart.type === "tool-webSearch") {
    const results = (output.results ?? []) as Array<{
      title: string;
      snippet: string;
      url: string;
    }>;
    return (
      <div className="my-3 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-teal-500/5 animate-fade-in">
        <div className="flex items-center gap-2 border-b border-cyan-500/15 px-4 py-2.5">
          <Globe className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-300">
            Web Search — &quot;{String(output.query ?? "")}&quot;
          </span>
        </div>
        <div className="px-4 py-3">
          {results.length === 0 ? (
            <p className="text-sm text-cyan-400/80">No results found.</p>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="border-b border-cyan-500/10 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-cyan-200">{r.title}</p>
                  {r.snippet && (
                    <p className="mt-0.5 text-xs text-cyan-400/70">{r.snippet}</p>
                  )}
                  {r.url && (
                    <p className="mt-0.5 truncate text-xs text-cyan-500/50">{r.url}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolPart.type === "tool-joke") {
    return (
      <div className="my-3 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-orange-500/5 animate-fade-in">
        <div className="px-4 py-3">
          <p className="text-sm text-amber-200">{String(output.setup ?? "")}</p>
          <p className="mt-2 font-semibold text-amber-100">
            {String(output.punchline ?? "")}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Main message component ── */
export default function MessageComponent({
  message,
  onRegenerate,
  isLast,
}: MessageProps) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");

  const isStreaming =
    isLast && !isUser && textContent === "" && message.parts.length > 0;

  return (
    <article
      className={`group px-4 py-6 transition-colors animate-fade-in ${
        isUser ? "" : "bg-[var(--bg-secondary)]"
      }`}
    >
      <div className="mx-auto flex max-w-3xl gap-4">
        {/* Avatar */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm"
          style={
            isUser
              ? {
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
                  color: "white",
                }
              : {
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }
          }
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-semibold text-[var(--text-tertiary)]">
            {isUser ? "You" : "Mentorship AI"}
          </div>

          {isStreaming ? (
            <TypingIndicator />
          ) : isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-primary)]">
              {textContent}
            </div>
          ) : (
            <div className="markdown-body text-[var(--text-primary)]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeStr = String(children).replace(/\n$/, "");
                    if (match) {
                      return (
                        <div className="relative group/code my-3">
                          <div className="flex items-center justify-between rounded-t-lg border border-[#252530] bg-[#13131a] px-4 py-2">
                            <span className="text-xs font-medium text-gray-500">
                              {match[1]}
                            </span>
                            <CodeCopyButton text={codeStr} />
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0 0 10px 10px",
                              borderTop: "none",
                              fontSize: "13px",
                              border: "1px solid #252530",
                              borderTopWidth: 0,
                            }}
                          >
                            {codeStr}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                    return (
                      <code
                        className="rounded-md bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[0.875em] font-mono border border-[var(--border-color)]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Tool results */}
          {message.parts
            .filter((p) => p.type.startsWith("tool-"))
            .map((part, i) => (
              <ToolResult key={i} part={part} />
            ))}

          {/* Action buttons */}
          {!isUser && textContent && (
            <div className="mt-3 flex items-center gap-1 opacity-0 transition-all duration-150 group-hover:opacity-100">
              <CopyButton text={textContent} />
              {onRegenerate && isLast && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] transition-all duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
