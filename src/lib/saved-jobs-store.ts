const SAVED_JOBS_KEY = "linkedout:saved-jobs:v1";
const SAVED_JOBS_CHANGED = "linkedout:saved-jobs-changed";

export function readSavedJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_JOBS_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isJobSaved(jobId: string) {
  return readSavedJobIds().includes(jobId);
}

export function toggleSavedJob(jobId: string): boolean | undefined {
  try {
    const current = readSavedJobIds();
    const saved = !current.includes(jobId);
    const next = saved ? [...current, jobId] : current.filter((id) => id !== jobId);
    window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SAVED_JOBS_CHANGED, { detail: { jobId, saved } }));
    return saved;
  } catch {
    return undefined;
  }
}

export function subscribeToSavedJobs(listener: () => void) {
  window.addEventListener(SAVED_JOBS_CHANGED, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(SAVED_JOBS_CHANGED, listener);
    window.removeEventListener("storage", listener);
  };
}
