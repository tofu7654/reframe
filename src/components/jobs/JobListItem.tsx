import { Bookmark } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Job } from "@/lib/jobs-data";
import { usePersonalization } from "@/personalization/PersonalizationContext";

export function JobListItem({ job }: { job: Job }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const { trackEvent } = usePersonalization();

  const toggleSaved = () => {
    if (!saved) trackEvent("job_saved");
    setSaved(!saved);
  };

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
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggleSaved();
        }}
        className={`h-8 w-8 grid place-items-center rounded-full hover:bg-accent ${
          saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={saved ? "Remove saved job" : "Save job"}
        aria-pressed={saved}
      >
        <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
      </button>
    </li>
  );
}
