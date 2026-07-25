import { useEffect, useState } from "react";
import { isJobSaved, subscribeToSavedJobs, toggleSavedJob } from "@/lib/saved-jobs-store";
import { trackUserAction } from "@/lib/reframe-tracking";

export function useSavedJob(jobId: string) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isJobSaved(jobId));
    sync();
    return subscribeToSavedJobs(sync);
  }, [jobId]);

  const toggle = () => {
    const isNowSaved = toggleSavedJob(jobId);
    if (isNowSaved) trackUserAction.jobSaved(jobId);
  };

  return { saved, toggle };
}
