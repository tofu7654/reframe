import { useEffect, useState } from "react";
import { Check, UserPlus, Users } from "lucide-react";
import { getConnectionsForJob } from "@/lib/company-connections-data";
import { getJob, type Job } from "@/lib/jobs-data";
import { LocalEventStore } from "@/tracking/eventStore";

export function AppliedCompanyConnections() {
  const [job, setJob] = useState<Job | null>(null);
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const events = new LocalEventStore(window.localStorage).read();
    const jobId = events
      .filter((event) => event.type === "job_application_submitted")
      .at(-1)?.targetId;
    setJob(jobId ? (getJob(jobId) ?? null) : null);
  }, []);

  if (!job) return null;

  const connections = getConnectionsForJob(job.id);
  if (connections.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">People at {job.company}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            You applied for {job.title}. These employees may help you learn more about the team.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {connections.map((person) => {
          const isRequested = Boolean(requested[person.id]);
          return (
            <li
              key={person.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold">
                {person.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{person.name}</p>
                <p className="truncate text-xs text-muted-foreground">{person.role}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {person.mutualConnections} mutual connections
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setRequested((current) => ({ ...current, [person.id]: !isRequested }))
                }
                aria-pressed={isRequested}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                {isRequested ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                {isRequested ? "Requested" : "Connect"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
