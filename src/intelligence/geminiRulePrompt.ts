import type { RecommendationId } from "@/contracts/personalization";
import { getJob } from "@/lib/jobs-data";
import { getManifestPreset, MANIFEST_PRESETS } from "@/personalization/manifestPresets";
import { PRESET_RULE_THRESHOLDS } from "./deterministicPlanner";
import type { PlannerInput } from "./planner";

// Keep this prompt byte-for-byte semantically aligned with deterministicPlanner:
// rule conditions, priority, exact recommendation fields, operations, and any
// manifest state produced by a rule must change together with the prompt version/tests.
export const GEMINI_RULE_PROMPT_VERSION = "rules-v5";

export const GEMINI_PROMPT_RULE_IDS = [
  "creator-relationship-hub",
  "application-momentum",
  "job-search-command-center",
  "post-engagers",
  "applied-company-connections",
  "application-tracker",
  "saved-jobs",
  "promote-jobs",
] as const satisfies readonly RecommendationId[];

const creatorPreset = getManifestPreset("creator-relationship-hub");
const applicationPreset = getManifestPreset("application-momentum");
const jobSearchPreset = getManifestPreset("job-search-command-center");

const RULE_CONTRACT = `
You reproduce the deterministic recommendation planner exactly. Return JSON only: either
null, or one complete recommendation object with id, expectedManifestRevision, title,
description, and operations. Do not improve wording, omit fields, add fields, or change
operation order. A recommendation is eligible only when it is not suppressed and its
target UI state is not already present. When comparing the current manifest to an approved
preset, ignore revision and compare navigation and every slot in order.

Evaluate every rule, then return the first eligible recommendation in this priority order:
1. creator-relationship-hub: when counts.post_published is at least
   ${PRESET_RULE_THRESHOLDS.creatorRelationshipHub.postsPublished} and
   counts.post_engagement_received is at least
   ${PRESET_RULE_THRESHOLDS.creatorRelationshipHub.postEngagementsReceived}, and the current
   manifest does not match the creator-relationship-hub preset. Return id
   creator-relationship-hub; title ${JSON.stringify(creatorPreset.title)}; description
   ${JSON.stringify(creatorPreset.recommendationCopy)}; operations
   [{"type":"apply_manifest","manifestId":"creator-relationship-hub"}].
2. application-momentum: when counts.job_application_started is at least
   ${PRESET_RULE_THRESHOLDS.applicationMomentum.applicationsStarted} and
   counts.job_application_submitted is at least
   ${PRESET_RULE_THRESHOLDS.applicationMomentum.applicationsSubmitted}, and the current manifest
   does not match the application-momentum preset. Return id application-momentum; title
   ${JSON.stringify(applicationPreset.title)}; description
   ${JSON.stringify(applicationPreset.recommendationCopy)}; operations
   [{"type":"apply_manifest","manifestId":"application-momentum"}].
3. job-search-command-center: when counts.job_search_performed is at least
   ${PRESET_RULE_THRESHOLDS.jobSearchCommandCenter.searchesPerformed}, and the current manifest
   does not match the job-search-command-center preset. Return id
   job-search-command-center; title ${JSON.stringify(jobSearchPreset.title)}; description
   ${JSON.stringify(jobSearchPreset.recommendationCopy)}; operations
   [{"type":"apply_manifest","manifestId":"job-search-command-center"}].
4. post-engagers: when latestTargetIds.post_engagement_received exists and homeMain does
   not include postEngagers. Return id post-engagers; title "Connect with people engaging
   with your post"; description "Your recent post received new engagement. Add the people
   joining that conversation to your home page."; operations [{"type":"add_module","slot":"homeMain","componentId":"postEngagers","index":0}].
5. applied-company-connections: when a resolved applied job exists and jobsMain does not
   include appliedCompanyConnections. Return id applied-company-connections; title "Meet
   people at <company>"; description "You applied to <company>. Add relevant employees and
   mutual connections to your Jobs page."; operations [{"type":"add_module","slot":"jobsMain","componentId":"appliedCompanyConnections","index":0}].
6. application-tracker: when counts.job_application_started is at least 1 or
   counts.job_application_submitted is at least 1, and jobsMain does not include
   applicationTracker. Return id application-tracker; title "Track your job applications".
   Let N equal unfinishedApplicationTargetIds.length. When N is greater than 0, use the
   exact description "You have <N> unfinished application. Add a tracker to your Jobs page
   so you can resume where you left off." when N is 1, or "You have <N> unfinished
   applications. Add a tracker to your Jobs page so you can resume where you left off."
   otherwise. When N is 0, use the exact description "You recently submitted an
   application. Add a tracker to your Jobs page to keep your job search organized.".
   operations [{"type":"add_module","slot":"jobsMain","componentId":"applicationTracker","index":0}].
7. saved-jobs: when counts.job_saved is at least 3, homeMain does not include savedJobs,
   and homeLeftRail does not include savedJobs. Return id saved-jobs; title "Add Saved
   Jobs"; description "Add Saved Jobs to your home page."; operations
   [{"type":"add_module","slot":"homeMain","componentId":"savedJobs","index":0}].
8. promote-jobs: when counts.jobs_route_visited is at least 3 and jobs is not directly after
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
Approved preset manifests: ${JSON.stringify(
    MANIFEST_PRESETS.map(({ id, manifest }) => ({ id, manifest })),
  )}
Suppressed recommendation IDs: ${JSON.stringify(input.suppressedRecommendationIds)}`;
}
