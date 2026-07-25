import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { NotificationsFilterBar } from "@/components/notifications/NotificationsFilterBar";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { NOTIFICATIONS, type NotificationCategory } from "@/lib/notifications-data";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notifications — LinkedOut" },
      {
        name: "description",
        content: "Stay on top of mentions, job matches, and activity from your LinkedOut network.",
      },
      { property: "og:title", content: "Notifications — LinkedOut" },
      { property: "og:description", content: "Mentions, jobs, and updates from your network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NotificationsPage() {
  const [category, setCategory] = useState<NotificationCategory>("all");
  const [items, setItems] = useState(NOTIFICATIONS);

  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((n) => n.category === category)),
    [category, items],
  );

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <PageShell>
      <main className="max-w-[720px] mx-auto px-4 py-6">
        <section className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <div>
              <h1 className="text-base font-semibold text-foreground">Notifications</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread
              </p>
            </div>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-sm font-semibold text-brand hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              Mark all as read
            </button>
          </div>
          <NotificationsFilterBar active={category} onChange={setCategory} />
          <NotificationsList items={filtered} onMarkRead={markRead} />
        </section>
      </main>
    </PageShell>
  );
}
