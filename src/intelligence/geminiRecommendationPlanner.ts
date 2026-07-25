import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { PlannerInput } from "./planner";
import { buildGeminiRulePrompt, GEMINI_RULE_PROMPT_VERSION } from "./geminiRulePrompt";
import type { GeminiPlanResult, GeminiRecommendationPlanner } from "./verifiedPlanner";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_TIMEOUT_MS = 5_000;

const recommendationSchema = z
  .object({
    id: z.enum([
      "post-engagers",
      "applied-company-connections",
      "application-tracker",
      "saved-jobs",
      "promote-jobs",
    ]),
    expectedManifestRevision: z.number().int().nonnegative(),
    title: z.string(),
    description: z.string(),
    operations: z.array(
      z.union([
        z
          .object({
            type: z.literal("add_module"),
            slot: z.enum(["homeMain", "homeRightRail", "jobsMain"]),
            componentId: z.enum([
              "feed",
              "savedJobs",
              "rightSidebar",
              "applicationTracker",
              "appliedCompanyConnections",
              "postEngagers",
            ]),
            index: z.number().int().optional(),
          })
          .strict(),
        z
          .object({
            type: z.literal("remove_module"),
            slot: z.enum(["homeMain", "homeRightRail", "jobsMain"]),
            componentId: z.enum([
              "feed",
              "savedJobs",
              "rightSidebar",
              "applicationTracker",
              "appliedCompanyConnections",
              "postEngagers",
            ]),
          })
          .strict(),
        z
          .object({
            type: z.literal("move_nav"),
            navItemId: z.enum(["home", "network", "jobs", "messaging", "notifications"]),
            afterNavItemId: z.enum(["home", "network", "jobs", "messaging", "notifications"]),
          })
          .strict(),
        z
          .object({
            type: z.literal("hide_nav"),
            navItemId: z.enum(["home", "network", "jobs", "messaging", "notifications"]),
          })
          .strict(),
        z
          .object({
            type: z.literal("show_nav"),
            navItemId: z.enum(["home", "network", "jobs", "messaging", "notifications"]),
            afterNavItemId: z
              .enum(["home", "network", "jobs", "messaging", "notifications"])
              .optional(),
          })
          .strict(),
      ]),
    ),
  })
  .strict()
  .nullable();

const RECOMMENDATION_JSON_SCHEMA = {
  anyOf: [
    { type: "null" },
    {
      type: "object",
      additionalProperties: false,
      required: ["id", "expectedManifestRevision", "title", "description", "operations"],
      properties: {
        id: {
          type: "string",
          enum: [
            "post-engagers",
            "applied-company-connections",
            "application-tracker",
            "saved-jobs",
            "promote-jobs",
          ],
        },
        expectedManifestRevision: { type: "integer", minimum: 0 },
        title: { type: "string" },
        description: { type: "string" },
        operations: { type: "array" },
      },
    },
  ],
} as const;

type GeminiRequest = (request: {
  model: string;
  prompt: string;
  signal: AbortSignal;
}) => Promise<string | undefined>;

interface GeminiRecommendationPlannerOptions {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  request?: GeminiRequest;
}

export function createGeminiRecommendationPlanner(
  options: GeminiRecommendationPlannerOptions,
): GeminiRecommendationPlanner {
  const model = options.model || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return {
    async plan(input: PlannerInput): Promise<GeminiPlanResult> {
      if (!options.apiKey) {
        return fallback("missing_api_key", model);
      }

      const controller = new AbortController();
      const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const prompt = buildGeminiRulePrompt(input);
        const responseText = await (options.request ?? createGoogleRequest(options.apiKey))({
          model,
          prompt,
          signal: controller.signal,
        });

        let parsed: unknown;
        try {
          parsed = JSON.parse(responseText ?? "");
        } catch {
          return fallback("invalid_json", model);
        }

        const recommendation = recommendationSchema.safeParse(parsed);
        if (!recommendation.success) return fallback("invalid_response", model);

        return {
          status: "ok",
          recommendation: recommendation.data,
          model,
          promptVersion: GEMINI_RULE_PROMPT_VERSION,
        };
      } catch {
        return fallback(controller.signal.aborted ? "timeout" : "provider_error", model);
      } finally {
        globalThis.clearTimeout(timeout);
      }
    },
  };
}

function createGoogleRequest(apiKey: string): GeminiRequest {
  const client = new GoogleGenAI({ apiKey });
  return async ({ model, prompt, signal }) => {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        abortSignal: signal,
        responseMimeType: "application/json",
        responseJsonSchema: RECOMMENDATION_JSON_SCHEMA,
      },
    });
    return response.text;
  };
}

function fallback(
  reason: Extract<GeminiPlanResult, { status: "fallback" }>["reason"],
  model: string,
): GeminiPlanResult {
  return {
    status: "fallback",
    reason,
    model,
    promptVersion: GEMINI_RULE_PROMPT_VERSION,
  };
}
