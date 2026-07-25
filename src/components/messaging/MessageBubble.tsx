import type { ChatMessage } from "@/lib/messages-store";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.from === "me";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
          mine
            ? "bg-brand text-brand-foreground rounded-br-sm"
            : "bg-accent text-foreground rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
