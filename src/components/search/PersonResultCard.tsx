import { Link } from "@tanstack/react-router";
import type { Person } from "@/lib/people-data";

export function PersonResultCard({ person }: { person: Person }) {
  return (
    <li className="p-4 border-b border-border last:border-0 flex items-start gap-4">
      <Link
        to="/profile/$personId"
        params={{ personId: person.id }}
        className="h-16 w-16 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-xl shrink-0"
      >
        {person.initials}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to="/profile/$personId"
          params={{ personId: person.id }}
          className="font-semibold text-foreground hover:underline"
        >
          {person.name}
        </Link>
        <div className="text-sm text-foreground">{person.headline}</div>
        <div className="text-xs text-muted-foreground mt-1">{person.location}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {person.mutual} mutual connections
        </div>
      </div>
      <Link
        to="/profile/$personId"
        params={{ personId: person.id }}
        className="px-4 py-1.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/10"
      >
        View profile
      </Link>
    </li>
  );
}
