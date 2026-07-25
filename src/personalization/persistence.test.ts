import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import type { Recommendation } from "@/contracts/personalization";
import {
  acceptRecommendation,
  createDefaultPersonalizationState,
  dismissRecommendation,
  loadPersonalizationState,
  restoreDefaultManifest,
  revertManifest,
  savePersonalizationState,
} from "./personalizationState";
import { LocalEventStore } from "@/tracking/eventStore";

class MemoryStorage implements Storage {
  readonly data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

const savedJobsRecommendation: Recommendation = {
  id: "saved-jobs",
  expectedManifestRevision: 0,
  title: "Add Saved Jobs",
  description: "Add Saved Jobs to your home page.",
  operations: [
    {
      type: "add_module",
      slot: "homeMain",
      componentId: "savedJobs",
    },
  ],
};

describe("personalization persistence", () => {
  it("falls back to defaults when the stored envelope is corrupt", () => {
    const storage = new MemoryStorage();
    storage.setItem("reframe.personalization", "{not-json");

    expect(loadPersonalizationState(storage)).toEqual(createDefaultPersonalizationState());
  });

  it("falls back to defaults for an obsolete storage envelope", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "reframe.personalization",
      JSON.stringify({
        schemaVersion: 99,
        state: createDefaultPersonalizationState(),
      }),
    );

    expect(loadPersonalizationState(storage)).toEqual(createDefaultPersonalizationState());
  });

  it("round trips a valid versioned state", () => {
    const storage = new MemoryStorage();
    const state = dismissRecommendation(createDefaultPersonalizationState(), "saved-jobs");

    savePersonalizationState(storage, state);

    expect(loadPersonalizationState(storage)).toEqual(state);
  });

  it("moves an accepted legacy company-connections module to the Jobs slot", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "reframe.personalization",
      JSON.stringify({
        schemaVersion: 1,
        state: {
          manifest: {
            schemaVersion: 1,
            revision: 1,
            navigation: DEFAULT_MANIFEST.navigation,
            slots: {
              homeMain: ["appliedCompanyConnections", "feed"],
              homeRightRail: ["rightSidebar"],
            },
          },
          history: [],
          suppressedRecommendationIds: ["applied-company-connections"],
        },
      }),
    );

    const state = loadPersonalizationState(storage);

    expect(state.manifest.slots.homeMain).toEqual(["feed"]);
    expect(state.manifest.slots.jobsMain).toEqual(["appliedCompanyConnections"]);
    expect(state.suppressedRecommendationIds).toEqual(["applied-company-connections"]);
  });

  it("moves an accepted legacy application tracker from Home to Jobs", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "reframe.personalization",
      JSON.stringify({
        schemaVersion: 1,
        state: {
          manifest: {
            schemaVersion: 2,
            revision: 2,
            navigation: DEFAULT_MANIFEST.navigation,
            slots: {
              homeMain: ["feed"],
              homeRightRail: ["applicationTracker", "rightSidebar"],
              jobsMain: ["appliedCompanyConnections"],
            },
          },
          history: [],
          suppressedRecommendationIds: ["application-tracker", "applied-company-connections"],
        },
      }),
    );

    const state = loadPersonalizationState(storage);

    expect(state.manifest.slots.homeRightRail).toEqual(["rightSidebar"]);
    expect(state.manifest.slots.jobsMain).toEqual([
      "applicationTracker",
      "appliedCompanyConnections",
    ]);
  });

  it("accepts a recommendation and saves the previous manifest", () => {
    const result = acceptRecommendation(
      createDefaultPersonalizationState(),
      savedJobsRecommendation,
    );

    expect(result.ok).toBe(true);
    expect(result.state.manifest.slots.homeMain).toContain("savedJobs");
    expect(result.state.history).toEqual([DEFAULT_MANIFEST]);
  });

  it("rejects a stale recommendation without changing state", () => {
    const state = {
      ...createDefaultPersonalizationState(),
      manifest: { ...DEFAULT_MANIFEST, revision: 2 },
    };

    const result = acceptRecommendation(state, savedJobsRecommendation);

    expect(result.ok).toBe(false);
    expect(result.state).toBe(state);
  });

  it("reverts one snapshot while keeping revisions monotonic", () => {
    const accepted = acceptRecommendation(
      createDefaultPersonalizationState(),
      savedJobsRecommendation,
    );

    const reverted = revertManifest(accepted.state);

    expect(reverted.manifest.slots.homeMain).toEqual(["feed"]);
    expect(reverted.manifest.revision).toBe(2);
    expect(reverted.history).toEqual([]);
  });

  it("restores defaults and clears history and suppression", () => {
    const accepted = acceptRecommendation(
      createDefaultPersonalizationState(),
      savedJobsRecommendation,
    );

    const restored = restoreDefaultManifest(accepted.state);

    expect(restored.manifest.slots).toEqual(DEFAULT_MANIFEST.slots);
    expect(restored.manifest.revision).toBe(2);
    expect(restored.history).toEqual([]);
    expect(restored.suppressedRecommendationIds).toEqual([]);
  });
});

describe("LocalEventStore", () => {
  it("loads no events when the stored envelope is invalid", () => {
    const storage = new MemoryStorage();
    storage.setItem("reframe.events", JSON.stringify({ schemaVersion: 99, events: [] }));

    expect(new LocalEventStore(storage).read()).toEqual([]);
  });

  it("retains only the configured event history limit", () => {
    const storage = new MemoryStorage();
    const store = new LocalEventStore(storage, 2);

    store.append({ id: "1", type: "job_saved", occurredAt: "2026-01-01T00:00:00.000Z" });
    store.append({ id: "2", type: "job_saved", occurredAt: "2026-01-02T00:00:00.000Z" });
    store.append({ id: "3", type: "job_saved", occurredAt: "2026-01-03T00:00:00.000Z" });

    expect(store.read().map((event) => event.id)).toEqual(["2", "3"]);
  });
});
