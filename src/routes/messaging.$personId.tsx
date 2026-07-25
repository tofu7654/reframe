import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { TopNav } from "@/components/linkedout/TopNav";
import { getPerson, PEOPLE } from "@/lib/people-data";
import { loadMessages, saveMessages, autoReply, type ChatMessage } from "@/lib/messages-store";

export const Route = createFileRoute("/messaging/$personId")({
  loader: ({ params }) => {
    const person = getPerson(params.personId);
    if (!person) throw notFound();
    return { person };
  },
  component: ChatPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Chat with ${loaderData.person.name} — LinkedOut` : "Messaging — LinkedOut" },
      { name: "description", content: "Send messages to your connections on LinkedOut." },
      { property: "og:title", content: "Messaging — LinkedOut" },
      { property: "og:description", content: "Send messages to your connections." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function ChatPage() {
  const { person } = Route.useLoaderData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages(person.id));
  }, [person.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const mine: ChatMessage = { id: crypto.randomUUID(), from: "me", text, at: Date.now() };
    const next = [...messages, mine];
    setMessages(next);
    saveMessages(person.id, next);
    setDraft("");
    setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        from: "them",
        text: autoReply(text),
        at: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, reply];
        saveMessages(person.id, updated);
        return updated;
      });
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-140px)]">
          <aside className="border-r border-border overflow-y-auto">
            <div className="p-3 font-semibold border-b border-border">Messaging</div>
            {PEOPLE.map((p) => (
              <Link
                key={p.id}
                to="/messaging/$personId"
                params={{ personId: p.id }}
                className={`flex gap-3 p-3 border-b border-border hover:bg-accent ${
                  p.id === person.id ? "bg-accent" : ""
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold shrink-0">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.headline}</div>
                </div>
              </Link>
            ))}
          </aside>
          <section className="flex flex-col min-h-0">
            <div className="p-3 border-b border-border flex items-center gap-3">
              <Link
                to="/profile/$personId"
                params={{ personId: person.id }}
                className="h-10 w-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold"
              >
                {person.initials}
              </Link>
              <div>
                <Link
                  to="/profile/$personId"
                  params={{ personId: person.id }}
                  className="font-semibold hover:underline"
                >
                  {person.name}
                </Link>
                <div className="text-xs text-muted-foreground">{person.headline}</div>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground mt-8">
                  This is the start of your conversation with {person.name.split(" ")[0]}. Say hello!
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                        m.from === "me"
                          ? "bg-brand text-brand-foreground rounded-br-sm"
                          : "bg-accent text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Write a message to ${person.name.split(" ")[0]}...`}
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
          </section>
        </div>
      </div>
    </div>
  );
}
