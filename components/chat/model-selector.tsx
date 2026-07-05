"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Cpu } from "lucide-react";
import { models, type ModelId } from "@/lib/ai/models";

type ModelSelectorProps = {
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
};

const providerColors: Record<string, { bg: string; text: string }> = {
  OpenAI: { bg: "rgba(16,163,127,0.12)", text: "#10a37f" },
  Qwen: { bg: "rgba(31,186,150,0.12)", text: "#1fba96" },
  Cohere: { bg: "rgba(57,110,255,0.12)", text: "#396eff" },
  NVIDIA: { bg: "rgba(118,185,0,0.14)", text: "#76b900" },
};

export default function ModelSelector({
  selectedModel,
  onSelectModel,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentModel = models.find((m) => m.id === selectedModel) ?? models[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const colors = providerColors[currentModel.provider] ?? { bg: "var(--bg-tertiary)", text: "var(--text-secondary)" };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]"
      >
        <div
          className="flex h-5 w-5 items-center justify-center rounded"
          style={{ background: colors.bg }}
        >
          <Cpu className="h-3 w-3" style={{ color: colors.text }} />
        </div>
        <span className="hidden sm:block">{currentModel.name}</span>
        <ChevronDown
          className="h-3.5 w-3.5 text-[var(--text-tertiary)] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg animate-fade-in"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="border-b border-[var(--border-color)] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Select Model
            </p>
          </div>
          <div className="py-1">
            {models.map((model) => {
              const mc = providerColors[model.provider] ?? { bg: "var(--bg-tertiary)", text: "var(--text-secondary)" };
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 hover:bg-[var(--bg-tertiary)]"
                  style={{
                    background: isSelected ? mc.bg : undefined,
                  }}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: mc.bg }}
                  >
                    <Cpu className="h-3.5 w-3.5" style={{ color: mc.text }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {model.name}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ background: mc.bg, color: mc.text }}
                      >
                        FREE
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {model.provider}
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: mc.text }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
