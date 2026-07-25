import type { JobsSlotId } from "@/contracts/personalization";
import { usePersonalization } from "@/personalization/PersonalizationContext";
import { COMPONENT_REGISTRY } from "./componentRegistry";

export function RenderJobsSlot({ slot }: { slot: JobsSlotId }) {
  const { manifest } = usePersonalization();
  const componentIds = manifest.slots[slot];

  if (componentIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {componentIds.map((componentId) => {
        const Component = COMPONENT_REGISTRY[componentId];
        return <Component key={componentId} />;
      })}
    </div>
  );
}
