import { useState } from "react";
import { Check, MapPin, SearchCheck, Sparkles } from "lucide-react";

const CANDIDATES = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    initials: "MC",
    headline: "Senior Platform Engineer",
    location: "Washington, DC",
    matchingSkills: ["Kubernetes", "Terraform", "AWS"],
  },
  {
    id: "jordan-brooks",
    name: "Jordan Brooks",
    initials: "JB",
    headline: "Staff DevOps Engineer",
    location: "Arlington, VA",
    matchingSkills: ["CI/CD", "GCP", "SRE"],
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    initials: "PS",
    headline: "Cloud Security Engineer",
    location: "Alexandria, VA",
    matchingSkills: ["DevSecOps", "AWS", "Compliance"],
  },
] as const;

export function CandidateResearchQueue() {
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <SearchCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Candidate Research Queue</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Nearby people matching skills from the profiles you have been researching.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {CANDIDATES.map((candidate) => {
          const isReviewed = Boolean(reviewed[candidate.id]);
          return (
            <li key={candidate.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold">
                  {candidate.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{candidate.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{candidate.headline}</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {candidate.location}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {candidate.matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setReviewed((current) => ({ ...current, [candidate.id]: !isReviewed }))
                }
                aria-pressed={isReviewed}
                className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1 rounded-full border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                {isReviewed ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isReviewed ? "Reviewed" : "Review candidate"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
