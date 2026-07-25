import { useState } from "react";
import { Send } from "lucide-react";

export function MessageComposer({
  placeholderName,
  onSend,
}: {
  placeholderName: string;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text) return;
        onSend(text);
        setDraft("");
      }}
      className="border-t border-border p-3 flex gap-2"
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={`Write a message to ${placeholderName}...`}
        className="flex-1 h-10 px-3 rounded-full bg-accent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={!draft.trim()}
        className="h-10 px-4 rounded-full bg-brand text-brand-foreground font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> Send
      </button>
    </form>
  );
}
