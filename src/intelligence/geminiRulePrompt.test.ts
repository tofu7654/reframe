import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { DETERMINISTIC_RULE_PRIORITY } from "./deterministicPlanner";
import {
  buildGeminiRulePrompt,
  GEMINI_PROMPT_RULE_IDS,
  GEMINI_RULE_PROMPT_VERSION,
} from "./geminiRulePrompt";

const input = {
  summary: {
    counts: {
      job_search_performed: 0,
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

    expect(GEMINI_RULE_PROMPT_VERSION).toBe("rules-v5");
    expect(prompt).toContain("counts.job_search_performed is at least");
    expect(prompt).toContain("creator-relationship-hub");
    expect(prompt).toContain("application-momentum");
    expect(prompt).toContain("job-search-command-center");
    expect(prompt).toContain('"type":"apply_manifest"');
    expect(prompt).toContain("Approved preset manifests");
    expect(prompt).toContain("post-engagers");
    expect(prompt).toContain("applied-company-connections");
    expect(prompt).toContain("application-tracker");
    expect(prompt).toContain("saved-jobs");
    expect(prompt).toContain("promote-jobs");
    expect(prompt).toContain("Stripe");
    expect(prompt).toContain("priority order");
    expect(prompt).toContain("Add Saved Jobs");
    expect(prompt).toContain("homeLeftRail does not include savedJobs");
    expect(prompt).toContain("jobsMain");
    expect(prompt).toContain(JSON.stringify(input.summary));
    expect(prompt).toContain(JSON.stringify(DEFAULT_MANIFEST));
  });

  it("keeps the prompted rule inventory and priority aligned with deterministic rules", () => {
    expect(GEMINI_PROMPT_RULE_IDS).toEqual(DETERMINISTIC_RULE_PRIORITY);

    const prompt = buildGeminiRulePrompt(input);
    for (const [index, ruleId] of DETERMINISTIC_RULE_PRIORITY.entries()) {
      expect(prompt).toContain(`${index + 1}. ${ruleId}:`);
    }
  });
});
