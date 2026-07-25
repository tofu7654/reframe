import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST } from "@/registry/catalog";
import { summarizeEvents } from "@/tracking/summarizeEvents";
import { deterministicPlanner } from "./deterministicPlanner";
import type { AnalyticsEvent } from "@/contracts/events";

function events(type: AnalyticsEvent["type"], count: number): AnalyticsEvent[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${type}-${index}`,
    type,
    occurredAt: new Date(index).toISOString(),
  }));
}

describe("deterministicPlanner", () => {
  it("recommends the complete job-search manifest after two submitted job searches", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_search_performed", 2)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation).toMatchObject({
      id: "job-search-command-center",
      title: "Your Job Search Command Center",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "job-search-command-center",
        },
      ],
    });
  });

  it("recommends the complete application manifest after repeated application activity", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents([
        ...events("job_application_started", 2),
        ...events("job_application_submitted", 1),
      ]),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation).toMatchObject({
      id: "application-momentum",
      title: "Keep Your Applications Moving",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "application-momentum",
        },
      ],
    });
  });

  it("recommends the complete creator manifest after repeated publishing and engagement", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents([
        ...events("post_published", 2),
        ...events("post_engagement_received", 2),
      ]),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation).toMatchObject({
      id: "creator-relationship-hub",
      title: "Turn Engagement Into Relationships",
      operations: [
        {
          type: "apply_manifest",
          manifestId: "creator-relationship-hub",
        },
      ],
    });
  });

  it("does not recommend a complete manifest that is already active", () => {
    const activeManifest = {
      ...DEFAULT_MANIFEST,
      navigation: ["home", "jobs", "network", "messaging", "notifications"] as const,
      slots: {
        homeLeftRail: ["savedJobs"] as const,
        homeMain: ["jobDiscoveryHub", "feed"] as const,
        homeRightRail: ["rightSidebar"] as const,
        jobsMain: ["applicationTracker"] as const,
      },
    };
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_search_performed", 2)),
      manifest: structuredClone(activeManifest),
      suppressedRecommendationIds: ["application-tracker", "saved-jobs", "promote-jobs"],
    });

    expect(recommendation).toBeNull();
  });

  it("recommends connecting with post engagers after public engagement", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents([
        {
          id: "engagement-1",
          type: "post_engagement_received",
          occurredAt: new Date(0).toISOString(),
          targetId: "post-1",
        },
      ]),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation?.id).toBe("post-engagers");
  });

  it("recommends company connections after an application with job context", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents([
        {
          id: "application-1",
          type: "job_application_submitted",
          occurredAt: new Date(0).toISOString(),
          targetId: "platform-stripe",
        },
      ]),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation?.id).toBe("applied-company-connections");
    expect(recommendation?.title).toContain("Stripe");
    expect(recommendation?.operations).toEqual([
      {
        type: "add_module",
        slot: "jobsMain",
        componentId: "appliedCompanyConnections",
        index: 0,
      },
    ]);
  });

  it("prioritizes an application tracker recommendation", () => {
    const summary = summarizeEvents([
      ...events("job_saved", 3),
      ...events("job_application_submitted", 1),
      ...events("jobs_route_visited", 2),
    ]);

    const recommendation = deterministicPlanner.plan({
      summary,
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation?.id).toBe("application-tracker");
    expect(recommendation?.expectedManifestRevision).toBe(0);
    expect(recommendation?.operations[0]).toMatchObject({
      type: "add_module",
      slot: "jobsMain",
      componentId: "applicationTracker",
    });
  });

  it("recommends the tracker for an unfinished application", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents([
        {
          id: "started-1",
          type: "job_application_started",
          occurredAt: new Date(0).toISOString(),
          targetId: "sre-amazon",
        },
      ]),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: [],
    });

    expect(recommendation?.id).toBe("application-tracker");
    expect(recommendation?.description).toContain("1 unfinished application");
  });

  it("recommends saved jobs after three saves", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_saved", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["application-tracker"],
    });

    expect(recommendation?.id).toBe("saved-jobs");
  });

  it("does not duplicate Saved Jobs when a manifest already placed it in the left rail", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_saved", 3)),
      manifest: {
        ...DEFAULT_MANIFEST,
        slots: {
          ...DEFAULT_MANIFEST.slots,
          homeLeftRail: ["savedJobs"],
        },
      },
      suppressedRecommendationIds: ["application-tracker"],
    });

    expect(recommendation).toBeNull();
  });

  it("recommends promoting Jobs after three route visits", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("jobs_route_visited", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["application-tracker", "saved-jobs"],
    });

    expect(recommendation?.id).toBe("promote-jobs");
  });

  it("does not return a suppressed recommendation", () => {
    const recommendation = deterministicPlanner.plan({
      summary: summarizeEvents(events("job_saved", 3)),
      manifest: DEFAULT_MANIFEST,
      suppressedRecommendationIds: ["saved-jobs"],
    });

    expect(recommendation).toBeNull();
  });
});
