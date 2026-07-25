import { Plus } from "lucide-react";
import { PEOPLE_SUGGESTIONS, type PersonSuggestion } from "@/lib/news-data";

export function SuggestionsCard({
  suggestions = PEOPLE_SUGGESTIONS,
  title = "People you may know",
}: {
  suggestions?: PersonSuggestion[];
  title?: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-base mb-3">{title}</h3>
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
  );
}
