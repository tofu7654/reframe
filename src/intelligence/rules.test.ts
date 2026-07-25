import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { summarizeEvents } from "@/tracking/summarizeEvents";
import { deterministicPlanner } from "./deterministicPlanner";
import type { AnalyticsEvent } from "@/contracts/events";

function events(type: AnalyticsEvent["type"], count: number): AnalyticsEvent[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${type}-${index}`,
    type,
    occurredAt: new Date(index).toISOString(),
  }));
}

describe("deterministicPlanner", () => {
  it("prioritizes an application tracker recommendation", () => {
    const summary = summarizeEvents([
      ...events("job_saved", 3),
      ...events("job_application_submitted", 1),
      ...events("jobs_route_visited", 3),
    ]);

    const recommendation = deterministicPlanner.plan({
      summary,
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation?.id).toBe("application-tracker");
    expect(recommendation?.expectedManifestRevision).toBe(0);
  });

  it("recommends saved jobs after three saves", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_saved", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["application-tracker"],
    });

    expect(recommendation?.id).toBe("saved-jobs");
  });

  it("recommends promoting Jobs after three route visits", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("jobs_route_visited", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["application-tracker", "saved-jobs"],
    });

    expect(recommendation?.id).toBe("promote-jobs");
  });

  it("does not return a suppressed recommendation", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_saved", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["saved-jobs"],
    });

    expect(recommendation).toBeNull();
  });
});
