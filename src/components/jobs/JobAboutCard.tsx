import type { Job } from "@/lib/jobs-data";

export function JobAboutCard({ job }: { job: Job }) {
  return (
    <div className="mt-4 bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold">About the job</h2>
      <p className="mt-3 text-sm text-foreground leading-relaxed">{job.description}</p>

      <h3 className="mt-6 font-semibold text-sm">What you'll do</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-foreground">
        {job.responsibilities.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h3 className="mt-6 font-semibold text-sm">What we're looking for</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-foreground">
        {job.qualifications.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <h3 className="mt-6 font-semibold text-sm">Benefits</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {job.benefits.map((b) => (
          <span key={b} className="px-3 py-1 rounded-full bg-accent text-xs">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
