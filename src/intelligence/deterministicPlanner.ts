import type { Recommendation, RecommendationId } from "@/contracts/personalization";
import { getJob } from "@/lib/jobs-data";
import type { PlannerInput, RecommendationPlanner } from "./planner";

const PRIORITY: RecommendationId[] = [
  "post-engagers",
  "applied-company-connections",
  "application-tracker",
  "saved-jobs",
  "promote-jobs",
];

export const deterministicPlanner: RecommendationPlanner = {
  plan(input) {
    const candidates = buildCandidates(input);
    return (
      PRIORITY.map((id) => candidates.get(id)).find(
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
    !input.manifest.slots.homeMain.includes("appliedCompanyConnections")
  ) {
    candidates.set("applied-company-connections", {
      id: "applied-company-connections",
      expectedManifestRevision: input.manifest.revision,
      title: `Meet people at ${appliedJob.company}`,
      description: `You applied to ${appliedJob.company}. Add relevant employees and mutual connections to your home page.`,
      operations: [
        {
          type: "add_module",
          slot: "homeMain",
          componentId: "appliedCompanyConnections",
          index: 0,
        },
      ],
    });
  }

  if (
    input.summary.counts.job_application_submitted >= 1 &&
    !suppressed.has("application-tracker") &&
    !input.manifest.slots.homeRightRail.includes("applicationTracker")
  ) {
    candidates.set("application-tracker", {
      id: "application-tracker",
      expectedManifestRevision: input.manifest.revision,
      title: "Add Application Tracker",
      description: "Add Application Tracker to your home page.",
      operations: [
        {
          type: "add_module",
          slot: "homeRightRail",
          componentId: "applicationTracker",
          index: 0,
        },
      ],
    });
  }

  if (
    input.summary.counts.job_saved >= 3 &&
    !suppressed.has("saved-jobs") &&
    !input.manifest.slots.homeMain.includes("savedJobs")
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
