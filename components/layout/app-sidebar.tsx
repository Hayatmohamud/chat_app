"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  ImageIcon,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Settings,
  Trash2,
  Sparkles,
  X,
  Check,
  LogOut,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ui/theme-toggle";

type ChatItem = {
  id: string;
  title: string;
  updatedAt: string;
};

type AppSidebarProps = {
  chats: ChatItem[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, title: string) => void;
};

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{
        background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
      }}
    >
      {initials}
    </div>
  );
}

export default function AppSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  }

  function startRename(chat: ChatItem) {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  }

  function saveRename(chatId: string) {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  }

  const navLinkClass = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
      active
        ? "bg-[var(--accent-light)] text-[var(--accent)]"
        : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
    }`;

  /* ─── Collapsed view ─── */
  if (collapsed) {
    return (
      <div
        className="flex h-full w-14 flex-col items-center border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] py-3 gap-2"
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={navLinkClass(false)}
          title="Open sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
            color: "white",
          }}
          title="New chat"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>

        <div className="flex-1" />

        <Link href="/image-generation" className={navLinkClass(pathname === "/image-generation")} title="Image Generation">
          <ImageIcon className="h-4 w-4" />
        </Link>
        <Link href="/settings" className={navLinkClass(pathname === "/settings")} title="Settings">
          <Settings className="h-4 w-4" />
        </Link>
        <ThemeToggle />
      </div>
    );
  }

  /* ─── Expanded view ─── */
  return (
    <div className="flex h-full w-72 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            Mentorship Chat
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition hover:bg-[var(--bg-tertiary)]"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 pb-2 shrink-0">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-transparent px-3 text-sm font-medium text-[var(--text-primary)] transition-all duration-150 hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)]"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      {/* Chat history */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {chats.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-[var(--text-tertiary)]">
              No conversations yet.
            </p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Start a new chat above!
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {chats.length > 0 && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Recent
              </p>
            )}
            {chats.map((chat) => {
              const isActive = currentChatId === chat.id;
              return (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-all duration-100 ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {editingId === chat.id ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(chat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-2 py-0.5 text-sm outline-none focus:border-[var(--accent)]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => saveRename(chat.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--success)]"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-[var(--bg-tertiary)]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onSelectChat(chat.id)}
                        className="min-w-0 flex-1 truncate text-left text-sm"
                      >
                        {chat.title}
                      </button>
                      <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                        <button
                          type="button"
                          onClick={() => startRename(chat)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-tertiary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)]"
                          title="Rename"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteChat(chat.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-tertiary)] hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3 space-y-1">
        <Link
          href="/image-generation"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-100 ${
            pathname === "/image-generation"
              ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <ImageIcon className="h-4 w-4 shrink-0" />
          Image Generation
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-100 ${
            pathname === "/settings"
              ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>

        {/* User row */}
        <div className="mt-2 flex items-center gap-2 rounded-lg px-2 py-1.5">
          <UserAvatar name={session?.user?.name ?? "User"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">
              {session?.user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-[var(--text-tertiary)]">
              {session?.user?.email ?? ""}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition hover:bg-[var(--bg-tertiary)] hover:text-red-400"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
