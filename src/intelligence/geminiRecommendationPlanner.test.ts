import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { createGeminiRecommendationPlanner } from "./geminiRecommendationPlanner";

const input = {
  summary: {
    counts: {
      job_search_performed: 0,
      job_saved: 3,
      job_application_started: 0,
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
    unfinishedApplicationTargetIds: [],
  },
  manifest: DEFAULT_MANIFEST,
  suppressedRecommendationIds: [],
};

const savedJobsJson = JSON.stringify({
  id: "saved-jobs",
  expectedManifestRevision: 0,
  title: "Add Saved Jobs",
  description: "Add Saved Jobs to your home page.",
  operations: [{ type: "add_module", slot: "homeMain", componentId: "savedJobs", index: 0 }],
});

describe("createGeminiRecommendationPlanner", () => {
  it("returns missing_api_key without creating a Gemini request", async () => {
    const planner = createGeminiRecommendationPlanner({ apiKey: "" });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "missing_api_key",
      model: "gemini-3.5-flash-lite",
    });
  });

  it("returns a runtime-validated structured recommendation", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () => savedJobsJson,
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "ok",
      recommendation: {
        id: "saved-jobs",
        title: "Add Saved Jobs",
      },
    });
  });

  it("accepts operations from the complete approved manifest slot catalog", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () =>
        JSON.stringify({
          ...JSON.parse(savedJobsJson),
          operations: [
            {
              type: "add_module",
              slot: "homeLeftRail",
              componentId: "savedJobs",
              index: 0,
            },
          ],
        }),
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "ok",
      recommendation: {
        operations: [
          {
            type: "add_module",
            slot: "homeLeftRail",
            componentId: "savedJobs",
          },
        ],
      },
    });
  });

  it("accepts a constrained approved-manifest recommendation", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () =>
        JSON.stringify({
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
        }),
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "ok",
      recommendation: {
        id: "job-search-command-center",
        operations: [
          {
            type: "apply_manifest",
            manifestId: "job-search-command-center",
          },
        ],
      },
    });
  });

  it("falls back when Gemini returns malformed JSON", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () => "not json",
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "invalid_json",
    });
  });

  it("falls back when Gemini returns an invalid recommendation shape", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () => JSON.stringify({ id: "saved-jobs" }),
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "invalid_response",
    });
  });

  it("rejects extra operation fields instead of normalizing them before comparison", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () =>
        JSON.stringify({
          ...JSON.parse(savedJobsJson),
          operations: [
            {
              type: "add_module",
              slot: "homeMain",
              componentId: "savedJobs",
              index: 0,
              unexpected: true,
            },
          ],
        }),
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "invalid_response",
    });
  });

  it("falls back when the Gemini request fails", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      request: async () => {
        throw new Error("network down");
      },
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "provider_error",
    });
  });

  it("falls back after the configured timeout", async () => {
    const planner = createGeminiRecommendationPlanner({
      apiKey: "demo-key",
      timeoutMs: 1,
      request: ({ signal }) =>
        new Promise((_, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    });

    await expect(planner.plan(input)).resolves.toMatchObject({
      status: "fallback",
      reason: "timeout",
    });
  });
});
