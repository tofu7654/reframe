import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePersonalization } from "@/personalization/PersonalizationContext";

export function JobsSearchBar() {
  const [query, setQuery] = useState("");
  const { trackEvent } = usePersonalization();

  return (
    <div className="border-b border-border bg-card">
      <form
        className="max-w-[1128px] mx-auto px-4 py-3 flex items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!query.trim()) return;
          trackEvent("job_search_performed");
          setQuery("");
        }}
      >
        <div className="relative flex-1 max-w-[520px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe the job you want"
            aria-label="Job search"
            className="w-full h-10 pl-10 pr-3 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Search
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 h-9 px-3 rounded-full border border-border text-sm hover:bg-accent"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </form>
    </div>
  );
}
