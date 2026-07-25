import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { planRecommendation } from "./recommendationPlanner";

describe("server recommendation planner scaffold", () => {
  it("returns a structured not-configured response without calling a provider", async () => {
    const response = await planRecommendation({
      schemaVersion: 1,
      summary: {
        counts: {
          job_saved: 0,
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
      allowedComponentIds: [
        "feed",
        "savedJobs",
        "rightSidebar",
        "applicationTracker",
        "appliedCompanyConnections",
        "postEngagers",
      ],
      allowedNavItemIds: ["home", "network", "jobs", "messaging", "notifications"],
      allowedOperations: ["add_module", "remove_module", "move_nav", "hide_nav", "show_nav"],
    });

    expect(response).toEqual({
      schemaVersion: 1,
      ok: false,
      error: "not_configured",
    });
  });
});
