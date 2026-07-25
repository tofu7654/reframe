import type { HomeSlotId } from "@/contracts/personalization";
import { usePersonalization } from "@/personalization/PersonalizationContext";
import { COMPONENT_REGISTRY } from "./componentRegistry";

export function RenderHomeSlot({ slot }: { slot: HomeSlotId }) {
  const { manifest } = usePersonalization();

  return (
    <div className="space-y-2">
      {manifest.slots[slot].map((componentId) => {
        const Component = COMPONENT_REGISTRY[componentId];
        return <Component key={componentId} />;
      })}
    </div>
  );
}
