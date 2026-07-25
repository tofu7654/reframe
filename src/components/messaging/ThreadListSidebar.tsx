import { Link } from "@tanstack/react-router";
import { PEOPLE } from "@/lib/people-data";

export function ThreadListSidebar({ activeId }: { activeId?: string }) {
  return (
    <aside className="border-r border-border overflow-y-auto">
      <div className="p-3 font-semibold border-b border-border">Messaging</div>
      {PEOPLE.map((p) => (
        <Link
          key={p.id}
          to="/messaging/$personId"
          params={{ personId: p.id }}
          className={`flex gap-3 p-3 border-b border-border hover:bg-accent ${
            p.id === activeId ? "bg-accent" : ""
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
  );
}
