import { Info, ChevronDown, Plus } from "lucide-react";

const stories = [
  { title: "Paramount pauses Warner deal", meta: "4h ago · 3,640 readers" },
  { title: "Lawsuit challenges new housing rule", meta: "2h ago · 3,038 readers" },
  { title: "Firms struggle to replace retiring workforce", meta: "4h ago · 1,082 readers" },
  { title: "Ultraluxury executive perks scrutinized", meta: "4m ago · 813 readers" },
  { title: "Tunneling startup eyes $20B valuation", meta: "1h ago · 657 readers" },
];

const suggestions = [
  { name: "Jordan Blake", headline: "Engineering Manager · ex-Stripe" },
  { name: "Nina Okafor", headline: "AI Researcher @ DeepGrid" },
  { name: "Ravi Patel", headline: "Staff SRE · Cloud Infrastructure" },
];

export function RightSidebar() {
  return (
    <aside className="space-y-2">
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-base">LinkedOut News</h3>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Top stories</p>
        <ul className="space-y-3">
          {stories.map((s) => (
            <li key={s.title} className="cursor-pointer group">
              <div className="flex gap-2">
                <span className="text-muted-foreground text-xs mt-1">•</span>
                <div>
                  <div className="text-sm font-semibold group-hover:underline leading-snug">
                    {s.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.meta}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:bg-accent -mx-2 px-2 py-1.5 rounded w-[calc(100%+1rem)]">
          Show more <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-base mb-3">People you may know</h3>
        <ul className="space-y-3">
          {suggestions.map((p) => (
            <li key={p.name} className="flex items-start gap-2">
              <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">{p.headline}</div>
                <button className="mt-1.5 inline-flex items-center gap-1 px-3 py-1 rounded-full border border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground text-xs font-semibold">
                  <Plus className="h-3 w-3" /> Connect
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xs text-muted-foreground px-4 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a className="hover:text-primary hover:underline cursor-pointer">About</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Accessibility</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Help Center</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Privacy & Terms</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Ad Choices</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Advertising</a>
          <a className="hover:text-primary hover:underline cursor-pointer">Business</a>
        </div>
        <div className="pt-3 flex items-center gap-1 font-semibold">
          <span className="h-4 w-4 rounded bg-brand text-brand-foreground grid place-items-center text-[10px]">L</span>
          LinkedOut Corporation © 2026
        </div>
      </div>
    </aside>
  );
}
