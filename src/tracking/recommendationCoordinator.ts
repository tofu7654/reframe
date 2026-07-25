import type { AnalyticsEvent, AnalyticsEventType } from "@/contracts/events";
import type { Recommendation, RecommendationId, UIManifest } from "@/contracts/personalization";
import type { RecommendationPlanner } from "@/intelligence/planner";
import { summarizeEvents } from "./summarizeEvents";
import type { EventStore } from "./eventStore";

interface CoordinatorRuntime {
  createId(): string;
  now(): string;
}

const DEFAULT_RUNTIME: CoordinatorRuntime = {
  createId: () =>
    globalThis.crypto?.randomUUID?.() ??
    `event-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  now: () => new Date().toISOString(),
};

export class RecommendationCoordinator {
  constructor(
    private readonly eventStore: EventStore,
    private readonly planner: RecommendationPlanner,
    private readonly runtime: CoordinatorRuntime = DEFAULT_RUNTIME,
  ) {}

  recordAndEvaluate(
    type: AnalyticsEventType,
    manifest: UIManifest,
    suppressedRecommendationIds: readonly RecommendationId[],
  ): Recommendation | null {
    this.record(type);
    return this.evaluate(manifest, suppressedRecommendationIds);
  }

  seedAndEvaluate(
    type: AnalyticsEventType,
    count: number,
    manifest: UIManifest,
    suppressedRecommendationIds: readonly RecommendationId[],
  ): Recommendation | null {
    for (let index = 0; index < count; index += 1) {
      this.record(type);
    }
    return this.evaluate(manifest, suppressedRecommendationIds);
  }

  record(type: AnalyticsEventType, recommendationId?: RecommendationId): AnalyticsEvent {
    const event: AnalyticsEvent = {
      id: this.runtime.createId(),
      type,
      occurredAt: this.runtime.now(),
      ...(recommendationId ? { recommendationId } : {}),
    };
    this.eventStore.append(event);
    return event;
  }

  evaluate(
    manifest: UIManifest,
    suppressedRecommendationIds: readonly RecommendationId[],
  ): Recommendation | null {
    return this.planner.plan({
      summary: summarizeEvents(this.eventStore.read()),
      manifest,
      suppressedRecommendationIds,
    });
  }
}
