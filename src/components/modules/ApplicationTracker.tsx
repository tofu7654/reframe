import { CheckCircle2, ClipboardList } from "lucide-react";

export function ApplicationTracker() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Application Tracker</h2>
      </div>
      <div className="mt-3 rounded-md bg-muted/60 p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Application submitted
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Your latest application is ready for follow-up.
        </p>
      </div>
    </section>
  );
}
