import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import type { Job } from "@/lib/jobs-data";

export function ApplySuccess({ job }: { job: Job }) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto" />
      <h1 className="mt-4 text-2xl font-bold">Application submitted</h1>
      <p className="mt-2 text-muted-foreground">
        Your application for <span className="font-semibold text-foreground">{job.title}</span> at{" "}
        <span className="font-semibold text-foreground">{job.company}</span> has been sent.
      </p>
      <div className="mt-6 flex gap-2 justify-center">
        <Link
          to="/jobs"
          className="h-10 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 inline-flex items-center"
        >
          Browse more jobs
        </Link>
        <Link
          to="/jobs/$jobId"
          params={{ jobId: job.id }}
          className="h-10 px-6 rounded-full border border-border font-semibold text-sm hover:bg-accent inline-flex items-center"
        >
          Back to job
        </Link>
      </div>
    </div>
  );
}
