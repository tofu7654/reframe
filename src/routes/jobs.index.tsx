import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin } from "lucide-react";
import { JOBS } from "@/lib/jobs-data";
import { PageShell } from "@/components/layout/PageShell";
import { JobsSearchBar } from "@/components/jobs/JobsSearchBar";
import { JobsList } from "@/components/jobs/JobsList";

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
  return (
    <PageShell>
      <JobsSearchBar />
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <JobsList jobs={JOBS} />
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          <Building2 className="h-3 w-3" />
          <MapPin className="h-3 w-3" />
          Showing roles near your saved locations
        </div>
      </main>
    </PageShell>
  );
}
