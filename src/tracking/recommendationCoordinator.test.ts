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
