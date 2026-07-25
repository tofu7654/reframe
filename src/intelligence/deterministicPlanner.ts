import type { Recommendation, RecommendationId } from "@/contracts/personalization";
import { getJob } from "@/lib/jobs-data";
import {
  getManifestPreset,
  manifestMatchesPreset,
  type ManifestPresetId,
} from "@/personalization/manifestPresets";
import type { PlannerInput, RecommendationPlanner } from "./planner";

// Gemini parity contract: changes to these rules, priority, output copy,
// operations, or generated manifest state must be mirrored in
// geminiRulePrompt.ts, its version, and parity tests before they ship.
export const DETERMINISTIC_RULE_PRIORITY = [
  "creator-relationship-hub",
  "application-momentum",
  "job-search-command-center",
  "post-engagers",
  "applied-company-connections",
  "application-tracker",
  "saved-jobs",
  "promote-jobs",
] as const satisfies readonly RecommendationId[];

export const PRESET_RULE_THRESHOLDS = {
  creatorRelationshipHub: {
    postsPublished: 2,
    postEngagementsReceived: 2,
  },
  applicationMomentum: {
    applicationsStarted: 2,
    applicationsSubmitted: 1,
  },
  jobSearchCommandCenter: {
    searchesPerformed: 2,
  },
} as const;

export const deterministicPlanner: RecommendationPlanner = {
  plan(input) {
    const candidates = buildCandidates(input);
    return (
      DETERMINISTIC_RULE_PRIORITY.map((id) => candidates.get(id)).find(
        (recommendation): recommendation is Recommendation => Boolean(recommendation),
      ) ?? null
    );
  },
};

function buildCandidates(input: PlannerInput): Map<RecommendationId, Recommendation> {
  const candidates = new Map<RecommendationId, Recommendation>();
  const suppressed = new Set(input.suppressedRecommendationIds);
  const engagedPostId = input.summary.latestTargetIds.post_engagement_received;
  const appliedJobId = input.summary.latestTargetIds.job_application_submitted;
  const appliedJob = appliedJobId ? getJob(appliedJobId) : undefined;

  if (
    input.summary.counts.post_published >=
      PRESET_RULE_THRESHOLDS.creatorRelationshipHub.postsPublished &&
    input.summary.counts.post_engagement_received >=
      PRESET_RULE_THRESHOLDS.creatorRelationshipHub.postEngagementsReceived &&
    !suppressed.has("creator-relationship-hub") &&
    !manifestMatchesPreset(input.manifest, "creator-relationship-hub")
  ) {
    candidates.set(
      "creator-relationship-hub",
      buildPresetRecommendation(input, "creator-relationship-hub"),
    );
  }

  if (
    input.summary.counts.job_application_started >=
      PRESET_RULE_THRESHOLDS.applicationMomentum.applicationsStarted &&
    input.summary.counts.job_application_submitted >=
      PRESET_RULE_THRESHOLDS.applicationMomentum.applicationsSubmitted &&
    !suppressed.has("application-momentum") &&
    !manifestMatchesPreset(input.manifest, "application-momentum")
  ) {
    candidates.set(
      "application-momentum",
      buildPresetRecommendation(input, "application-momentum"),
    );
  }

  if (
    input.summary.counts.job_search_performed >=
      PRESET_RULE_THRESHOLDS.jobSearchCommandCenter.searchesPerformed &&
    !suppressed.has("job-search-command-center") &&
    !manifestMatchesPreset(input.manifest, "job-search-command-center")
  ) {
    candidates.set(
      "job-search-command-center",
      buildPresetRecommendation(input, "job-search-command-center"),
    );
  }

  if (
    engagedPostId &&
    !suppressed.has("post-engagers") &&
    !input.manifest.slots.homeMain.includes("postEngagers")
  ) {
    candidates.set("post-engagers", {
      id: "post-engagers",
      expectedManifestRevision: input.manifest.revision,
      title: "Connect with people engaging with your post",
      description:
        "Your recent post received new engagement. Add the people joining that conversation to your home page.",
      operations: [
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "postEngagers",
          index: 0,
        },
      ],
    });
  }

  if (
    appliedJob &&
    !suppressed.has("applied-company-connections") &&
    !input.manifest.slots.jobsMain.includes("appliedCompanyConnections")
  ) {
    candidates.set("applied-company-connections", {
      id: "applied-company-connections",
      expectedManifestRevision: input.manifest.revision,
      title: `Meet people at ${appliedJob.company}`,
      description: `You applied to ${appliedJob.company}. Add relevant employees and mutual connections to your Jobs page.`,
      operations: [
        {
          type: "add_module",
          slot: "jobsMain",
          componentId: "appliedCompanyConnections",
          index: 0,
        },
      ],
    });
  }

  if (
    (input.summary.counts.job_application_started >= 1 ||
      input.summary.counts.job_application_submitted >= 1) &&
    !suppressed.has("application-tracker") &&
    !input.manifest.slots.jobsMain.includes("applicationTracker")
  ) {
    const unfinishedCount = input.summary.unfinishedApplicationTargetIds.length;
    candidates.set("application-tracker", {
      id: "application-tracker",
      expectedManifestRevision: input.manifest.revision,
      title: "Track your job applications",
      description:
        unfinishedCount > 0
          ? `You have ${unfinishedCount} unfinished ${unfinishedCount === 1 ? "application" : "applications"}. Add a tracker to your Jobs page so you can resume where you left off.`
          : "You recently submitted an application. Add a tracker to your Jobs page to keep your job search organized.",
      operations: [
        {
          type: "add_module",
          slot: "jobsMain",
          componentId: "applicationTracker",
          index: 0,
        },
      ],
    });
  }

  if (
    input.summary.counts.job_saved >= 3 &&
    !suppressed.has("saved-jobs") &&
    !input.manifest.slots.homeMain.includes("savedJobs") &&
    !input.manifest.slots.homeLeftRail.includes("savedJobs")
  ) {
    candidates.set("saved-jobs", {
      id: "saved-jobs",
      expectedManifestRevision: input.manifest.revision,
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
    });
  }

  const jobsIndex = input.manifest.navigation.indexOf("jobs");
  const homeIndex = input.manifest.navigation.indexOf("home");
  if (
    input.summary.counts.jobs_route_visited >= 3 &&
    !suppressed.has("promote-jobs") &&
    jobsIndex !== homeIndex + 1
  ) {
    candidates.set("promote-jobs", {
      id: "promote-jobs",
      expectedManifestRevision: input.manifest.revision,
      title: "Move Jobs next to Home",
      description: "Move Jobs next to Home in your navigation.",
      operations: [
        {
          type: "move_nav",
          navItemId: "jobs",
          afterNavItemId: "home",
        },
      ],
    });
  }

  return candidates;
}

function buildPresetRecommendation(
  input: PlannerInput,
  manifestId: Exclude<ManifestPresetId, "talent-scout-workspace">,
): Recommendation {
  const preset = getManifestPreset(manifestId);
  return {
    id: manifestId,
    expectedManifestRevision: input.manifest.revision,
    title: preset.title,
    description: preset.recommendationCopy,
    operations: [{ type: "apply_manifest", manifestId }],
  };
}
