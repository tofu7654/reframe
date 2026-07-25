import { describe, expect, it } from "vitest";
import { createLatestPlanRunner } from "./latestPlanRunner";

describe("createLatestPlanRunner", () => {
  it("marks an older asynchronous result stale after a newer request starts", async () => {
    let resolveFirst: ((value: string) => void) | undefined;
    const first = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const runner = createLatestPlanRunner();

    const firstRun = runner.run(() => first);
    const secondRun = runner.run(async () => "second");
    resolveFirst?.("first");

    await expect(firstRun).resolves.toEqual({ value: "first", isLatest: false });
    await expect(secondRun).resolves.toEqual({ value: "second", isLatest: true });
  });

  it("invalidates an in-flight result on reset", async () => {
    let resolve: ((value: string) => void) | undefined;
    const pending = new Promise<string>((resolvePending) => {
      resolve = resolvePending;
    });
    const runner = createLatestPlanRunner();

    const run = runner.run(() => pending);
    runner.invalidate();
    resolve?.("late");

    await expect(run).resolves.toEqual({ value: "late", isLatest: false });
  });
});
