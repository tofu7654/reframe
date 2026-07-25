import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { applyRecommendation } from "./manifestCore";
import type { Recommendation } from "@/contracts/personalization";

describe("applyRecommendation", () => {
  it("applies an approved complete manifest atomically", () => {
    const recommendation: Recommendation = {
      id: "job-search-command-center",
      expectedManifestRevision: 0,
      title: "Your Job Search Command Center",
      description: "Use the approved job-search workspace.",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "job-search-command-center",
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest).toMatchObject({
      revision: 1,
      navigation: ["home", "jobs", "network", "messaging", "notifications"],
      slots: {
        homeLeftRail: ["savedJobs"],
        homeMain: ["jobDiscoveryHub", "feed"],
        homeRightRail: ["rightSidebar"],
        jobsMain: ["applicationTracker"],
      },
    });
  });

  it("rejects mixing a complete manifest with incremental operations", () => {
    const recommendation: Recommendation = {
      id: "job-search-command-center",
      expectedManifestRevision: 0,
      title: "Invalid mixed recommendation",
      description: "Invalid mixed recommendation",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "job-search-command-center",
        },
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "savedJobs",
        },
      ],
    };

    expect(applyRecommendation(DEFAULT_MANIFEST, recommendation)).toEqual({
      ok: false,
      manifest: DEFAULT_MANIFEST,
      reason: "invalid_operation",
    });
  });

  it("rejects a complete manifest that does not match the recommendation", () => {
    const recommendation: Recommendation = {
      id: "application-momentum",
      expectedManifestRevision: 0,
      title: "Mismatched manifest",
      description: "Mismatched manifest",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "creator-relationship-hub",
        },
      ],
    };

    expect(applyRecommendation(DEFAULT_MANIFEST, recommendation)).toEqual({
      ok: false,
      manifest: DEFAULT_MANIFEST,
      reason: "invalid_operation",
    });
  });

  it("adds post engagers to the approved Home slot", () => {
    const recommendation: Recommendation = {
      id: "post-engagers",
      expectedManifestRevision: 0,
      title: "Connect with people engaging with your post",
      description: "Add recent public engagers to your home page.",
      operations: [
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "postEngagers",
          index: 0,
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest.slots.homeMain).toEqual(["postEngagers", "feed"]);
  });

  it("adds applied-company connections to the approved Jobs slot", () => {
    const recommendation: Recommendation = {
      id: "applied-company-connections",
      expectedManifestRevision: 0,
      title: "Meet people at Stripe",
      description: "Add relevant employees and mutual connections to your Jobs page.",
      operations: [
        {
          type: "add_module",
          slot: "jobsMain",
          componentId: "appliedCompanyConnections",
          index: 0,
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest.slots.jobsMain).toEqual(["appliedCompanyConnections"]);
    expect(result.manifest.slots.homeMain).toEqual(["feed"]);
  });

  it("adds the application tracker to the approved Jobs slot atomically", () => {
    const recommendation: Recommendation = {
      id: "application-tracker",
      expectedManifestRevision: 0,
      title: "Track your job applications",
      description: "Add Application Tracker to your Jobs page.",
      operations: [
        {
          type: "add_module",
          slot: "jobsMain",
          componentId: "applicationTracker",
        },
      ],
    };

    const result = applyRecommendation(DEFAULT_MANIFEST, recommendation);

    expect(result.ok).toBe(true);
    expect(result.manifest.slots.jobsMain).toContain("applicationTracker");
    expect(result.manifest.slots.homeRightRail).toEqual(["rightSidebar"]);
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
          slot: "homeRightRail",
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
