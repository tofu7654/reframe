import { Link } from "@tanstack/react-router";
import type { Person } from "@/lib/people-data";

export function ChatHeader({ person }: { person: Person }) {
  return (
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
  );
}
