"use client";

import { MessageSquarePlus } from "lucide-react";

type HistoryItem = {
  _id: string;
  content: string;
  createdAt?: string;
};

type HistorySidebarProps = {
  history: HistoryItem[];
  onNewChat: () => void;
  onSelectQuestion: (question: string) => void;
};

export default function HistorySidebar({
  history,
  onNewChat,
  onSelectQuestion,
}: HistorySidebarProps) {
  return (
    <aside className="w-full border-b border-neutral-200 bg-white p-4 lg:min-h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
      <button
        type="button"
        onClick={onNewChat}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-3 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </button>

      <div className="mt-5">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          History
        </h2>

        <div className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto lg:max-h-[calc(100vh-10rem)]">
          {history.length === 0 ? (
            <p className="px-1 py-2 text-sm leading-6 text-neutral-500">
              Your previous questions will appear here.
            </p>
          ) : (
            history.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => onSelectQuestion(item.content)}
                className="rounded-lg px-3 py-2 text-left text-sm leading-5 text-neutral-700 transition hover:bg-neutral-100"
                title={item.content}
              >
                <span className="line-clamp-2">{item.content}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
