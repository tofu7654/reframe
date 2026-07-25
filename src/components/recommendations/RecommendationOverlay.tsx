import { useState } from "react";
import { toast } from "sonner";
import { Eye, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalization } from "@/personalization/PersonalizationContext";
import { RecommendationPreviewDialog } from "./RecommendationPreviewDialog";

export function RecommendationOverlay() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { activeRecommendation, acceptActiveRecommendation, dismissActiveRecommendation, revert } =
    usePersonalization();

  if (!activeRecommendation) return null;

  const accept = () => {
    if (!acceptActiveRecommendation()) return;
    toast("Personalization updated", {
      description: activeRecommendation.description,
      closeButton: true,
      cancel: {
        label: "Keep changes",
        onClick: () => {},
      },
      action: {
        label: "Revert",
        onClick: revert,
      },
    });
  };

  return (
    <aside
      aria-label="Personalization recommendation"
      className="fixed bottom-5 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))] rounded-xl border border-border bg-card p-4 shadow-2xl"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Interface suggestion
              </p>
              <h2 className="mt-1 font-semibold">{activeRecommendation.title}</h2>
            </div>
            <button
              type="button"
              onClick={dismissActiveRecommendation}
              className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Dismiss recommendation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{activeRecommendation.description}</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={dismissActiveRecommendation}>
              Dismiss
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" onClick={accept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
      <RecommendationPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        recommendation={activeRecommendation}
        onAccept={accept}
      />
    </aside>
  );
}
