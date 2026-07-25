export interface LatestPlanRunner {
  run<T>(operation: () => Promise<T>): Promise<{ value: T; isLatest: boolean }>;
  invalidate(): void;
}

export function createLatestPlanRunner(): LatestPlanRunner {
  let latestRequest = 0;

  return {
    async run<T>(operation: () => Promise<T>) {
      const request = ++latestRequest;
      const value = await operation();
      return { value, isLatest: request === latestRequest };
    },
    invalidate() {
      latestRequest += 1;
    },
  };
}
