import { BookmarkCheck, Building2 } from "lucide-react";

export function SavedJobs() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <BookmarkCheck className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Saved Jobs</h2>
      </div>
      <div className="mt-3 space-y-3 text-sm">
        <div className="rounded-md bg-muted/60 p-3">
          <p className="font-medium">Product Designer</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            Northstar Labs
          </p>
        </div>
        <div className="rounded-md bg-muted/60 p-3">
          <p className="font-medium">Senior UX Researcher</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            Meridian
          </p>
        </div>
      </div>
    </section>
  );
}
