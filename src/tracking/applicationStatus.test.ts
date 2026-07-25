import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "@/contracts/events";
import { getTrackedApplications } from "./applicationStatus";

describe("getTrackedApplications", () => {
  it("marks a started application as unfinished and makes the latest status authoritative", () => {
    const events: AnalyticsEvent[] = [
      {
        id: "submitted",
        type: "job_application_submitted",
        occurredAt: "2026-01-01T10:00:00.000Z",
        targetId: "sre-amazon",
      },
      {
        id: "restarted",
        type: "job_application_started",
        occurredAt: "2026-01-02T10:00:00.000Z",
        targetId: "sre-amazon",
      },
    ];

    expect(getTrackedApplications(events)).toMatchObject([
      {
        job: { id: "sre-amazon" },
        status: "unfinished",
        occurredAt: "2026-01-02T10:00:00.000Z",
      },
    ]);
  });

  it("marks an application as submitted when submission is the latest event", () => {
    const events: AnalyticsEvent[] = [
      {
        id: "started",
        type: "job_application_started",
        occurredAt: "2026-01-01T10:00:00.000Z",
        targetId: "platform-stripe",
      },
      {
        id: "submitted",
        type: "job_application_submitted",
        occurredAt: "2026-01-01T10:05:00.000Z",
        targetId: "platform-stripe",
      },
    ];

    expect(getTrackedApplications(events)[0]).toMatchObject({
      job: { id: "platform-stripe" },
      status: "submitted",
    });
  });
});
