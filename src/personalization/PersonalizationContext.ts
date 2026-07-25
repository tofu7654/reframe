import { createContext, useContext } from "react";
import type { AnalyticsEventType } from "@/contracts/events";
import type { Recommendation, RecommendationId, UIManifest } from "@/contracts/personalization";

export interface PersonalizationContextValue {
  manifest: UIManifest;
  activeRecommendation: Recommendation | null;
  suppressedRecommendationIds: readonly RecommendationId[];
  canRevert: boolean;
  recordEvent(type: AnalyticsEventType, targetId?: string): void;
  trackEvent(type: AnalyticsEventType, targetId?: string): void;
  seedScenario(type: AnalyticsEventType, count: number, targetId?: string): void;
  acceptActiveRecommendation(): boolean;
  dismissActiveRecommendation(): void;
  revert(): void;
  restoreDefaults(): void;
  resetAll(): void;
}

export const PersonalizationContext = createContext<PersonalizationContextValue | null>(null);

export function usePersonalization(): PersonalizationContextValue {
  const value = useContext(PersonalizationContext);
  if (!value) {
    throw new Error("usePersonalization must be used within PersonalizationProvider");
  }
  return value;
}
