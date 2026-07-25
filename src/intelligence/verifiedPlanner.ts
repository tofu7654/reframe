import type { Recommendation } from "@/contracts/personalization";
import type { PlannerInput, RecommendationPlanner } from "./planner";

export type GeminiFallbackReason =
  "missing_api_key" | "timeout" | "provider_error" | "invalid_json" | "invalid_response";

export type GeminiPlanResult =
  | {
      status: "ok";
      recommendation: Recommendation | null;
      model: string;
      promptVersion: string;
    }
  | {
      status: "fallback";
      reason: GeminiFallbackReason;
      model: string;
      promptVersion: string;
    };

export interface GeminiRecommendationPlanner {
  plan(input: PlannerInput): Promise<GeminiPlanResult>;
}

export interface VerifiedPlanResult {
  finalRecommendation: Recommendation | null;
  geminiRecommendation: Recommendation | null;
  deterministicRecommendation: Recommendation | null;
  exactMatch: boolean;
  selectedSource: "gemini" | "rules";
  fallbackReason: GeminiFallbackReason | "mismatch" | null;
  model: string;
  promptVersion: string;
}

export interface VerifiedRecommendationPlanner {
  plan(input: PlannerInput): Promise<VerifiedPlanResult>;
}

export function createVerifiedPlanner(
  geminiPlanner: GeminiRecommendationPlanner,
  rulesPlanner: RecommendationPlanner,
): VerifiedRecommendationPlanner {
  return {
    async plan(input) {
      const geminiResult = await geminiPlanner.plan(input);
      const deterministicRecommendation = rulesPlanner.plan(input);

      if (geminiResult.status === "fallback") {
        return {
          finalRecommendation: deterministicRecommendation,
          geminiRecommendation: null,
          deterministicRecommendation,
          exactMatch: false,
          selectedSource: "rules",
          fallbackReason: geminiResult.reason,
          model: geminiResult.model,
          promptVersion: geminiResult.promptVersion,
        };
      }

      const exactMatch =
        canonicalize(geminiResult.recommendation) === canonicalize(deterministicRecommendation);
      return {
        finalRecommendation: exactMatch ? geminiResult.recommendation : deterministicRecommendation,
        geminiRecommendation: geminiResult.recommendation,
        deterministicRecommendation,
        exactMatch,
        selectedSource: exactMatch ? "gemini" : "rules",
        fallbackReason: exactMatch ? null : "mismatch",
        model: geminiResult.model,
        promptVersion: geminiResult.promptVersion,
      };
    },
  };
}

function canonicalize(value: unknown): string {
  return JSON.stringify(sortObjectKeys(value));
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, sortObjectKeys(nestedValue)]),
    );
  }
  return value;
}
