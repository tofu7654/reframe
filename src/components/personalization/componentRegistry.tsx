import type { ComponentType } from "react";
import type { ComponentId } from "@/contracts/personalization";
import { Feed } from "@/components/feed/Feed";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { SavedJobs } from "@/components/modules/SavedJobs";
import { ApplicationTracker } from "@/components/modules/ApplicationTracker";
import { AppliedCompanyConnections } from "@/components/modules/AppliedCompanyConnections";
import { PostEngagers } from "@/components/modules/PostEngagers";
import { CandidateResearchQueue } from "@/components/modules/CandidateResearchQueue";
import { JobDiscoveryHub } from "@/components/modules/JobDiscoveryHub";
import { CreatorCommandCenter } from "@/components/modules/CreatorCommandCenter";
import { TalentPipeline } from "@/components/modules/TalentPipeline";

export const COMPONENT_REGISTRY: Record<ComponentId, ComponentType> = {
  feed: Feed,
  savedJobs: SavedJobs,
  rightSidebar: RightSidebar,
  applicationTracker: ApplicationTracker,
  appliedCompanyConnections: AppliedCompanyConnections,
  postEngagers: PostEngagers,
  candidateResearchQueue: CandidateResearchQueue,
  jobDiscoveryHub: JobDiscoveryHub,
  creatorCommandCenter: CreatorCommandCenter,
  talentPipeline: TalentPipeline,
};
