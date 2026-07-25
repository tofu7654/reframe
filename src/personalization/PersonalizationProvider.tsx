import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { AnalyticsEventType } from "@/contracts/events";
import type { Recommendation } from "@/contracts/personalization";
import { deterministicPlanner } from "@/intelligence/deterministicPlanner";
import { createGeminiRecommendationPlanner } from "@/intelligence/geminiRecommendationPlanner";
import { createLatestPlanRunner } from "@/intelligence/latestPlanRunner";
import { createVerifiedPlanner, type VerifiedPlanResult } from "@/intelligence/verifiedPlanner";
import { LocalEventStore } from "@/tracking/eventStore";
import { RecommendationCoordinator } from "@/tracking/recommendationCoordinator";
import {
  acceptRecommendation,
  clearPersonalizationState,
  createDefaultPersonalizationState,
  dismissRecommendation,
  loadPersonalizationState,
  restoreDefaultManifest,
  revertManifest,
  savePersonalizationState,
  type PersonalizationState,
} from "./personalizationState";
import { PersonalizationContext, type PersonalizationContextValue } from "./PersonalizationContext";
import { RecommendationOverlay } from "@/components/recommendations/RecommendationOverlay";
import { DevelopmentPanel } from "@/components/development/DevelopmentPanel";
import { Toaster } from "@/components/ui/sonner";

