import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { applyRecommendation } from "./manifestCore";
import type { Recommendation } from "@/contracts/personalization";

describe("applyRecommendation", () => {
  it("adds an approved module atomically", () => {
    const recommendation: Recommendation = {
      id: "application-tracker",
      expectedManifestRevision: 0,
      title: "Add Application Tracker",
      description: "Add Application Tracker to your home page.",
      operations: [
        {
          type: "add_module",
          slot: "homeRightRail",
          componentId: "applicationTracker",
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest.slots.homeRightRail).toContain("applicationTracker");
    expect(result.manifest.revision).toBe(1);
  });

  it("moves Jobs immediately after Home", () => {
    const recommendation: Recommendation = {
      id: "promote-jobs",
      expectedManifestRevision: 0,
      title: "Move Jobs next to Home",
      description: "Move Jobs next to Home in your navigation.",
      operations: [
        {
          type: "move_nav",
          navItemId: "jobs",
          afterNavItemId: "home",
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest.navigation.slice(0, 2)).toEqual(["home", "jobs"]);
  });

  it("rejects operations that violate the component catalog", () => {
    const recommendation = {
      id: "saved-jobs",
      expectedManifestRevision: 0,
      title: "Invalid recommendation",
      description: "Invalid recommendation",
      operations: [
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "applicationTracker",
        },
      ],
    } as Recommendation;

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result).toEqual({
      ok: false,
      manifest: DEFAULT_MANIFEST,
      reason: "invalid_operation",
    });
  });

  it("rejects invalid operation parameters before mutation", () => {
    const recommendation: Recommendation = {
      id: "saved-jobs",
      expectedManifestRevision: 0,
      title: "Invalid recommendation",
      description: "Invalid recommendation",
      operations: [
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "savedJobs",
          index: -1,
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result).toEqual({
      ok: false,
      manifest: DEFAULT_MANIFEST,
      reason: "invalid_operation",
    });
  });
});
