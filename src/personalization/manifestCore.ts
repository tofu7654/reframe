import type { Recommendation, UIManifest, UIOperation } from "@/contracts/personalization";
import { ALLOWED_COMPONENTS_BY_SLOT, NAV_ITEM_IDS, isValidManifest } from "@/registry/catalog";
import { getManifestPreset } from "./manifestPresets";

export type ApplyRecommendationResult =
  | { ok: true; manifest: UIManifest }
  | {
      ok: false;
      manifest: UIManifest;
      reason: "stale_manifest" | "invalid_operation";
    };

export function applyRecommendation(
  manifest: UIManifest,
  recommendation: Recommendation,
): ApplyRecommendationResult {
  if (recommendation.expectedManifestRevision !== manifest.revision) {
    return { ok: false, manifest, reason: "stale_manifest" };
  }

  const manifestOperations = recommendation.operations.filter(
    (operation) => operation.type === "apply_manifest",
  );
  if (manifestOperations.length > 0) {
    if (
      recommendation.operations.length !== 1 ||
      recommendation.id !== manifestOperations[0].manifestId
    ) {
      return { ok: false, manifest, reason: "invalid_operation" };
    }
    const preset = getManifestPreset(manifestOperations[0].manifestId);
    const nextManifest = {
      ...structuredClone(preset.manifest),
      revision: manifest.revision + 1,
    };
    return isValidManifest(nextManifest)
      ? { ok: true, manifest: nextManifest }
      : { ok: false, manifest, reason: "invalid_operation" };
  }

  if (!recommendation.operations.every((operation) => isAllowedOperation(manifest, operation))) {
    return { ok: false, manifest, reason: "invalid_operation" };
  }

  const nextManifest = structuredClone(manifest);

  for (const operation of recommendation.operations) {
    applyOperation(nextManifest, operation);
  }

  nextManifest.revision += 1;

  if (!isValidManifest(nextManifest)) {
    return { ok: false, manifest, reason: "invalid_operation" };
  }

  return { ok: true, manifest: nextManifest };
}

function isAllowedOperation(manifest: UIManifest, operation: UIOperation): boolean {
  switch (operation.type) {
    case "add_module": {
      const components = manifest.slots[operation.slot];
      const validIndex =
        operation.index === undefined ||
        (Number.isInteger(operation.index) &&
          operation.index >= 0 &&
          operation.index <= components.length);
      return (
        ALLOWED_COMPONENTS_BY_SLOT[operation.slot].includes(operation.componentId) && validIndex
      );
    }
    case "remove_module":
      return ALLOWED_COMPONENTS_BY_SLOT[operation.slot].includes(operation.componentId);
    case "move_nav":
      return (
        operation.navItemId !== operation.afterNavItemId &&
        manifest.navigation.includes(operation.navItemId) &&
        manifest.navigation.includes(operation.afterNavItemId)
      );
    case "hide_nav":
      return manifest.navigation.includes(operation.navItemId);
    case "show_nav":
      return (
        NAV_ITEM_IDS.includes(operation.navItemId) &&
        !manifest.navigation.includes(operation.navItemId) &&
        (operation.afterNavItemId === undefined ||
          manifest.navigation.includes(operation.afterNavItemId))
      );
    case "apply_manifest":
      return false;
  }
}

function applyOperation(manifest: UIManifest, operation: UIOperation): void {
  switch (operation.type) {
    case "add_module": {
      const components = manifest.slots[operation.slot];
      if (components.includes(operation.componentId)) return;
      const index = Math.min(operation.index ?? components.length, components.length);
      components.splice(index, 0, operation.componentId);
      return;
    }
    case "remove_module":
      manifest.slots[operation.slot] = manifest.slots[operation.slot].filter(
        (componentId) => componentId !== operation.componentId,
      );
      return;
    case "move_nav": {
      manifest.navigation = manifest.navigation.filter(
        (navItemId) => navItemId !== operation.navItemId,
      );
      const targetIndex = manifest.navigation.indexOf(operation.afterNavItemId);
      manifest.navigation.splice(targetIndex + 1, 0, operation.navItemId);
      return;
    }
    case "hide_nav":
      manifest.navigation = manifest.navigation.filter(
        (navItemId) => navItemId !== operation.navItemId,
      );
      return;
    case "show_nav": {
      if (manifest.navigation.includes(operation.navItemId)) return;
      const targetIndex = operation.afterNavItemId
        ? manifest.navigation.indexOf(operation.afterNavItemId)
        : manifest.navigation.length - 1;
      manifest.navigation.splice(targetIndex + 1, 0, operation.navItemId);
      return;
    }
    case "apply_manifest":
      return;
  }
}
