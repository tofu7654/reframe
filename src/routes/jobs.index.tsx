import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin } from "lucide-react";
import { JOBS } from "@/lib/jobs-data";
import { PageShell } from "@/components/layout/PageShell";
import { JobsSearchBar } from "@/components/jobs/JobsSearchBar";
import { JobsList } from "@/components/jobs/JobsList";
import { RenderJobsSlot } from "@/components/personalization/RenderJobsSlot";

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
      <main className="max-w-[1128px] mx-auto space-y-4 px-4 py-6">
        <RenderJobsSlot slot="jobsMain" />
        <JobsList jobs={JOBS} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <MapPin className="h-3 w-3" />
          Showing roles near your saved locations
        </div>
      </main>
    </PageShell>
  );
}
