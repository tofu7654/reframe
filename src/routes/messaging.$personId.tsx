import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getPerson } from "@/lib/people-data";
import { loadMessages, saveMessages, autoReply, type ChatMessage } from "@/lib/messages-store";
import { ThreadListSidebar } from "@/components/messaging/ThreadListSidebar";
import { ChatHeader } from "@/components/messaging/ChatHeader";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageComposer } from "@/components/messaging/MessageComposer";

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

  useEffect(() => {
    setMessages(loadMessages(person.id));
  }, [person.id]);

  function send(text: string) {
    const mine: ChatMessage = { id: crypto.randomUUID(), from: "me", text, at: Date.now() };
    const next = [...messages, mine];
    setMessages(next);
    saveMessages(person.id, next);
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
    <PageShell>
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-140px)]">
          <ThreadListSidebar activeId={person.id} />
          <section className="flex flex-col min-h-0">
            <ChatHeader person={person} />
            <MessageList messages={messages} emptyName={person.name.split(" ")[0]} />
            <MessageComposer placeholderName={person.name.split(" ")[0]} onSend={send} />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
