import type { RecommendationId } from "./personalization";

export type AnalyticsEventType =
  | "job_saved"
  | "job_application_submitted"
  | "jobs_route_visited"
  | "recommendation_shown"
  | "recommendation_accepted"
  | "recommendation_dismissed"
  | "manifest_applied"
  | "manifest_reverted"
  | "manifest_restored";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  occurredAt: string;
  recommendationId?: RecommendationId;
}

export interface EventSummary {
  counts: Record<AnalyticsEventType, number>;
}
