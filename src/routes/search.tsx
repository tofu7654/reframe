import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { TopNav } from "@/components/linkedout/TopNav";
import { searchPeople } from "@/lib/people-data";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
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
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="mb-4 flex gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-foreground text-background">People</span>
          <span className="px-3 py-1 rounded-full border border-border text-muted-foreground">Jobs</span>
          <span className="px-3 py-1 rounded-full border border-border text-muted-foreground">Companies</span>
          <span className="px-3 py-1 rounded-full border border-border text-muted-foreground">Posts</span>
        </div>
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
                <li key={p.id} className="p-4 border-b border-border last:border-0 flex items-start gap-4">
                  <Link
                    to="/profile/$personId"
                    params={{ personId: p.id }}
                    className="h-16 w-16 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-xl shrink-0"
                  >
                    {p.initials}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/profile/$personId"
                      params={{ personId: p.id }}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {p.name}
                    </Link>
                    <div className="text-sm text-foreground">{p.headline}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.location}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.mutual} mutual connections
                    </div>
                  </div>
                  <Link
                    to="/profile/$personId"
                    params={{ personId: p.id }}
                    className="px-4 py-1.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/10"
                  >
                    View profile
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
