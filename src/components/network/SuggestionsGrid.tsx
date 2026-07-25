import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserPlus, Check } from "lucide-react";
import { SUGGESTIONS } from "@/lib/network-data";

export function SuggestionsGrid() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const items = SUGGESTIONS.filter((s) => !dismissed[s.id]);

  return (
    <section className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">People you may know</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Based on your recent activity</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
        {items.map((person) => {
          const isConnected = !!connected[person.id];
          const card = (
            <div className="relative bg-card border border-border rounded-lg overflow-hidden flex flex-col items-center pt-6 pb-4 px-4 h-full">
              <button
                aria-label="Dismiss"
                onClick={(e) => {
                  e.preventDefault();
                  setDismissed((p) => ({ ...p, [person.id]: true }));
                }}
                className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent"
              >
                ×
              </button>
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-lg font-semibold text-foreground">
                {person.initials}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground text-center line-clamp-1">
                {person.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground text-center line-clamp-2">
                {person.headline}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {person.mutual} mutual connections
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConnected((p) => ({ ...p, [person.id]: !p[person.id] }));
                }}
                className={`mt-3 w-full py-1.5 rounded-full text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                  isConnected
                    ? "border-border text-muted-foreground"
                    : "border-brand text-brand hover:bg-brand/10"
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="h-4 w-4" /> Pending
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Connect
                  </>
                )}
              </button>
            </div>
          );
          return (
            <li key={person.id}>
              {person.personId ? (
                <Link
                  to="/profile/$personId"
                  params={{ personId: person.personId }}
                  className="block h-full"
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
      {items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No more suggestions right now.
        </div>
      ) : null}
    </section>
  );
}
