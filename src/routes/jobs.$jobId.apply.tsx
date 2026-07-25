import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { TopNav } from "@/components/linkedout/TopNav";
import { getJob } from "@/lib/jobs-data";

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
        title: loaderData
          ? `Apply · ${loaderData.job.title} — LinkedOut`
          : "Apply — LinkedOut",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="max-w-[600px] mx-auto px-4 py-10">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-[720px] mx-auto px-4 py-6">
        <Link
          to="/jobs/$jobId"
          params={{ jobId: job.id }}
          className="text-sm text-primary hover:underline"
        >
          ← Back to job
        </Link>
        <div className="mt-3 bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Apply to {job.company}
            </div>
            <h1 className="text-xl font-bold mt-1">{job.title}</h1>
            <p className="text-sm text-muted-foreground">
              {job.location} · {job.workplace} · {job.employment}
            </p>
          </div>
          <form
            className="p-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <h2 className="font-semibold text-sm">Contact info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Field label="First name" required value={form.firstName} onChange={update("firstName")} />
                <Field label="Last name" required value={form.lastName} onChange={update("lastName")} />
                <Field label="Email" type="email" required value={form.email} onChange={update("email")} />
                <Field label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-sm">Resume</h2>
              <label className="mt-3 flex items-center gap-3 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-accent/40">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <div className="font-medium">
                    {form.resume ? form.resume : "Upload resume"}
                  </div>
                  <div className="text-xs text-muted-foreground">DOC, DOCX, PDF (5MB max)</div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, resume: e.target.files?.[0]?.name ?? "" }))
                  }
                />
              </label>
            </div>
            <div>
              <label className="font-semibold text-sm block">Cover letter (optional)</label>
              <textarea
                value={form.coverLetter}
                onChange={update("coverLetter")}
                rows={5}
                className="mt-2 w-full rounded border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Tell the hiring team why you're a great fit"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
                className="h-10 px-5 rounded-full text-sm font-semibold text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
              >
                Submit application
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 w-full h-10 rounded border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </label>
  );
}
