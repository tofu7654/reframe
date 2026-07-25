import {
  MANIFEST_SCHEMA_VERSION,
  type ComponentId,
  type HomeSlotId,
  type NavItemId,
  type UIManifest,
} from "@/contracts/personalization";

export const ALLOWED_COMPONENTS_BY_SLOT: Record<HomeSlotId, readonly ComponentId[]> = {
  homeMain: ["feed", "savedJobs", "appliedCompanyConnections", "postEngagers"],
  homeRightRail: ["applicationTracker", "rightSidebar"],
};

export const NAV_ITEM_IDS = [
  "home",
  "network",
  "jobs",
  "messaging",
  "notifications",
] as const satisfies readonly NavItemId[];

export const DEFAULT_MANIFEST: UIManifest = {
  schemaVersion: MANIFEST_SCHEMA_VERSION,
  revision: 0,
  navigation: [...NAV_ITEM_IDS],
  slots: {
    homeMain: ["feed"],
    homeRightRail: ["rightSidebar"],
  },
};

export function isValidManifest(value: unknown): value is UIManifest {
  if (!isRecord(value) || value.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    return false;
  }

  const manifestKeys = Object.keys(value).sort();
  if (
    manifestKeys.length !== 4 ||
    !["navigation", "revision", "schemaVersion", "slots"].every((key) => manifestKeys.includes(key))
  ) {
    return false;
  }

  if (!Number.isInteger(value.revision) || (value.revision as number) < 0) {
    return false;
  }

  if (!Array.isArray(value.navigation) || !hasUniqueAllowedValues(value.navigation, NAV_ITEM_IDS)) {
    return false;
  }

  if (!isRecord(value.slots)) {
    return false;
  }

  const slots = value.slots;
  const slotIds = Object.keys(ALLOWED_COMPONENTS_BY_SLOT) as HomeSlotId[];
  if (
    Object.keys(slots).length !== slotIds.length ||
    !slotIds.every((slot) => Object.hasOwn(slots, slot))
  ) {
    return false;
  }

  return slotIds.every((slot) => {
    const components = slots[slot];
    return (
      Array.isArray(components) &&
      hasUniqueAllowedValues(components, ALLOWED_COMPONENTS_BY_SLOT[slot])
    );
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasUniqueAllowedValues(
  values: unknown[],
  allowedValues: readonly string[],
): values is string[] {
  return (
    new Set(values).size === values.length &&
    values.every((value) => typeof value === "string" && allowedValues.includes(value))
  );
}
