import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getJob } from "@/lib/jobs-data";
import { ApplyForm } from "@/components/jobs/ApplyForm";
import { ApplySuccess } from "@/components/jobs/ApplySuccess";
import { usePersonalization } from "@/personalization/PersonalizationContext";

export const Route = createFileRoute("/jobs/$jobId/apply")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: ApplyPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `Apply · ${loaderData.job.title} — LinkedOut` : "Apply — LinkedOut",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const startedJobIdRef = useRef<string | null>(null);
  const { recordEvent, trackEvent } = usePersonalization();

  useEffect(() => {
    if (startedJobIdRef.current === job.id) return;
    startedJobIdRef.current = job.id;
    recordEvent("job_application_started", job.id);
  }, [job.id, recordEvent]);

  if (submitted) {
    return (
      <PageShell>
        <main className="max-w-[600px] mx-auto px-4 py-10">
          <ApplySuccess job={job} />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-[720px] mx-auto px-4 py-6">
        <Link
          to="/jobs/$jobId"
          params={{ jobId: job.id }}
          className="text-sm text-primary hover:underline"
        >
          ← Back to job
        </Link>
        <ApplyForm
          job={job}
          onCancel={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
          onSubmit={() => {
            trackEvent("job_application_submitted", job.id);
            setSubmitted(true);
          }}
        />
      </main>
    </PageShell>
  );
}
