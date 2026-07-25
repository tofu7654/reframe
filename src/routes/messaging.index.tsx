import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { listThreads } from "@/lib/messages-store";
import { ConversationsList } from "@/components/messaging/ConversationsList";

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

  return (
    <PageShell>
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <ConversationsList threadIds={threadIds} />
      </div>
    </PageShell>
  );
}
