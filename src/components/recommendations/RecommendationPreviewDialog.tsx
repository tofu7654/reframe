import { useMemo } from "react";
import { ArrowRight, Eye } from "lucide-react";
import type { Recommendation } from "@/contracts/personalization";
import { applyRecommendation } from "@/personalization/manifestCore";
import { usePersonalization } from "@/personalization/PersonalizationContext";
import { COMPONENT_REGISTRY } from "@/components/personalization/componentRegistry";
import { NAV_REGISTRY } from "@/components/nav/navRegistry";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RecommendationPreviewDialog({
  open,
  onOpenChange,
  recommendation,
  onAccept,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: Recommendation;
  onAccept: () => void;
}) {
  const { manifest } = usePersonalization();
  const previewResult = useMemo(
    () => applyRecommendation(manifest, recommendation),
    [manifest, recommendation],
  );
  const addedModules = recommendation.operations.filter(
    (operation) => operation.type === "add_module",
  );

  const accept = () => {
    onOpenChange(false);
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Preview only</span>
          </div>
          <DialogTitle>{recommendation.title}</DialogTitle>
          <DialogDescription>
            Nothing has changed yet. Review how this suggestion would affect your interface before
            accepting it.
          </DialogDescription>
        </DialogHeader>

        {previewResult.ok ? (
          <div className="space-y-5">
            {addedModules.map((operation) => {
              const Component = COMPONENT_REGISTRY[operation.componentId];
              const location = operation.slot === "homeMain" ? "Home feed" : "Home right sidebar";
              return (
                <section key={`${operation.slot}-${operation.componentId}`} className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Proposed module · {location}
                  </p>
                  <div
                    className="pointer-events-none rounded-xl border-2 border-dashed border-primary/40 bg-muted/20 p-3"
                    aria-label={`Preview of ${recommendation.title}`}
                  >
                    <Component />
                  </div>
                </section>
              );
            })}

            {recommendation.operations.some((operation) => operation.type === "move_nav") ? (
              <NavigationPreview
                before={manifest.navigation}
                after={previewResult.manifest.navigation}
              />
            ) : null}

            <div className="rounded-lg bg-primary/5 p-3 text-sm">
              <span className="font-medium">Why this was suggested: </span>
              <span className="text-muted-foreground">{recommendation.description}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            This preview is no longer available because the interface changed. Close it and wait for
            an updated recommendation.
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close preview</Button>
          </DialogClose>
          <Button onClick={accept} disabled={!previewResult.ok}>
            Accept change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NavigationPreview({
  before,
  after,
}: {
  before: Array<keyof typeof NAV_REGISTRY>;
  after: Array<keyof typeof NAV_REGISTRY>;
}) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Proposed navigation order</p>
      <div className="grid items-center gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_auto_1fr]">
        <NavigationRow label="Current" items={before} />
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <NavigationRow label="Proposed" items={after} />
      </div>
    </section>
  );
}

function NavigationRow({
  label,
  items,
}: {
  label: string;
  items: Array<keyof typeof NAV_REGISTRY>;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((itemId) => (
          <span key={itemId} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
            {NAV_REGISTRY[itemId].label}
          </span>
        ))}
      </div>
    </div>
  );
}
