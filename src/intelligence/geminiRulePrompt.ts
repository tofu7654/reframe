import { getJob } from "@/lib/jobs-data";
import type { PlannerInput } from "./planner";

// Keep this prompt byte-for-byte semantically aligned with deterministicPlanner:
// rule conditions, priority, exact recommendation fields, operations, and any
// manifest state produced by a rule must change together with the prompt version/tests.
export const GEMINI_RULE_PROMPT_VERSION = "rules-v1";

const RULE_CONTRACT = `
You reproduce the deterministic recommendation planner exactly. Return JSON only: either
null, or one complete recommendation object with id, expectedManifestRevision, title,
description, and operations. Do not improve wording, omit fields, add fields, or change
operation order. A recommendation is eligible only when it is not suppressed and its
target UI state is not already present.

Evaluate every rule, then return the first eligible recommendation in this priority order:
1. post-engagers: when latestTargetIds.post_engagement_received exists and homeMain does
   not include postEngagers. Return id post-engagers; title "Connect with people engaging
   with your post"; description "Your recent post received new engagement. Add the people
   joining that conversation to your home page."; operations [{"type":"add_module","slot":"homeMain","componentId":"postEngagers","index":0}].
2. applied-company-connections: when a resolved applied job exists and homeMain does not
   include appliedCompanyConnections. Return id applied-company-connections; title "Meet
   people at <company>"; description "You applied to <company>. Add relevant employees and
   mutual connections to your home page."; operations [{"type":"add_module","slot":"homeMain","componentId":"appliedCompanyConnections","index":0}].
3. application-tracker: when counts.job_application_submitted is at least 1 and
   homeRightRail does not include applicationTracker. Return id application-tracker; title
   "Add Application Tracker"; description "Add Application Tracker to your home page.";
   operations [{"type":"add_module","slot":"homeRightRail","componentId":"applicationTracker","index":0}].
4. saved-jobs: when counts.job_saved is at least 3 and homeMain does not include savedJobs.
   Return id saved-jobs; title "Add Saved Jobs"; description "Add Saved Jobs to your home
   page."; operations [{"type":"add_module","slot":"homeMain","componentId":"savedJobs","index":0}].
5. promote-jobs: when counts.jobs_route_visited is at least 3 and jobs is not directly after
   home in navigation. Return id promote-jobs; title "Move Jobs next to Home"; description
   "Move Jobs next to Home in your navigation."; operations [{"type":"move_nav","navItemId":"jobs","afterNavItemId":"home"}].

For every non-null recommendation, expectedManifestRevision must equal manifest.revision.
`;

export function buildGeminiRulePrompt(input: PlannerInput): string {
  const appliedJobId = input.summary.latestTargetIds.job_application_submitted;
  const appliedJob = appliedJobId ? getJob(appliedJobId) : undefined;

  return `${RULE_CONTRACT}
Prompt version: ${GEMINI_RULE_PROMPT_VERSION}
Resolved dynamic context: ${JSON.stringify({
    appliedJob: appliedJob ? { id: appliedJob.id, company: appliedJob.company } : null,
  })}
Event summary: ${JSON.stringify(input.summary)}
Manifest: ${JSON.stringify(input.manifest)}
Suppressed recommendation IDs: ${JSON.stringify(input.suppressedRecommendationIds)}`;
}
