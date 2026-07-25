import { Search, SlidersHorizontal } from "lucide-react";

export function JobsSearchBar() {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-[1128px] mx-auto px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-[520px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Describe the job you want"
            className="w-full h-10 pl-10 pr-3 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button className="inline-flex items-center gap-1 h-9 px-3 rounded-full border border-border text-sm hover:bg-accent">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>
    </div>
  );
}
