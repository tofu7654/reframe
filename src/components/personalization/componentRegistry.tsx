import type { ComponentType } from "react";
import type { ComponentId } from "@/contracts/personalization";
import { Feed } from "@/components/feed/Feed";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { SavedJobs } from "@/components/modules/SavedJobs";
import { ApplicationTracker } from "@/components/modules/ApplicationTracker";

export const COMPONENT_REGISTRY: Record<ComponentId, ComponentType> = {
  feed: Feed,
  savedJobs: SavedJobs,
  rightSidebar: RightSidebar,
  applicationTracker: ApplicationTracker,
};
