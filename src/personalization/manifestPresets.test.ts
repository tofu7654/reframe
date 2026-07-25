import { describe, expect, it } from "vitest";
import { isValidManifest } from "@/registry/catalog";
import { MANIFEST_PRESETS, getManifestPreset } from "./manifestPresets";

describe("manifest presets", () => {
  it("provides four distinct, valid end-state manifests", () => {
    expect(MANIFEST_PRESETS).toHaveLength(4);
    expect(new Set(MANIFEST_PRESETS.map((preset) => preset.id)).size).toBe(4);

    for (const preset of MANIFEST_PRESETS) {
      expect(isValidManifest(preset.manifest), preset.id).toBe(true);
    }
  });

  it("explains the evidence and personalized value of every preset", () => {
    for (const preset of MANIFEST_PRESETS) {
      expect(preset.recommendationCopy.length).toBeGreaterThan(80);
      expect(preset.evidenceExamples.length).toBeGreaterThanOrEqual(3);
      expect(preset.personalizedValue.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("returns a preset by its stable identifier", () => {
    expect(getManifestPreset("talent-scout-workspace").title).toBe("Your Talent Scout Workspace");
  });

  it("uses Home as a personalized workspace instead of only rearranging existing pages", () => {
    expect(getManifestPreset("job-search-command-center").manifest.slots.homeMain[0]).toBe(
      "jobDiscoveryHub",
    );
    expect(getManifestPreset("job-search-command-center").manifest.slots.homeLeftRail).toEqual([
      "savedJobs",
    ]);
    expect(getManifestPreset("job-search-command-center").manifest.slots.homeMain).not.toContain(
      "savedJobs",
    );
    expect(getManifestPreset("application-momentum").manifest.slots.homeMain).toContain(
      "applicationTracker",
    );
    expect(getManifestPreset("creator-relationship-hub").manifest.slots.homeMain[0]).toBe(
      "creatorCommandCenter",
    );
    expect(getManifestPreset("talent-scout-workspace").manifest.slots.homeMain).toContain(
      "talentPipeline",
    );
  });
});
