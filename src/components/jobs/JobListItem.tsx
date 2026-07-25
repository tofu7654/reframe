import { Bookmark } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { Job } from "@/lib/jobs-data";

export function JobListItem({ job }: { job: Job }) {
  const navigate = useNavigate();
  return (
    <li
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
  );
}
