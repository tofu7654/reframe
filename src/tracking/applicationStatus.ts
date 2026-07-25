import type { AnalyticsEvent } from "@/contracts/events";
import { getJob, type Job } from "@/lib/jobs-data";

export type ApplicationStatus = "unfinished" | "submitted";

export interface TrackedApplication {
  job: Job;
  status: ApplicationStatus;
  occurredAt: string;
}

export function getTrackedApplications(events: readonly AnalyticsEvent[]): TrackedApplication[] {
  const latestByJobId = new Map<string, Omit<TrackedApplication, "job">>();

  for (const event of events) {
    if (
      !event.targetId ||
      (event.type !== "job_application_started" && event.type !== "job_application_submitted")
    ) {
      continue;
    }

    latestByJobId.set(event.targetId, {
      status: event.type === "job_application_submitted" ? "submitted" : "unfinished",
      occurredAt: event.occurredAt,
    });
  }

  return [...latestByJobId.entries()]
    .map(([jobId, application]) => {
      const job = getJob(jobId);
      return job ? { job, ...application } : null;
    })
    .filter((application): application is TrackedApplication => application !== null)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
}
