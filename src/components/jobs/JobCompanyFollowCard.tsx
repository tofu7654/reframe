import { Building2 } from "lucide-react";
import type { Job } from "@/lib/jobs-data";

export function JobCompanyFollowCard({ job }: { job: Job }) {
  return (
    <div className="mt-4 bg-card border border-border rounded-lg p-6 flex items-center gap-3">
      <Building2 className="h-8 w-8 text-muted-foreground" />
      <div className="flex-1">
        <div className="font-semibold">{job.company}</div>
        <div className="text-xs text-muted-foreground">Follow for updates on new roles</div>
      </div>
      <button className="h-8 px-4 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/10">
        Follow
      </button>
    </div>
  );
}
