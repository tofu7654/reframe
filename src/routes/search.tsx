import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { searchPeople } from "@/lib/people-data";
import { SearchTabs } from "@/components/search/SearchTabs";
import { PersonResultCard } from "@/components/search/PersonResultCard";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search — LinkedOut" },
      { name: "description", content: "Search people, jobs, and companies on LinkedOut." },
      { property: "og:title", content: "Search — LinkedOut" },
      { property: "og:description", content: "Find professionals and opportunities." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchPeople(q);
  return (
    <PageShell>
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <SearchTabs active="People" />
        <div className="bg-card rounded border border-border">
          <div className="px-4 py-3 border-b border-border text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for "{q}"
          </div>
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No people match your search. Try "footballer", "forward", or "Mbappé".
            </div>
          ) : (
            <ul>
              {results.map((p) => (
                <PersonResultCard key={p.id} person={p} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
