import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/linkedout/TopNav";
import { PEOPLE, getPerson } from "@/lib/people-data";
import { listThreads, loadMessages } from "@/lib/messages-store";

export const Route = createFileRoute("/messaging/")({
  component: MessagingIndex,
  head: () => ({
    meta: [
      { title: "Messaging — LinkedOut" },
      { name: "description", content: "Your conversations on LinkedOut." },
      { property: "og:title", content: "Messaging — LinkedOut" },
      { property: "og:description", content: "Your conversations." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function MessagingIndex() {
  const [threadIds, setThreadIds] = useState<string[]>([]);
  useEffect(() => {
    setThreadIds(listThreads());
  }, []);

  const withThreads = threadIds.map((id) => getPerson(id)).filter(Boolean);
  const suggested = PEOPLE.filter((p) => !threadIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border font-semibold">Messaging</div>
          {withThreads.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">
              No conversations yet. Start one below.
            </div>
          )}
          <ul>
            {withThreads.map((p) => {
              const msgs = loadMessages(p!.id);
              const last = msgs[msgs.length - 1];
              return (
                <li key={p!.id} className="border-b border-border last:border-0">
                  <Link
                    to="/messaging/$personId"
                    params={{ personId: p!.id }}
                    className="flex gap-3 p-4 hover:bg-accent"
                  >
                    <div className="h-12 w-12 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold shrink-0">
                      {p!.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{p!.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : "Start the conversation"}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {suggested.length > 0 && (
            <div className="p-4 border-t border-border">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Suggested
              </div>
              <ul className="space-y-2">
                {suggested.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/messaging/$personId"
                      params={{ personId: p.id }}
                      className="flex gap-3 p-2 rounded hover:bg-accent"
                    >
                      <div className="h-10 w-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold shrink-0">
                        {p.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.headline}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
