import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Share2, MoreHorizontal, ExternalLink, BadgeCheck, Building2 } from "lucide-react";
import { TopNav } from "@/components/linkedout/TopNav";
import { getJob, type Job } from "@/lib/jobs-data";

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
  const { job } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-[900px] mx-auto px-4 py-6">
        <Link to="/jobs" className="text-sm text-primary hover:underline">
          ← Back to jobs
        </Link>
        <div className="mt-3 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded grid place-items-center font-bold ${job.logoColor}`}
            >
              {job.logoInitials}
            </div>
            <div className="font-semibold">{job.company}</div>
            <div className="ml-auto flex gap-1">
              <button className="h-8 w-8 grid place-items-center rounded-full hover:bg-accent text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 grid place-items-center rounded-full hover:bg-accent text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold flex items-center gap-2">
            {job.title}
            {job.verified ? <BadgeCheck className="h-5 w-5 text-primary" /> : null}
          </h1>
          <div className="mt-1 text-sm text-muted-foreground">
            {job.location} · {job.posted} · {job.applicants} applicants
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-xs">
              ✓ {job.workplace}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-xs">
              {job.employment}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-xs">
              {job.salary}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              to="/jobs/$jobId/apply"
              params={{ jobId: job.id }}
              className="inline-flex items-center gap-1 h-10 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
            >
              Apply <ExternalLink className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-1 h-10 px-6 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/10">
              <Bookmark className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        <div className="mt-4 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold">About the job</h2>
          <p className="mt-3 text-sm text-foreground leading-relaxed">{job.description}</p>

          <h3 className="mt-6 font-semibold text-sm">What you'll do</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-foreground">
            {job.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold text-sm">What we're looking for</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-foreground">
            {job.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold text-sm">Benefits</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.benefits.map((b) => (
              <span key={b} className="px-3 py-1 rounded-full bg-accent text-xs">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-card border border-border rounded-lg p-6 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-semibold">{job.company}</div>
            <div className="text-xs text-muted-foreground">Follow for updates on new roles</div>
          </div>
          <button className="h-8 px-4 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/10">
            Follow
          </button>
        </div>
      </main>
    </div>
  );
}
