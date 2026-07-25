import type { EventSummary } from "./events";
import type {
  ComponentId,
  NavItemId,
  Recommendation,
  UIManifest,
  UIOperation,
} from "./personalization";

export const PLANNER_SCHEMA_VERSION = 1;

export interface PlannerRequest {
  schemaVersion: typeof PLANNER_SCHEMA_VERSION;
  summary: EventSummary;
  manifest: UIManifest;
  allowedComponentIds: ComponentId[];
  allowedNavItemIds: NavItemId[];
  allowedOperations: Array<UIOperation["type"]>;
}

export type PlannerResponse =
  | {
      schemaVersion: typeof PLANNER_SCHEMA_VERSION;
      ok: true;
      recommendation: Recommendation | null;
    }
  | {
      schemaVersion: typeof PLANNER_SCHEMA_VERSION;
      ok: false;
      error: "not_configured" | "invalid_request" | "provider_error";
    };
