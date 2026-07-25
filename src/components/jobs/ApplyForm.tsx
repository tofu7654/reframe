import { useState } from "react";
import { Upload } from "lucide-react";
import { FormField } from "./FormField";
import type { Job } from "@/lib/jobs-data";

export type ApplicationForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
};

const EMPTY: ApplicationForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  resume: "",
  coverLetter: "",
};

export function ApplyForm({
  job,
  onCancel,
  onSubmit,
}: {
  job: Job;
  onCancel: () => void;
  onSubmit: (form: ApplicationForm) => void;
}) {
  const [form, setForm] = useState<ApplicationForm>(EMPTY);
  const update =
    (k: keyof ApplicationForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
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
          onSubmit(form);
        }}
      >
        <div>
          <h2 className="font-semibold text-sm">Contact info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <FormField label="First name" required value={form.firstName} onChange={update("firstName")} />
            <FormField label="Last name" required value={form.lastName} onChange={update("lastName")} />
            <FormField label="Email" type="email" required value={form.email} onChange={update("email")} />
            <FormField label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-sm">Resume</h2>
          <label className="mt-3 flex items-center gap-3 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-accent/40">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 text-sm">
              <div className="font-medium">{form.resume ? form.resume : "Upload resume"}</div>
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
            onClick={onCancel}
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
  );
}
