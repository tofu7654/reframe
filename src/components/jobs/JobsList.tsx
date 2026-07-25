import type { Job } from "@/lib/jobs-data";
import { JobListItem } from "./JobListItem";

export function JobsList({ jobs, title = "Top job picks for you" }: { jobs: Job[]; title?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your profile, preferences, and activity
        </p>
        <p className="text-xs text-muted-foreground mt-1">{jobs.length} results</p>
      </div>
      <ul>
        {jobs.map((job) => (
          <JobListItem key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}
