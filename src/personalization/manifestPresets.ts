import {
  MANIFEST_SCHEMA_VERSION,
  type ManifestPresetId,
  type UIManifest,
} from "@/contracts/personalization";

export type { ManifestPresetId } from "@/contracts/personalization";

export interface ManifestPreset {
  id: ManifestPresetId;
  title: string;
  tendency: string;
  recommendationCopy: string;
  evidenceExamples: string[];
  personalizedValue: string[];
  manifest: UIManifest;
}

export const MANIFEST_PRESETS: ManifestPreset[] = [
  {
    id: "job-search-command-center",
    title: "Your Job Search Command Center",
    tendency: "Repeated job searches",
    recommendationCopy:
      "You submitted two job searches in this session. Turn Home into a job-search starting point with fresh matches first, your shortlist close behind, and the general feed available when you need it.",
    evidenceExamples: [
      "Submitted two job searches",
      "Compared roles across multiple searches",
      "Continued exploring the Jobs experience",
    ],
    personalizedValue: [
      "Discover matching jobs immediately on Home",
      "Compare your saved shortlist before opening the general feed",
      "Reach Jobs immediately from beside Home",
    ],
    manifest: {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      revision: 0,
      navigation: ["home", "jobs", "network", "messaging", "notifications"],
      slots: {
        homeLeftRail: ["savedJobs"],
        homeMain: ["jobDiscoveryHub", "feed"],
        homeRightRail: ["rightSidebar"],
        jobsMain: ["applicationTracker"],
      },
    },
  },
  {
    id: "application-momentum",
    title: "Keep Your Applications Moving",
    tendency: "Active applications and company research",
    recommendationCopy:
      "You are moving beyond browsing into active applications. Make application progress and warm company connections the first things you see when you arrive, instead of burying them on another page.",
    evidenceExamples: [
      "Has at least one unfinished application",
      "Recently submitted an application",
      "Viewed or saved roles at the same companies",
    ],
    personalizedValue: [
      "Resume incomplete applications directly from Home",
      "See submitted and unfinished applications before the feed",
      "Build warm connections at companies already in your pipeline",
    ],
    manifest: {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      revision: 0,
      navigation: ["home", "jobs", "network", "messaging", "notifications"],
      slots: {
        homeLeftRail: [],
        homeMain: ["applicationTracker", "appliedCompanyConnections", "feed"],
        homeRightRail: ["rightSidebar"],
        jobsMain: [],
      },
    },
  },
  {
    id: "creator-relationship-hub",
    title: "Turn Engagement Into Relationships",
    tendency: "Publishing content and following audience response",
    recommendationCopy:
      "Your posts are starting conversations. Turn Home into a creator command center that shows content momentum, prioritizes replies, and introduces the people engaging most deeply with your work.",
    evidenceExamples: [
      "Published a recent post",
      "Received comments, reactions, or reposts",
      "Returned to notifications after publishing",
    ],
    personalizedValue: [
      "See reach, publishing cadence, and replies due at a glance",
      "Meet high-intent engagers while the conversation is timely",
      "Keep notifications and networking ahead of less relevant tools",
    ],
    manifest: {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      revision: 0,
      navigation: ["home", "notifications", "network", "messaging", "jobs"],
      slots: {
        homeLeftRail: [],
        homeMain: ["creatorCommandCenter", "postEngagers", "feed"],
        homeRightRail: ["rightSidebar"],
        jobsMain: [],
      },
    },
  },
  {
    id: "talent-scout-workspace",
    title: "Your Talent Scout Workspace",
    tendency: "Repeated profile research with recruiting intent",
    recommendationCopy:
      "You have been reviewing people with similar technical backgrounds. Turn Home into a recruiting workspace with matched candidates, pipeline visibility, and the next follow-up ready to act on.",
    evidenceExamples: [
      "Viewed several profiles with overlapping skills",
      "Repeated searches for the same role or technology",
      "Messaged or connected after profile research",
    ],
    personalizedValue: [
      "Review matching nearby candidates as soon as you arrive",
      "See pipeline health without maintaining a separate tracker",
      "Act on overdue follow-ups before promising candidates go cold",
    ],
    manifest: {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      revision: 0,
      navigation: ["home", "network", "messaging", "notifications", "jobs"],
      slots: {
        homeLeftRail: [],
        homeMain: ["candidateResearchQueue", "talentPipeline", "feed"],
        homeRightRail: ["rightSidebar"],
        jobsMain: [],
      },
    },
  },
];

export function getManifestPreset(id: ManifestPresetId): ManifestPreset {
  const preset = MANIFEST_PRESETS.find((candidate) => candidate.id === id);
  if (!preset) {
    throw new Error(`Unknown manifest preset: ${id}`);
  }
  return preset;
}

export function manifestMatchesPreset(manifest: UIManifest, id: ManifestPresetId): boolean {
  const target = getManifestPreset(id).manifest;
  return (
    arraysEqual(manifest.navigation, target.navigation) &&
    arraysEqual(manifest.slots.homeLeftRail, target.slots.homeLeftRail) &&
    arraysEqual(manifest.slots.homeMain, target.slots.homeMain) &&
    arraysEqual(manifest.slots.homeRightRail, target.slots.homeRightRail) &&
    arraysEqual(manifest.slots.jobsMain, target.slots.jobsMain)
  );
}

function arraysEqual<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
