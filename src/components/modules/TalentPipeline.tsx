import { useState } from "react";
import { Check, Clock3, MessageSquare, Rows3 } from "lucide-react";

const PIPELINE = [
  { label: "To review", count: 8, color: "bg-sky-500" },
  { label: "Contacted", count: 5, color: "bg-violet-500" },
  { label: "In conversation", count: 3, color: "bg-green-500" },
] as const;

export function TalentPipeline() {
  const [followUpDone, setFollowUpDone] = useState(false);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Rows3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Talent Pipeline</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep promising people moving from research to conversation.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {PIPELINE.map((stage) => (
          <div key={stage.label} className="rounded-lg border border-border p-3">
            <div className={`h-1.5 w-8 rounded-full ${stage.color}`} />
            <p className="mt-3 text-xl font-semibold">{stage.count}</p>
            <p className="text-xs text-muted-foreground">{stage.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-3">
        <Clock3 className="h-4 w-4 shrink-0 text-amber-700" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Follow up with Jordan Brooks</p>
          <p className="text-xs text-muted-foreground">
            You reviewed this candidate twice and sent a message 3 days ago.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFollowUpDone((done) => !done)}
          aria-pressed={followUpDone}
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-primary px-3 text-xs font-semibold text-primary"
        >
          {followUpDone ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <MessageSquare className="h-3.5 w-3.5" />
          )}
          {followUpDone ? "Done" : "Follow up"}
        </button>
      </div>
    </section>
  );
}
