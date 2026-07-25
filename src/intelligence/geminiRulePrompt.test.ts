import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { buildGeminiRulePrompt, GEMINI_RULE_PROMPT_VERSION } from "./geminiRulePrompt";

const input = {
  summary: {
    counts: {
      job_saved: 0,
      job_application_started: 0,
      job_application_submitted: 1,
      jobs_route_visited: 3,
      post_published: 0,
      post_engagement_received: 0,
      recommendation_shown: 0,
      recommendation_accepted: 0,
      recommendation_dismissed: 0,
      manifest_applied: 0,
      manifest_reverted: 0,
      manifest_restored: 0,
    },
    latestTargetIds: { job_application_submitted: "platform-stripe" },
    unfinishedApplicationTargetIds: [],
  },
  manifest: DEFAULT_MANIFEST,
  suppressedRecommendationIds: [],
};

describe("buildGeminiRulePrompt", () => {
  it("includes all deterministic rule contracts and resolves dynamic job company context", () => {
    const prompt = buildGeminiRulePrompt(input);

    expect(GEMINI_RULE_PROMPT_VERSION).toBe("rules-v2");
    expect(prompt).toContain("post-engagers");
    expect(prompt).toContain("applied-company-connections");
    expect(prompt).toContain("application-tracker");
    expect(prompt).toContain("saved-jobs");
    expect(prompt).toContain("promote-jobs");
    expect(prompt).toContain("Stripe");
    expect(prompt).toContain("priority order");
    expect(prompt).toContain("Add Saved Jobs");
    expect(prompt).toContain("jobsMain");
    expect(prompt).toContain(JSON.stringify(input.summary));
    expect(prompt).toContain(JSON.stringify(DEFAULT_MANIFEST));
  });
});
