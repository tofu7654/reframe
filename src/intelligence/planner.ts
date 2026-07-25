import type { EventSummary } from "@/contracts/events";
import type { Recommendation, RecommendationId, UIManifest } from "@/contracts/personalization";

export interface PlannerInput {
  summary: EventSummary;
  manifest: UIManifest;
  suppressedRecommendationIds: readonly RecommendationId[];
}

export interface RecommendationPlanner {
  plan(input: PlannerInput): Recommendation | null;
}
