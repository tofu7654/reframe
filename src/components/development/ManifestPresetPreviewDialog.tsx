import { useState } from "react";
import { BriefcaseBusiness, Home } from "lucide-react";
import type { ComponentId } from "@/contracts/personalization";
import type { ManifestPresetId } from "@/personalization/manifestPresets";
import { getManifestPreset } from "@/personalization/manifestPresets";
import { PreviewModeContext } from "@/personalization/PreviewModeContext";
import { COMPONENT_REGISTRY } from "@/components/personalization/componentRegistry";
import { NAV_REGISTRY } from "@/components/nav/navRegistry";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PreviewSurface = "home" | "jobs";

export function ManifestPresetPreviewDialog({
  presetId,
  onClose,
  onApply,
}: {
  presetId: ManifestPresetId | null;
  onClose: () => void;
  onApply: (presetId: ManifestPresetId) => boolean;
}) {
  const [surface, setSurface] = useState<PreviewSurface>("home");
  if (!presetId) return null;

  const preset = getManifestPreset(presetId);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[94vh] max-w-6xl overflow-y-auto p-0">
        <DialogHeader className="border-b border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Manifest preview · Review before applying
          </p>
          <DialogTitle>{preset.title}</DialogTitle>
          <DialogDescription>{preset.recommendationCopy}</DialogDescription>
        </DialogHeader>

        <PreviewModeContext.Provider value>
          <div className="border-b border-border bg-card px-5">
            <div className="flex min-w-max items-center justify-center gap-6">
              {preset.manifest.navigation.map((navItemId) => {
                const item = NAV_REGISTRY[navItemId];
                const Icon = item.icon;
                return (
                  <div
                    key={navItemId}
                    className="flex flex-col items-center gap-1 border-b-2 border-transparent px-1 py-3 text-xs text-muted-foreground first:border-primary first:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 border-b border-border px-5 py-3">
            <Button
              size="sm"
              variant={surface === "home" ? "default" : "outline"}
              onClick={() => setSurface("home")}
            >
              <Home className="h-4 w-4" />
              Home preview
            </Button>
            <Button
              size="sm"
              variant={surface === "jobs" ? "default" : "outline"}
              onClick={() => setSurface("jobs")}
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Jobs preview
            </Button>
          </div>

          {surface === "home" ? (
            <HomePreview presetId={presetId} />
          ) : (
            <JobsPreview presetId={presetId} />
          )}

          <DialogFooter className="border-t border-border p-4">
            <Button variant="outline" onClick={onClose}>
              Close preview
            </Button>
            <Button
              onClick={() => {
                if (onApply(presetId)) onClose();
              }}
            >
              Apply manifest
            </Button>
          </DialogFooter>
        </PreviewModeContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

function HomePreview({ presetId }: { presetId: ManifestPresetId }) {
  const manifest = getManifestPreset(presetId).manifest;
  return (
    <div className="pointer-events-none grid gap-4 bg-muted/30 p-5 lg:grid-cols-[220px_1fr_280px]">
      <PreviewSlot componentIds={manifest.slots.homeLeftRail} />
      <PreviewSlot componentIds={manifest.slots.homeMain} />
      <PreviewSlot componentIds={manifest.slots.homeRightRail} />
    </div>
  );
}

function JobsPreview({ presetId }: { presetId: ManifestPresetId }) {
  const componentIds = getManifestPreset(presetId).manifest.slots.jobsMain;
  return (
    <div className="pointer-events-none space-y-4 bg-muted/30 p-5">
      <PreviewSlot componentIds={componentIds} />
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <p className="font-semibold">Existing Jobs results</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The standard search results continue here beneath personalized modules.
        </p>
      </div>
    </div>
  );
}

function PreviewSlot({ componentIds }: { componentIds: ComponentId[] }) {
  if (componentIds.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No personalized modules on this surface.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {componentIds.map((componentId) => {
        const Component = COMPONENT_REGISTRY[componentId];
        return <Component key={componentId} />;
      })}
    </div>
  );
}
