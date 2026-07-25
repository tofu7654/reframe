import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import type { Recommendation, RecommendationPlanner } from "./planner";
import { createVerifiedPlanner, type GeminiRecommendationPlanner } from "./verifiedPlanner";

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
      index: 0,
    },
  ],
};

const input = {
  summary: {
    counts: {
      job_search_performed: 0,
      job_saved: 3,
      job_application_submitted: 0,
      jobs_route_visited: 0,
      post_published: 0,
      post_engagement_received: 0,
      recommendation_shown: 0,
      recommendation_accepted: 0,
      recommendation_dismissed: 0,
      manifest_applied: 0,
      manifest_reverted: 0,
      manifest_restored: 0,
    },
    latestTargetIds: {},
  },
  manifest: DEFAULT_MANIFEST,
  suppressedRecommendationIds: [],
};

function rulesPlanner(recommendation: Recommendation | null): RecommendationPlanner {
  return { plan: () => recommendation };
}

function geminiPlanner(
  result: Awaited<ReturnType<GeminiRecommendationPlanner["plan"]>>,
): GeminiRecommendationPlanner {
  return { plan: async () => result };
}

describe("createVerifiedPlanner", () => {
  it("uses Gemini only when its full recommendation exactly matches the rules result", async () => {
    const planner = createVerifiedPlanner(
      geminiPlanner({
        status: "ok",
        recommendation: structuredClone(savedJobsRecommendation),
        model: "gemini-test",
        promptVersion: "rules-v1",
      }),
      rulesPlanner(savedJobsRecommendation),
    );

    await expect(planner.plan(input)).resolves.toMatchObject({
      finalRecommendation: savedJobsRecommendation,
      geminiRecommendation: savedJobsRecommendation,
      deterministicRecommendation: savedJobsRecommendation,
      exactMatch: true,
      selectedSource: "gemini",
      fallbackReason: null,
    });
  });

  it("falls back to rules when Gemini changes recommendation text", async () => {
    const planner = createVerifiedPlanner(
      geminiPlanner({
        status: "ok",
        recommendation: { ...savedJobsRecommendation, title: "Saved jobs for you" },
        model: "gemini-test",
        promptVersion: "rules-v1",
      }),
      rulesPlanner(savedJobsRecommendation),
    );

    await expect(planner.plan(input)).resolves.toMatchObject({
      finalRecommendation: savedJobsRecommendation,
      exactMatch: false,
      selectedSource: "rules",
      fallbackReason: "mismatch",
    });
  });

  it("falls back to rules when Gemini changes the manifest operation", async () => {
    const planner = createVerifiedPlanner(
      geminiPlanner({
        status: "ok",
        recommendation: {
          ...savedJobsRecommendation,
          operations: [
            {
              type: "add_module",
              slot: "homeLeftRail",
              componentId: "savedJobs",
              index: 0,
            },
          ],
        },
        model: "gemini-test",
        promptVersion: "rules-v3",
      }),
      rulesPlanner(savedJobsRecommendation),
    );

    await expect(planner.plan(input)).resolves.toMatchObject({
      finalRecommendation: savedJobsRecommendation,
      exactMatch: false,
      selectedSource: "rules",
      fallbackReason: "mismatch",
    });
  });

  it("falls back to rules when Gemini is unavailable", async () => {
    const planner = createVerifiedPlanner(
      geminiPlanner({
        status: "fallback",
        reason: "missing_api_key",
        model: "gemini-3.5-flash-lite",
        promptVersion: "rules-v1",
      }),
      rulesPlanner(savedJobsRecommendation),
    );

    await expect(planner.plan(input)).resolves.toMatchObject({
      finalRecommendation: savedJobsRecommendation,
      geminiRecommendation: null,
      exactMatch: false,
      selectedSource: "rules",
      fallbackReason: "missing_api_key",
    });
  });

  it("treats matching null results as an exact Gemini match", async () => {
    const planner = createVerifiedPlanner(
      geminiPlanner({
        status: "ok",
        recommendation: null,
        model: "gemini-test",
        promptVersion: "rules-v1",
      }),
      rulesPlanner(null),
    );

    await expect(planner.plan(input)).resolves.toMatchObject({
      finalRecommendation: null,
      exactMatch: true,
      selectedSource: "gemini",
      fallbackReason: null,
    });
  });
});
