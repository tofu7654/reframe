import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { getJob, type Job } from "@/lib/jobs-data";
import { JobHeaderCard } from "@/components/jobs/JobHeaderCard";
import { JobAboutCard } from "@/components/jobs/JobAboutCard";
import { JobCompanyFollowCard } from "@/components/jobs/JobCompanyFollowCard";

export const Route = createFileRoute("/jobs/$jobId/")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: JobDetail,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.job.title} · ${loaderData.job.company} — LinkedOut` },
          { name: "description", content: loaderData.job.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.job.title} · ${loaderData.job.company}` },
          { property: "og:description", content: loaderData.job.description.slice(0, 155) },
          { property: "og:type", content: "website" },
        ]
      : [{ title: "Job not found — LinkedOut" }, { name: "robots", content: "noindex" }],
  }),
});

function JobDetail() {
  const { job } = Route.useLoaderData() as { job: Job };
  return (
    <PageShell>
      <main className="max-w-[900px] mx-auto px-4 py-6">
        <Link to="/jobs" className="text-sm text-primary hover:underline">
          ← Back to jobs
        </Link>
        <JobHeaderCard job={job} />
        <JobAboutCard job={job} />
        <JobCompanyFollowCard job={job} />
      </main>
    </PageShell>
  );
}
