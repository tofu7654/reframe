import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardList, Clock3 } from "lucide-react";
import type { ApplicationStatus, TrackedApplication } from "@/tracking/applicationStatus";
import { getTrackedApplications } from "@/tracking/applicationStatus";
import { LocalEventStore } from "@/tracking/eventStore";

export function ApplicationTracker() {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);

  useEffect(() => {
    const events = new LocalEventStore(window.localStorage).read();
    setApplications(getTrackedApplications(events));
  }, []);

  const unfinishedCount = applications.filter(
    (application) => application.status === "unfinished",
  ).length;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Application Tracker</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {unfinishedCount > 0
                ? `${unfinishedCount} unfinished ${unfinishedCount === 1 ? "application" : "applications"} ready to resume`
                : "Your recent applications in one place"}
            </p>
          </div>
        </div>
        {unfinishedCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            {unfinishedCount} to finish
          </span>
        ) : null}
      </div>

      {applications.length > 0 ? (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {applications.map(({ job, status }) => (
            <li key={job.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-xs font-bold ${job.logoColor}`}
                >
                  {job.logoInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{job.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{job.company}</p>
                </div>
                <Status status={status} />
              </div>

              <div className="mt-3 flex justify-end">
                {status === "unfinished" ? (
                  <Link
                    to="/jobs/$jobId/apply"
                    params={{ jobId: job.id }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Resume application
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: job.id }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View job
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">
          Start an application and it will appear here.
        </p>
      )}
    </section>
  );
}

function Status({ status }: { status: ApplicationStatus }) {
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Submitted
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      Unfinished
    </span>
  );
}
