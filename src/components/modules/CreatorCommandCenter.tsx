import { useEffect, useState } from "react";
import { BarChart3, MessageCircle, PenLine, TrendingUp } from "lucide-react";
import { LocalEventStore } from "@/tracking/eventStore";

export function CreatorCommandCenter() {
  const [publishedPosts, setPublishedPosts] = useState(0);
  const [repliesRemaining, setRepliesRemaining] = useState(4);

  useEffect(() => {
    const events = new LocalEventStore(window.localStorage).read();
    setPublishedPosts(events.filter((event) => event.type === "post_published").length);
  }, []);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <PenLine className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-wide">Creator command center</p>
          </div>
          <h2 className="mt-2 text-lg font-semibold">Your content is building momentum</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Focus on the conversations and publishing actions most likely to grow your audience.
          </p>
        </div>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
          Reach up 12%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric
          icon={BarChart3}
          value={String(Math.max(publishedPosts, 1))}
          label="Posts this week"
        />
        <Metric icon={TrendingUp} value="2.4k" label="People reached" />
        <Metric icon={MessageCircle} value={String(repliesRemaining)} label="Replies due" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/5 p-3">
        <div>
          <p className="text-sm font-semibold">Keep the conversation moving</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Replying to recent comments now can extend the life of your latest post.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRepliesRemaining((count) => Math.max(count - 1, 0))}
          disabled={repliesRemaining === 0}
          className="h-8 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          {repliesRemaining > 0 ? "Reply to next comment" : "Replies cleared"}
        </button>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BarChart3;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
