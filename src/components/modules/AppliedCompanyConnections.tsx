import { useEffect, useState } from "react";
import { Check, UserPlus, Users } from "lucide-react";
import { getConnectionsForJob } from "@/lib/company-connections-data";
import { getJob, type Job } from "@/lib/jobs-data";
import { LocalEventStore } from "@/tracking/eventStore";
import { usePreviewMode } from "@/personalization/PreviewModeContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function AppliedCompanyConnections() {
  const [job, setJob] = useState<Job | null>(null);
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const previewMode = usePreviewMode();

  useEffect(() => {
    if (previewMode) {
      setJob(getJob("platform-stripe") ?? null);
      return;
    }
    const events = new LocalEventStore(window.localStorage).read();
    const jobId = events
      .filter((event) => event.type === "job_application_submitted")
      .at(-1)?.targetId;
    setJob(jobId ? (getJob(jobId) ?? null) : null);
  }, [previewMode]);

  if (!job) return null;

  const connections = getConnectionsForJob(job.id);
  if (connections.length === 0) return null;
  const connectionPages = Array.from({ length: Math.ceil(connections.length / 3) }, (_, index) =>
    connections.slice(index * 3, index * 3 + 3),
  );

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-start gap-3 p-4">
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

      <Carousel
        opts={{ align: "start", loop: connectionPages.length > 1 }}
        aria-label={`People at ${job.company}, three at a time`}
      >
        <CarouselContent className="ml-0">
          {connectionPages.map((people, pageIndex) => (
            <CarouselItem
              key={people.map((person) => person.id).join("-")}
              className="pl-0"
              aria-label={`People group ${pageIndex + 1} of ${connectionPages.length}`}
            >
              <ul className="grid grid-cols-3 gap-3 p-4 pt-0">
                {people.map((person) => {
                  const isRequested = Boolean(requested[person.id]);
                  return (
                    <li
                      key={person.id}
                      className="flex min-h-56 flex-col rounded-lg border border-border p-3 text-center"
                    >
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-sm font-semibold">
                        {person.initials}
                      </div>
                      <p className="mt-3 line-clamp-1 text-sm font-semibold">{person.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {person.role}
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {person.mutualConnections} mutual connections
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setRequested((current) => ({
                            ...current,
                            [person.id]: !isRequested,
                          }))
                        }
                        aria-pressed={isRequested}
                        className="mt-auto inline-flex h-8 w-full items-center justify-center gap-1 rounded-full border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/10"
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="relative flex h-11 items-center justify-center border-t border-border">
          <span className="text-xs text-muted-foreground">Swipe for more people</span>
          <CarouselPrevious className="bottom-1.5 left-4 top-auto translate-y-0" />
          <CarouselNext className="bottom-1.5 right-4 top-auto translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
