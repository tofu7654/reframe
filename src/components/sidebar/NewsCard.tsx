import { Info, ChevronDown } from "lucide-react";
import { NEWS_STORIES, type NewsStory } from "@/lib/news-data";

export function NewsCard({ stories = NEWS_STORIES }: { stories?: NewsStory[] }) {
  return (
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
  );
}
