import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Building2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { JOBS } from "@/lib/jobs-data";
import { TopNav } from "@/components/linkedout/TopNav";

export const Route = createFileRoute("/jobs/")({
  component: JobsPage,
  head: () => ({
    meta: [
      { title: "Jobs — LinkedOut" },
      { name: "description", content: "Discover roles that match your skills on LinkedOut." },
      { property: "og:title", content: "Jobs — LinkedOut" },
      { property: "og:description", content: "Browse and apply to top jobs on LinkedOut." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function JobsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
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
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-semibold">Top job picks for you</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your profile, preferences, and activity
            </p>
            <p className="text-xs text-muted-foreground mt-1">{JOBS.length} results</p>
          </div>
          <ul>
            {JOBS.map((job) => (
              <li
                key={job.id}
                onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
                className="flex gap-3 p-4 border-b border-border last:border-b-0 hover:bg-accent/50 cursor-pointer"
              >
                <div
                  className={`h-14 w-14 rounded shrink-0 grid place-items-center font-bold text-lg ${job.logoColor}`}
                >
                  {job.logoInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: job.id }}
                    className="text-base font-semibold text-primary hover:underline"
                  >
                    {job.title}
                  </Link>
                  <div className="text-sm text-foreground">{job.company}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.location} ({job.workplace})
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {job.salary} · {job.benefits[0]}
                  </div>
                  {job.connections ? (
                    <div className="text-xs text-muted-foreground mt-1">
                      {job.connections} connections work here
                    </div>
                  ) : null}
                  <div className="text-xs text-muted-foreground mt-1">
                    {job.promoted ? "Promoted · " : ""}
                    {job.posted}
                  </div>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 grid place-items-center rounded-full hover:bg-accent"
                  aria-label="Save job"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          <Building2 className="h-3 w-3" />
          <MapPin className="h-3 w-3" />
          Showing roles near your saved locations
        </div>
      </main>
    </div>
  );
}