const verifiedPlanner = createVerifiedPlanner(
  createGeminiRecommendationPlanner({
    apiKey: import.meta.env.GEMINI_API_KEY,
    model: import.meta.env.VITE_GEMINI_MODEL,
  }),
  deterministicPlanner,
);

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const [personalizationState, setPersonalizationState] = useState(
    createDefaultPersonalizationState,
  );
  const [activeRecommendation, setActiveRecommendation] = useState<Recommendation | null>(null);
  const [isPlanningRecommendation, setIsPlanningRecommendation] = useState(false);
  const [latestPlannerComparison, setLatestPlannerComparison] = useState<VerifiedPlanResult | null>(
    null,
  );
  const stateRef = useRef(personalizationState);
  const activeRecommendationRef = useRef(activeRecommendation);
  const eventStoreRef = useRef<LocalEventStore | null>(null);
  const coordinatorRef = useRef<RecommendationCoordinator | null>(null);
  const latestPlanRunnerRef = useRef(createLatestPlanRunner());
  const pendingEventsRef = useRef<Array<{ type: AnalyticsEventType; targetId?: string }>>([]);
  const lastTrackedJobsPathRef = useRef<string | null>(null);

  const updateState = useCallback((nextState: PersonalizationState) => {
    stateRef.current = nextState;
    setPersonalizationState(nextState);
    try {
      savePersonalizationState(window.localStorage, nextState);
    } catch {
      // The in-memory state remains usable when browser storage is unavailable.
    }
  }, []);

  const showRecommendation = useCallback((recommendation: Recommendation | null) => {
    if (!recommendation || activeRecommendationRef.current) return;
    activeRecommendationRef.current = recommendation;
    setActiveRecommendation(recommendation);
    coordinatorRef.current?.record("recommendation_shown", recommendation.id);
  }, []);

  const evaluateRecommendation = useCallback(() => {
    const coordinator = coordinatorRef.current;
    if (!coordinator) return;
    const state = stateRef.current;
    setIsPlanningRecommendation(true);
    void latestPlanRunnerRef.current
      .run(() =>
        verifiedPlanner.plan(
          coordinator.getPlannerInput(state.manifest, state.suppressedRecommendationIds),
        ),
      )
      .then(({ value, isLatest }) => {
        if (!isLatest) return;
        setIsPlanningRecommendation(false);
        setLatestPlannerComparison(value);
        showRecommendation(value.finalRecommendation);
      })
      .catch(() => {
        setIsPlanningRecommendation(false);
      });
  }, [showRecommendation]);

  const recordEvent = useCallback((type: AnalyticsEventType, targetId?: string) => {
    const coordinator = coordinatorRef.current;
    if (coordinator) {
      coordinator.record(type, undefined, targetId);
      return;
    }
    pendingEventsRef.current.push({ type, ...(targetId ? { targetId } : {}) });
  }, []);

  const trackEvent = useCallback(
    (type: AnalyticsEventType, targetId?: string) => {
      const coordinator = coordinatorRef.current;
      if (!coordinator) return;
      coordinator.record(type, undefined, targetId);
      evaluateRecommendation();
    },
    [evaluateRecommendation],
  );

  const seedScenario = useCallback(
    (type: AnalyticsEventType, count: number, targetId?: string) => {
      const coordinator = coordinatorRef.current;
      if (!coordinator) return;
      for (let index = 0; index < count; index += 1) {
        coordinator.record(type, undefined, targetId);
      }
      evaluateRecommendation();
    },
    [evaluateRecommendation],
  );

  const acceptActiveRecommendation = useCallback(() => {
    const recommendation = activeRecommendationRef.current;
    if (!recommendation) return false;
    const result = acceptRecommendation(stateRef.current, recommendation);
    activeRecommendationRef.current = null;
    setActiveRecommendation(null);
    if (!result.ok) return false;

    updateState(result.state);
    coordinatorRef.current?.record("recommendation_accepted", recommendation.id);
    coordinatorRef.current?.record("manifest_applied", recommendation.id);
    return true;
  }, [updateState]);

  const dismissActiveRecommendation = useCallback(() => {
    const recommendation = activeRecommendationRef.current;
    if (!recommendation) return;
    updateState(dismissRecommendation(stateRef.current, recommendation.id));
    coordinatorRef.current?.record("recommendation_dismissed", recommendation.id);
    activeRecommendationRef.current = null;
    setActiveRecommendation(null);
  }, [updateState]);

  const revert = useCallback(() => {
    const nextState = revertManifest(stateRef.current);
    if (nextState === stateRef.current) return;
    updateState(nextState);
    coordinatorRef.current?.record("manifest_reverted");
  }, [updateState]);

  const restoreDefaults = useCallback(() => {
    updateState(restoreDefaultManifest(stateRef.current));
    coordinatorRef.current?.record("manifest_restored");
    activeRecommendationRef.current = null;
    setActiveRecommendation(null);
  }, [updateState]);

  const resetAll = useCallback(() => {
    latestPlanRunnerRef.current.invalidate();
    pendingEventsRef.current = [];
    eventStoreRef.current?.clear();
    try {
      clearPersonalizationState(window.localStorage);
    } catch {
      // Reset the in-memory state even if browser storage is unavailable.
    }
    const defaultState = createDefaultPersonalizationState();
    stateRef.current = defaultState;
    setPersonalizationState(defaultState);
    activeRecommendationRef.current = null;
    setActiveRecommendation(null);
    setIsPlanningRecommendation(false);
    setLatestPlannerComparison(null);
  }, []);

  useEffect(() => {
    const eventStore = new LocalEventStore(window.localStorage);
    eventStoreRef.current = eventStore;
    coordinatorRef.current = new RecommendationCoordinator(eventStore, deterministicPlanner);
    for (const event of pendingEventsRef.current) {
      coordinatorRef.current.record(event.type, undefined, event.targetId);
    }
    pendingEventsRef.current = [];
    const storedState = loadPersonalizationState(window.localStorage);
    stateRef.current = storedState;
    setPersonalizationState(storedState);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/jobs")) return;
    if (pathname.endsWith("/apply")) return;
    if (lastTrackedJobsPathRef.current === pathname) return;
    lastTrackedJobsPathRef.current = pathname;
    trackEvent("jobs_route_visited");
  }, [pathname, trackEvent]);

  const contextValue = useMemo<PersonalizationContextValue>(
    () => ({
      manifest: personalizationState.manifest,
      activeRecommendation,
      suppressedRecommendationIds: personalizationState.suppressedRecommendationIds,
      canRevert: personalizationState.history.length > 0,
      isPlanningRecommendation,
      latestPlannerComparison,
      recordEvent,
      trackEvent,
      seedScenario,
      acceptActiveRecommendation,
      dismissActiveRecommendation,
      revert,
      restoreDefaults,
      resetAll,
    }),
    [
      personalizationState,
      activeRecommendation,
      isPlanningRecommendation,
      latestPlannerComparison,
      recordEvent,
      trackEvent,
      seedScenario,
      acceptActiveRecommendation,
      dismissActiveRecommendation,
      revert,
      restoreDefaults,
      resetAll,
    ],
  );

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
      <RecommendationOverlay />
      <DevelopmentPanel />
      <Toaster position="bottom-right" />
    </PersonalizationContext.Provider>
  );
}
