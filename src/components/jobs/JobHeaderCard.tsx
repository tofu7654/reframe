import { Link } from "@tanstack/react-router";
import { Bookmark, Share2, MoreHorizontal, ExternalLink, BadgeCheck } from "lucide-react";
import type { Job } from "@/lib/jobs-data";

export function JobHeaderCard({ job }: { job: Job }) {
  return (
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
  );
}
