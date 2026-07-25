export const MANIFEST_SCHEMA_VERSION = 4;

export type ComponentId =
  | "feed"
  | "savedJobs"
  | "rightSidebar"
  | "applicationTracker"
  | "appliedCompanyConnections"
  | "postEngagers"
  | "candidateResearchQueue"
  | "jobDiscoveryHub"
  | "creatorCommandCenter"
  | "talentPipeline";

export type HomeSlotId = "homeLeftRail" | "homeMain" | "homeRightRail";
export type JobsSlotId = "jobsMain";
export type SlotId = HomeSlotId | JobsSlotId;

export type NavItemId = "home" | "network" | "jobs" | "messaging" | "notifications";

export const MANIFEST_PRESET_IDS = [
  "job-search-command-center",
  "application-momentum",
  "creator-relationship-hub",
  "talent-scout-workspace",
] as const;

export type ManifestPresetId = (typeof MANIFEST_PRESET_IDS)[number];

export interface UIManifest {
  schemaVersion: typeof MANIFEST_SCHEMA_VERSION;
  revision: number;
  navigation: NavItemId[];
  slots: Record<SlotId, ComponentId[]>;
}

export type UIOperation =
  | {
      type: "add_module";
      slot: SlotId;
      componentId: ComponentId;
      index?: number;
    }
  | {
      type: "remove_module";
      slot: SlotId;
      componentId: ComponentId;
    }
  | {
      type: "move_nav";
      navItemId: NavItemId;
      afterNavItemId: NavItemId;
    }
  | {
      type: "hide_nav";
      navItemId: NavItemId;
    }
  | {
      type: "show_nav";
      navItemId: NavItemId;
      afterNavItemId?: NavItemId;
    }
  | {
      type: "apply_manifest";
      manifestId: ManifestPresetId;
    };

export interface Recommendation {
  id: RecommendationId;
  expectedManifestRevision: number;
  title: string;
  description: string;
  operations: UIOperation[];
}

export const RECOMMENDATION_IDS = [
  "creator-relationship-hub",
  "application-momentum",
  "job-search-command-center",
  "post-engagers",
  "applied-company-connections",
  "application-tracker",
  "saved-jobs",
  "promote-jobs",
] as const;

export type RecommendationId = (typeof RECOMMENDATION_IDS)[number];
