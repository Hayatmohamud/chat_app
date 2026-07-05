"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";

import AppSidebar from "@/components/layout/app-sidebar";
import ChatInput from "@/components/chat/chatInput";
import MessageList from "@/components/chat/MessageList";
import ModelSelector from "@/components/chat/model-selector";
import EmptyState from "@/components/chat/empty-state";
import { DEFAULT_MODEL_ID, models, type ModelId, getModelById } from "@/lib/ai/models";
import { Menu } from "lucide-react";

type ChatItem = {
  id: string;
  title: string;
  model: string;
  updatedAt: string;
};

type Props = {
  userName?: string;
};

export default function Chat({ userName }: Props) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>(() => {
    if (typeof window === "undefined") return DEFAULT_MODEL_ID;
    const stored = window.localStorage.getItem("defaultModel");
    return getModelById(stored ?? DEFAULT_MODEL_ID).id;
  });
  const [input, setInput] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    messages,
    sendMessage,
    regenerate,
    stop,
    setMessages,
    status,
    error,
  } = useChat({
    id: currentChatId ?? undefined,
    onFinish: () => {
      loadChats();
    },
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const loadChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  function handleSelectModel(modelId: ModelId) {
    setSelectedModel(modelId);
    localStorage.setItem("defaultModel", modelId);
  }

  async function loadChatMessages(chatId: string) {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const loadedMessages = data.messages ?? [];
        setMessages(loadedMessages);
        setCurrentChatId(chatId);

        // Fix: load the model from the chat record, not from updatedAt
        const chatRecord = chats.find((c) => c.id === chatId);
        if (chatRecord?.model) {
          const modelEntry = getModelById(chatRecord.model);
          if (modelEntry) setSelectedModel(modelEntry.id as ModelId);
        }
      }
    } catch {}
  }

  function handleNewChat() {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
  }

  async function handleDeleteChat(chatId: string) {
    try {
      await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
      loadChats();
    } catch {}
  }

  async function handleRenameChat(chatId: string, title: string) {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      loadChats();
    } catch {}
  }

  function submitMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const chatId = currentChatId ?? crypto.randomUUID();

    if (!currentChatId) {
      setCurrentChatId(chatId);
    }

    sendMessage(
      { text: trimmed },
      {
        body: {
          chatId,
          model: selectedModel,
        },
      },
    );
    setInput("");
  }

  const currentModelInfo = models.find((m) => m.id === selectedModel);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <AppSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={loadChatMessages}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-slide-in-left">
            <AppSidebar
              chats={chats}
              currentChatId={currentChatId}
              onSelectChat={(id) => {
                loadChatMessages(id);
                setMobileSidebarOpen(false);
              }}
              onNewChat={() => {
                handleNewChat();
                setMobileSidebarOpen(false);
              }}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ModelSelector
              selectedModel={selectedModel}
              onSelectModel={handleSelectModel}
            />
          </div>
        </header>

        {/* Messages area */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              onSuggestion={submitMessage}
              userName={userName}
            />
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              onRegenerate={regenerate}
            />
          )}
        </main>

        {/* Error banner */}
        {error && (
          <div className="mx-auto w-full max-w-3xl px-4 pb-2">
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400 animate-fade-in">
              {error.message || "Something went wrong. Please try again."}
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={() => submitMessage()}
          onStop={stop}
          modelName={currentModelInfo?.name}
        />
      </div>
    </div>
  );
}
