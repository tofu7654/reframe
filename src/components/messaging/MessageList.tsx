import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/messages-store";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  emptyName,
}: {
  messages: ChatMessage[];
  emptyName: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground mt-8">
          This is the start of your conversation with {emptyName}. Say hello!
        </div>
      ) : (
        messages.map((m) => <MessageBubble key={m.id} message={m} />)
      )}
    </div>
  );
}
