import type { AnalyticsEvent, AnalyticsEventType, EventSummary } from "@/contracts/events";

const EVENT_TYPES: AnalyticsEventType[] = [
  "job_saved",
  "job_application_started",
  "job_application_submitted",
  "jobs_route_visited",
  "post_published",
  "post_engagement_received",
  "recommendation_shown",
  "recommendation_accepted",
  "recommendation_dismissed",
  "manifest_applied",
  "manifest_reverted",
  "manifest_restored",
];

export function summarizeEvents(events: readonly AnalyticsEvent[]): EventSummary {
  const counts = Object.fromEntries(EVENT_TYPES.map((type) => [type, 0])) as EventSummary["counts"];
  const latestTargetIds: EventSummary["latestTargetIds"] = {};
  const unfinishedApplicationTargetIds = new Set<string>();

  for (const event of events) {
    counts[event.type] += 1;
    if (event.targetId) latestTargetIds[event.type] = event.targetId;
    if (event.type === "job_application_started" && event.targetId) {
      unfinishedApplicationTargetIds.add(event.targetId);
    }
    if (event.type === "job_application_submitted" && event.targetId) {
      unfinishedApplicationTargetIds.delete(event.targetId);
    }
  }

  return {
    counts,
    latestTargetIds,
    unfinishedApplicationTargetIds: [...unfinishedApplicationTargetIds],
  };
}
