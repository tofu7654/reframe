import type { NotificationCategory } from "@/lib/notifications-data";

const TABS: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "jobs", label: "Jobs" },
  { id: "mentions", label: "Mentions" },
  { id: "posts", label: "My posts" },
];

export function NotificationsFilterBar({
  active,
  onChange,
}: {
  active: NotificationCategory;
  onChange: (id: NotificationCategory) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
              isActive
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
