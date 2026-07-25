import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { AnalyticsEventType } from "@/contracts/events";
import type { Recommendation } from "@/contracts/personalization";
import { deterministicPlanner } from "@/intelligence/deterministicPlanner";
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

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const [personalizationState, setPersonalizationState] = useState(
    createDefaultPersonalizationState,
  );
  const [activeRecommendation, setActiveRecommendation] = useState<Recommendation | null>(null);
  const stateRef = useRef(personalizationState);
  const activeRecommendationRef = useRef(activeRecommendation);
  const eventStoreRef = useRef<LocalEventStore | null>(null);
  const coordinatorRef = useRef<RecommendationCoordinator | null>(null);
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

  const trackEvent = useCallback(
    (type: AnalyticsEventType) => {
      const coordinator = coordinatorRef.current;
      if (!coordinator) return;
      const state = stateRef.current;
      const recommendation = coordinator.recordAndEvaluate(
        type,
        state.manifest,
        state.suppressedRecommendationIds,
      );
      showRecommendation(recommendation);
    },
    [showRecommendation],
  );

  const seedScenario = useCallback(
    (type: AnalyticsEventType, count: number) => {
      const coordinator = coordinatorRef.current;
      if (!coordinator) return;
      const state = stateRef.current;
      const recommendation = coordinator.seedAndEvaluate(
        type,
        count,
        state.manifest,
        state.suppressedRecommendationIds,
      );
      showRecommendation(recommendation);
    },
    [showRecommendation],
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
  }, []);

  useEffect(() => {
    const eventStore = new LocalEventStore(window.localStorage);
    eventStoreRef.current = eventStore;
    coordinatorRef.current = new RecommendationCoordinator(eventStore, deterministicPlanner);
    const storedState = loadPersonalizationState(window.localStorage);
    stateRef.current = storedState;
    setPersonalizationState(storedState);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/jobs")) return;
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
      {import.meta.env.DEV ? <DevelopmentPanel /> : null}
      <Toaster position="bottom-right" />
    </PersonalizationContext.Provider>
  );
}
