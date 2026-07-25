import {
  PLANNER_SCHEMA_VERSION,
  type PlannerRequest,
  type PlannerResponse,
} from "@/contracts/planner";

export async function planRecommendation(_request: PlannerRequest): Promise<PlannerResponse> {
  return {
    schemaVersion: PLANNER_SCHEMA_VERSION,
    ok: false,
    error: "not_configured",
  };
}
