import { RotateCcw, TestTube2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalization } from "@/personalization/PersonalizationContext";

export function DevelopmentPanel() {
  const {
    manifest,
    suppressedRecommendationIds,
    canRevert,
    isPlanningRecommendation,
    latestPlannerComparison,
    seedScenario,
    revert,
    restoreDefaults,
    resetAll,
  } = usePersonalization();

  if (!import.meta.env.DEV) {
    return (
      <Button
        className="fixed bottom-4 left-4 z-40 shadow-lg"
        variant="secondary"
        onClick={resetAll}
      >
        <RotateCcw className="h-4 w-4" />
        Reset to default
      </Button>
    );
  }

  return (
    <details className="fixed bottom-4 left-4 z-40 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-dashed border-primary/40 bg-background/95 shadow-lg backdrop-blur">
      <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold text-primary">
        <span className="inline-flex items-center gap-2">
          <TestTube2 className="h-4 w-4" />
          Personalization development
        </span>
      </summary>
      <div className="space-y-3 border-t border-border p-3">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedScenario("job_application_submitted", 1, "platform-stripe")}
          >
            Seed application
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedScenario("job_application_started", 1, "sre-amazon")}
          >
            Seed unfinished application
          </Button>
          <Button variant="outline" size="sm" onClick={() => seedScenario("job_saved", 3)}>
            Seed 3 saved jobs
          </Button>
          <Button variant="outline" size="sm" onClick={() => seedScenario("jobs_route_visited", 3)}>
            Seed 3 jobs visits
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedScenario("post_engagement_received", 1, "demo-post")}
          >
            Seed post engagement
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={revert} disabled={!canRevert}>
            <RotateCcw className="h-4 w-4" />
            Revert
          </Button>
          <Button variant="secondary" size="sm" onClick={restoreDefaults}>
            Restore defaults
          </Button>
          <Button variant="destructive" size="sm" onClick={resetAll}>
            <Trash2 className="h-4 w-4" />
            Reset local data
          </Button>
        </div>
        <div className="rounded bg-muted p-2">
          <p className="text-[11px] font-medium">Manifest</p>
          <pre className="mt-1 max-h-48 overflow-auto text-[10px] leading-relaxed">
            {JSON.stringify(manifest, null, 2)}
          </pre>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Suppressed: {suppressedRecommendationIds.join(", ") || "none"}
          </p>
        </div>
        <div className="rounded bg-muted p-2">
          <p className="text-[11px] font-medium">Gemini rule comparison</p>
          {isPlanningRecommendation ? (
            <p className="mt-1 text-[10px] text-muted-foreground">Comparing Gemini with rules…</p>
          ) : latestPlannerComparison ? (
            <>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                Model: {latestPlannerComparison.model} · Prompt:{" "}
                {latestPlannerComparison.promptVersion}
                <br />
                Exact match: {latestPlannerComparison.exactMatch ? "yes" : "no"} · Using:{" "}
                {latestPlannerComparison.selectedSource}
                {latestPlannerComparison.fallbackReason
                  ? ` · Reason: ${latestPlannerComparison.fallbackReason}`
                  : ""}
              </p>
              <p className="mt-2 text-[11px] font-medium">Gemini output</p>
              <pre className="mt-1 max-h-32 overflow-auto text-[10px] leading-relaxed">
                {JSON.stringify(latestPlannerComparison.geminiRecommendation, null, 2)}
              </pre>
              <p className="mt-2 text-[11px] font-medium">Rules output</p>
              <pre className="mt-1 max-h-32 overflow-auto text-[10px] leading-relaxed">
                {JSON.stringify(latestPlannerComparison.deterministicRecommendation, null, 2)}
              </pre>
            </>
          ) : (
            <p className="mt-1 text-[10px] text-muted-foreground">No comparison yet.</p>
          )}
        </div>
      </div>
    </details>
  );
}
