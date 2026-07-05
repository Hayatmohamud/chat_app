"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import MessageComponent from "@/components/chat/Message";
import { MessageSkeleton } from "@/components/ui/skeleton";

type MessageListProps = {
  messages: UIMessage[];
  isLoading: boolean;
  onRegenerate?: () => void;
};

export default function MessageList({
  messages,
  isLoading,
  onRegenerate,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Also scroll when content streams in
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex flex-col">
      {messages.map((message, index) => (
        <MessageComponent
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
          onRegenerate={
            index === messages.length - 1 ? onRegenerate : undefined
          }
        />
      ))}

      {/* Skeleton for first response */}
      {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
        <MessageSkeleton />
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
