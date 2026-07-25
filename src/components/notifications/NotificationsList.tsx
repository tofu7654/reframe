import { Link } from "@tanstack/react-router";
import type { Notification } from "@/lib/notifications-data";

export function NotificationsList({
  items,
  onMarkRead,
}: {
  items: Notification[];
  onMarkRead: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-muted-foreground">
        No notifications in this category.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {items.map((n) => (
        <li
          key={n.id}
          onClick={() => onMarkRead(n.id)}
          className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
            n.unread ? "bg-brand/5" : ""
          }`}
        >
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
            {n.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{n.actor}</span> {n.message}
            </p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{n.time}</span>
              {n.cta ? (
                n.cta.to ? (
                  <Link
                    to={n.cta.to}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    {n.cta.label}
                  </Link>
                ) : (
                  <button className="text-xs font-semibold text-brand hover:underline">
                    {n.cta.label}
                  </button>
                )
              ) : null}
            </div>
          </div>
          {n.unread ? (
            <span className="h-2 w-2 rounded-full bg-brand mt-2 shrink-0" aria-label="Unread" />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
