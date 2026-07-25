import { recordSemanticEvent } from "./reframe-events";

const VIEW_DEDUPE_MS = 2_000;

export const trackUserAction = {
  jobsOpened: () =>
    recordSemanticEvent(
      { name: "jobs_tab_opened", surface: "jobs" },
      { dedupeWindowMs: VIEW_DEDUPE_MS },
    ),

  jobViewed: (jobId: string) =>
    recordSemanticEvent(
      { name: "job_viewed", surface: "jobs", targetType: "job", targetId: jobId },
      { dedupeWindowMs: VIEW_DEDUPE_MS },
    ),

  jobSaved: (jobId: string) =>
    recordSemanticEvent({
      name: "job_saved",
      surface: "jobs",
      targetType: "job",
      targetId: jobId,
    }),

  jobApplied: (jobId: string) =>
    recordSemanticEvent({
      name: "job_applied",
      surface: "jobs",
      targetType: "job",
      targetId: jobId,
    }),

  peopleSearched: () =>
    recordSemanticEvent({
      name: "people_searched",
      surface: "profile",
    }),

  profileViewed: (profileId: string) =>
    recordSemanticEvent(
      {
        name: "profile_viewed",
        surface: "profile",
        targetType: "profile",
        targetId: profileId,
      },
      { dedupeWindowMs: VIEW_DEDUPE_MS },
    ),

  candidateMessaged: (profileId: string) =>
    recordSemanticEvent({
      name: "candidate_messaged",
      surface: "messages",
      targetType: "profile",
      targetId: profileId,
    }),

  networkOpened: () =>
    recordSemanticEvent(
      { name: "network_tab_opened", surface: "network" },
      { dedupeWindowMs: VIEW_DEDUPE_MS },
    ),

  invitationAccepted: (profileId: string) =>
    recordSemanticEvent({
      name: "invitation_accepted",
      surface: "network",
      targetType: "profile",
      targetId: profileId,
    }),

  connectionRequested: (profileId: string) =>
    recordSemanticEvent({
      name: "connection_requested",
      surface: "network",
      targetType: "profile",
      targetId: profileId,
    }),

  notificationsOpened: () =>
    recordSemanticEvent(
      { name: "notifications_tab_opened", surface: "notifications" },
      { dedupeWindowMs: VIEW_DEDUPE_MS },
    ),

  notificationFilterApplied: (category: "all" | "jobs" | "mentions" | "posts") =>
    recordSemanticEvent({
      name: "notification_filter_applied",
      surface: "notifications",
      metadata: { category },
    }),

  composerOpened: (source: "start" | "video" | "photo" | "article") =>
    recordSemanticEvent({
      name: "composer_opened",
      surface: "creator",
      metadata: { source },
    }),

  postPublished: (hasImage: boolean) =>
    recordSemanticEvent({
      name: "post_published",
      surface: "creator",
      targetType: "post",
      metadata: { hasImage },
    }),
};
