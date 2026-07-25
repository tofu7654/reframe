import { describe, expect, it } from "vitest";
import { DEFAULT_MANIFEST, isValidManifest } from "./catalog";

describe("isValidManifest", () => {
  it("rejects undeclared slots", () => {
    const manifest = {
      ...DEFAULT_MANIFEST,
      slots: {
        ...DEFAULT_MANIFEST.slots,
        arbitrarySlot: ["feed"],
      },
    };

    expect(isValidManifest(manifest)).toBe(false);
  });

  it("rejects undeclared manifest fields", () => {
    const manifest = {
      ...DEFAULT_MANIFEST,
      arbitraryCode: "alert('nope')",
    };

    expect(isValidManifest(manifest)).toBe(false);
  });

  it("rejects components assigned to the wrong slot", () => {
    const manifest = {
      ...DEFAULT_MANIFEST,
      slots: {
        ...DEFAULT_MANIFEST.slots,
        homeRightRail: ["candidateResearchQueue"],
      },
    };

    expect(isValidManifest(manifest)).toBe(false);
  });

  it("allows an application-focused workspace on Home", () => {
    const manifest = {
      ...DEFAULT_MANIFEST,
      slots: {
        ...DEFAULT_MANIFEST.slots,
        homeMain: ["applicationTracker", "appliedCompanyConnections", "feed"],
      },
    };

    expect(isValidManifest(manifest)).toBe(true);
  });
});
