import { useState } from "react";
import { INVITATIONS, type Invitation } from "@/lib/network-data";

export function InvitationsCard() {
  const [items, setItems] = useState<Invitation[]>(INVITATIONS);

  const respond = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <section className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Invitations ({items.length})</h2>
        <button className="text-sm font-semibold text-muted-foreground hover:text-foreground">
          Manage
        </button>
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No pending invitations.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((invite) => (
            <li key={invite.id} className="px-4 py-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-base font-semibold text-foreground shrink-0">
                {invite.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{invite.name}</p>
                <p className="text-xs text-muted-foreground truncate">{invite.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {invite.mutual} mutual connections · {invite.sentAt}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => respond(invite.id)}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:bg-accent"
                >
                  Ignore
                </button>
                <button
                  onClick={() => respond(invite.id)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold border border-brand text-brand hover:bg-brand/10"
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
