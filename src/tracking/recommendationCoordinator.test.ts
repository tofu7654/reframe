import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "@/contracts/events";
import { deterministicPlanner } from "@/intelligence/deterministicPlanner";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import type { EventStore } from "./eventStore";
import { RecommendationCoordinator } from "./recommendationCoordinator";

class MemoryEventStore implements EventStore {
  events: AnalyticsEvent[] = [];
  append(event: AnalyticsEvent) {
    this.events.push(event);
  }
  read() {
    return structuredClone(this.events);
  }
  clear() {
    this.events = [];
  }
}

describe("RecommendationCoordinator", () => {
  it("records one semantic event before evaluating rules", () => {
    const store = new MemoryEventStore();
    const coordinator = new RecommendationCoordinator(store, deterministicPlanner, {
      createId: () => "event-1",
      now: () => "2026-01-01T00:00:00.000Z",
    });

    coordinator.recordAndEvaluate("job_saved", DEFAULT_MANIFEST, []);

    expect(store.events).toEqual([
      {
        id: "event-1",
        type: "job_saved",
        occurredAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("preserves a minimal target ID for targeted recommendations", () => {
    const store = new MemoryEventStore();
    const coordinator = new RecommendationCoordinator(store, deterministicPlanner, {
      createId: () => "event-1",
      now: () => "2026-01-01T00:00:00.000Z",
    });

    const recommendation = coordinator.recordAndEvaluate(
      "job_application_submitted",
      DEFAULT_MANIFEST,
      [],
      "platform-stripe",
    );

    expect(store.events[0]?.targetId).toBe("platform-stripe");
    expect(recommendation?.id).toBe("applied-company-connections");
  });

  it("does not record events when evaluation is repeated", () => {
    const store = new MemoryEventStore();
    const coordinator = new RecommendationCoordinator(store, deterministicPlanner, {
      createId: () => "event-1",
      now: () => "2026-01-01T00:00:00.000Z",
    });

    coordinator.recordAndEvaluate("job_saved", DEFAULT_MANIFEST, []);
    coordinator.evaluate(DEFAULT_MANIFEST, []);
    coordinator.evaluate(DEFAULT_MANIFEST, []);

    expect(store.events).toHaveLength(1);
  });

  it("builds one stable planner input from the stored events", () => {
    const store = new MemoryEventStore();
    const coordinator = new RecommendationCoordinator(store, deterministicPlanner, {
      createId: () => "event-1",
      now: () => "2026-01-01T00:00:00.000Z",
    });

    coordinator.record("job_saved");

    expect(coordinator.getPlannerInput(DEFAULT_MANIFEST, ["application-tracker"])).toEqual({
      summary: {
        counts: {
          job_search_performed: 0,
          job_saved: 1,
          job_application_started: 0,
          job_application_submitted: 0,
          jobs_route_visited: 0,
          post_published: 0,
          post_engagement_received: 0,
          recommendation_shown: 0,
          recommendation_accepted: 0,
          recommendation_dismissed: 0,
          manifest_applied: 0,
          manifest_reverted: 0,
          manifest_restored: 0,
        },
        latestTargetIds: {},
        unfinishedApplicationTargetIds: [],
      },
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["application-tracker"],
    });
  });

  it("seeds a scenario and evaluates once after all events are stored", () => {
    const store = new MemoryEventStore();
    let eventId = 0;
    const coordinator = new RecommendationCoordinator(store, deterministicPlanner, {
      createId: () => `event-${++eventId}`,
      now: () => "2026-01-01T00:00:00.000Z",
    });

    const recommendation = coordinator.seedAndEvaluate("job_saved", 3, DEFAULT_MANIFEST, []);

    expect(store.events).toHaveLength(3);
    expect(recommendation?.id).toBe("saved-jobs");
  });
});
