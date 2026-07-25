import {
  MANIFEST_SCHEMA_VERSION,
  type Recommendation,
  type RecommendationId,
  type UIManifest,
} from "@/contracts/personalization";
import { DEFAULT_MANIFEST, isValidManifest } from "@/registry/catalog";
import { applyRecommendation } from "./manifestCore";

const STORAGE_KEY = "reframe.personalization";
const STORAGE_SCHEMA_VERSION = 1;
const HISTORY_LIMIT = 10;
const RECOMMENDATION_IDS: RecommendationId[] = [
  "post-engagers",
  "applied-company-connections",
  "application-tracker",
  "saved-jobs",
  "promote-jobs",
];

export interface PersonalizationState {
  manifest: UIManifest;
  history: UIManifest[];
  suppressedRecommendationIds: RecommendationId[];
}

interface PersonalizationEnvelope {
  schemaVersion: typeof STORAGE_SCHEMA_VERSION;
  state: PersonalizationState;
}

export type AcceptRecommendationResult =
  | { ok: true; state: PersonalizationState }
  | {
      ok: false;
      state: PersonalizationState;
      reason: "stale_manifest" | "invalid_operation";
    };

export function createDefaultPersonalizationState(): PersonalizationState {
  return {
    manifest: structuredClone(DEFAULT_MANIFEST),
    history: [],
    suppressedRecommendationIds: [],
  };
}

export function loadPersonalizationState(storage: Storage): PersonalizationState {
  try {
    const rawValue = storage.getItem(STORAGE_KEY);
    if (!rawValue) return createDefaultPersonalizationState();
    const envelope = migrateLegacyManifestSlots(JSON.parse(rawValue) as unknown);
    return isValidEnvelope(envelope)
      ? structuredClone(envelope.state)
      : createDefaultPersonalizationState();
  } catch {
    return createDefaultPersonalizationState();
  }
}

export function savePersonalizationState(storage: Storage, state: PersonalizationState): void {
  const envelope: PersonalizationEnvelope = {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    state,
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

export function clearPersonalizationState(storage: Storage): void {
  storage.removeItem(STORAGE_KEY);
}

export function acceptRecommendation(
  state: PersonalizationState,
  recommendation: Recommendation,
): AcceptRecommendationResult {
  const result = applyRecommendation(state.manifest, recommendation);
  if (!result.ok) {
    return { ok: false, state, reason: result.reason };
  }

  return {
    ok: true,
    state: {
      manifest: result.manifest,
      history: [...state.history, structuredClone(state.manifest)].slice(-HISTORY_LIMIT),
      suppressedRecommendationIds: addSuppressed(
        state.suppressedRecommendationIds,
        recommendation.id,
      ),
    },
  };
}

export function dismissRecommendation(
  state: PersonalizationState,
  recommendationId: RecommendationId,
): PersonalizationState {
  return {
    ...state,
    suppressedRecommendationIds: addSuppressed(state.suppressedRecommendationIds, recommendationId),
  };
}

export function revertManifest(state: PersonalizationState): PersonalizationState {
  const previousManifest = state.history.at(-1);
  if (!previousManifest) return state;

  return {
    ...state,
    manifest: {
      ...structuredClone(previousManifest),
      revision: state.manifest.revision + 1,
    },
    history: state.history.slice(0, -1),
  };
}

export function restoreDefaultManifest(state: PersonalizationState): PersonalizationState {
  return {
    manifest: {
      ...structuredClone(DEFAULT_MANIFEST),
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      revision: state.manifest.revision + 1,
    },
    history: [],
    suppressedRecommendationIds: [],
  };
}

function addSuppressed(
  recommendationIds: readonly RecommendationId[],
  recommendationId: RecommendationId,
): RecommendationId[] {
  return [...new Set([...recommendationIds, recommendationId])];
}

function isValidEnvelope(value: unknown): value is PersonalizationEnvelope {
  if (!isRecord(value) || value.schemaVersion !== STORAGE_SCHEMA_VERSION) return false;
  if (!isRecord(value.state)) return false;

  const state = value.state;
  if (!isValidManifest(state.manifest)) return false;
  if (
    !Array.isArray(state.history) ||
    state.history.length > HISTORY_LIMIT ||
    !state.history.every(isValidManifest)
  ) {
    return false;
  }
  if (
    !Array.isArray(state.suppressedRecommendationIds) ||
    !state.suppressedRecommendationIds.every(
      (id) => typeof id === "string" && RECOMMENDATION_IDS.includes(id as RecommendationId),
    )
  ) {
    return false;
  }

  return true;
}

function migrateLegacyManifestSlots(value: unknown): unknown {
  if (
    !isRecord(value) ||
    value.schemaVersion !== STORAGE_SCHEMA_VERSION ||
    !isRecord(value.state)
  ) {
    return value;
  }

  const state = value.state;
  if (!Array.isArray(state.history)) return value;

  return {
    ...value,
    state: {
      ...state,
      manifest: migrateLegacyManifest(state.manifest),
      history: state.history.map(migrateLegacyManifest),
    },
  };
}

function migrateLegacyManifest(value: unknown): unknown {
  if (
    !isRecord(value) ||
    (value.schemaVersion !== 1 && value.schemaVersion !== 2) ||
    !isRecord(value.slots) ||
    !Array.isArray(value.slots.homeMain) ||
    !Array.isArray(value.slots.homeRightRail)
  ) {
    return value;
  }

  const appliedCompanyConnections = value.slots.homeMain.includes("appliedCompanyConnections");
  const applicationTracker = value.slots.homeRightRail.includes("applicationTracker");
  const existingJobsMain = Array.isArray(value.slots.jobsMain) ? value.slots.jobsMain : [];
  const jobsMain = [
    ...(applicationTracker ? ["applicationTracker"] : []),
    ...existingJobsMain.filter((componentId) => componentId !== "applicationTracker"),
  ];
  if (appliedCompanyConnections && !jobsMain.includes("appliedCompanyConnections")) {
    jobsMain.push("appliedCompanyConnections");
  }

  return {
    ...value,
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    slots: {
      ...value.slots,
      homeMain: value.slots.homeMain.filter(
        (componentId) => componentId !== "appliedCompanyConnections",
      ),
      homeRightRail: value.slots.homeRightRail.filter(
        (componentId) => componentId !== "applicationTracker",
      ),
      jobsMain,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
