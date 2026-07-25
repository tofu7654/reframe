import { Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, MapPin, Sparkles } from "lucide-react";
import { JOBS } from "@/lib/jobs-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const JOB_PAGES = Array.from({ length: Math.ceil(JOBS.length / 3) }, (_, index) =>
  JOBS.slice(index * 3, index * 3 + 3),
);

export function JobDiscoveryHub() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <BriefcaseBusiness className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-wide">For your job search</p>
            </div>
            <h2 className="mt-2 text-lg font-semibold">Roles worth your attention today</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh matches based on the roles you have viewed, saved, and applied to.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />3 new
          </span>
        </div>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        aria-label="Recommended jobs, three at a time"
      >
        <CarouselContent className="ml-0">
          {JOB_PAGES.map((jobs, pageIndex) => (
            <CarouselItem
              key={jobs.map((job) => job.id).join("-")}
              className="pl-0"
              aria-label={`Job group ${pageIndex + 1} of ${JOB_PAGES.length}`}
            >
              <ul className="grid grid-cols-3 gap-3 p-4">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex min-h-56 flex-col rounded-lg border border-border p-3"
                  >
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-md text-xs font-bold ${job.logoColor}`}
                    >
                      {job.logoInitials}
                    </div>
                    <div className="mt-3 flex flex-1 flex-col">
                      <Link
                        to="/jobs/$jobId"
                        params={{ jobId: job.id }}
                        className="line-clamp-2 text-sm font-semibold hover:text-primary hover:underline"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {job.company}
                      </p>
                      <p className="mt-3 flex items-start gap-1 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          {job.location} · {job.workplace}
                        </span>
                      </p>
                      <span className="mt-auto pt-3 text-xs font-medium text-foreground">
                        {job.salary}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="relative flex h-11 items-center justify-center border-t border-border">
          <span className="text-xs text-muted-foreground">Swipe for more roles</span>
          <CarouselPrevious className="bottom-1.5 left-4 top-auto translate-y-0" />
          <CarouselNext className="bottom-1.5 right-4 top-auto translate-y-0" />
        </div>
      </Carousel>

      <Link
        to="/jobs"
        className="flex items-center justify-center gap-1 border-t border-border p-3 text-sm font-semibold text-primary hover:bg-accent/50"
      >
        Explore all matching jobs
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
