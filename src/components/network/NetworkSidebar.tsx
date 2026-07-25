import { Users, UserPlus, Contact, Hash, Calendar, Newspaper, FileText, Rss } from "lucide-react";
import { NETWORK_STATS } from "@/lib/network-data";

const ITEMS = [
  { icon: Users, label: "Connections", value: NETWORK_STATS.connections },
  { icon: UserPlus, label: "Following & followers", value: NETWORK_STATS.following },
  { icon: Contact, label: "Contacts", value: null as number | null },
  { icon: Hash, label: "Groups", value: NETWORK_STATS.groups },
  { icon: Calendar, label: "Events", value: NETWORK_STATS.events },
  { icon: FileText, label: "Pages", value: NETWORK_STATS.pages },
  { icon: Newspaper, label: "Newsletters", value: NETWORK_STATS.newsletters },
  { icon: Rss, label: "Hashtags", value: null as number | null },
];

export function NetworkSidebar() {
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Manage my network</h2>
      </div>
      <ul>
        {ITEMS.map((item) => (
          <li key={item.label}>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </span>
              {item.value !== null ? (
                <span className="text-muted-foreground">{item.value}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
