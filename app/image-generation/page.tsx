"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, Sparkles, ImageIcon, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type GeneratedImage = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  async function loadHistory() {
    try {
      const res = await fetch("/api/generate-image");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.images ?? []);
      }
    } catch {}
    finally { setHistoryLoading(false); }
  }

  useEffect(() => { loadHistory(); }, []);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setImageUrl(null);
    setSelectedImage(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        loadHistory();
      } else {
        setError(data.error ?? "Generation failed");
      }
    } catch {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(url: string, promptText: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `generated-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    }
  }

  const displayUrl = selectedImage?.imageUrl ?? imageUrl;
  const displayPrompt = selectedImage?.prompt ?? prompt;

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--border-color)] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)" }}
              >
                <ImageIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <h1 className="text-base font-bold text-[var(--text-primary)]">
                Image Generation
              </h1>
            </div>
          </div>
          <span className="rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-xs text-[var(--text-tertiary)]">
            Powered by Pollinations AI
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left — Generator */}
        <main className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-8">
            {/* Prompt input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Describe your image
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="A cyberpunk city at night with neon reflections on wet streets..."
                  rows={3}
                  className="input-field flex-1 resize-none"
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="btn-gradient flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold sm:self-stretch"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                Be descriptive for best results. Press Enter to generate.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, var(--accent-light) 0%, rgba(168,85,247,0.1) 100%)" }}
                >
                  <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
                </div>
                <p className="mt-5 text-sm font-medium text-[var(--text-secondary)]">
                  Creating your image...
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  This usually takes 5–15 seconds
                </p>
              </div>
            )}

            {/* Generated image */}
            {displayUrl && !loading && (
              <div className="animate-fade-in">
                <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] shadow-lg">
                  <img
                    src={displayUrl}
                    alt={displayPrompt}
                    className="w-full object-contain"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="min-w-0 flex-1 truncate text-sm text-[var(--text-secondary)]">
                    {displayPrompt}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDownload(displayUrl, displayPrompt)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)]"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!displayUrl && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: "var(--bg-tertiary)" }}
                >
                  <ImageIcon className="h-9 w-9 text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Your generated images appear here
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  Try: &quot;a watercolor painting of a mountain lake at sunrise&quot;
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right — History panel */}
        <aside className="hidden w-72 shrink-0 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] xl:flex xl:flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              History
            </h2>
            <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
              {history.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--text-tertiary)]" />
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-[var(--text-tertiary)]">
                  No images generated yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {history.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`group relative overflow-hidden rounded-lg border transition-all duration-150 ${
                      selectedImage?.id === img.id
                        ? "border-[var(--accent)]"
                        : "border-[var(--border-color)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/30" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 px-2 py-1.5 transition-transform group-hover:translate-y-0">
                      <p className="line-clamp-2 text-[10px] text-white">
                        {img.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
