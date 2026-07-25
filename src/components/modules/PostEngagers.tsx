import { useEffect, useState } from "react";
import { Check, MessageCircle, Repeat2, ThumbsUp, UserPlus, Users } from "lucide-react";
import { POST_ENGAGERS, type PostEngager } from "@/lib/post-engagers-data";
import { LocalEventStore } from "@/tracking/eventStore";
import { usePreviewMode } from "@/personalization/PreviewModeContext";

const ENGAGEMENT_ICON = {
  Commented: MessageCircle,
  Reposted: Repeat2,
  Reacted: ThumbsUp,
} satisfies Record<PostEngager["engagement"], typeof MessageCircle>;

export function PostEngagers() {
  const [hasEngagement, setHasEngagement] = useState(false);
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const previewMode = usePreviewMode();

  useEffect(() => {
    if (previewMode) {
      setHasEngagement(true);
      return;
    }
    const events = new LocalEventStore(window.localStorage).read();
    setHasEngagement(events.some((event) => event.type === "post_engagement_received"));
  }, [previewMode]);

  if (!hasEngagement) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">People engaging with your post</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            These people joined your recent conversation. Connect if you would like to keep it
            going.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {POST_ENGAGERS.map((person) => {
          const isRequested = Boolean(requested[person.id]);
          const EngagementIcon = ENGAGEMENT_ICON[person.engagement];
          return (
            <li key={person.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold">
                  {person.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{person.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{person.headline}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <EngagementIcon className="h-3.5 w-3.5" />
                {person.engagement} · {person.mutualConnections} mutual
              </div>
              <button
                type="button"
                onClick={() =>
                  setRequested((current) => ({ ...current, [person.id]: !isRequested }))
                }
                aria-pressed={isRequested}
                className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1 rounded-full border border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                {isRequested ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                {isRequested ? "Requested" : "Connect"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
