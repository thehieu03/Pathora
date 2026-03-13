import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("language fallback contract", () => {
  it("keeps i18n fallback configured to default English locale", () => {
    const i18nConfig = readFile("src/i18n/config.ts");

    expect(i18nConfig.includes('const DEFAULT_LANGUAGE: SupportedLanguage = "en"')).toBe(true);
    expect(i18nConfig.includes("fallbackLng: DEFAULT_LANGUAGE")).toBe(true);
    expect(i18nConfig.includes('localStorage.setItem("i18nextLng", normalizedLanguage)')).toBe(true);
  });

  it("keeps critical API-backed labels resilient when locale keys are missing", () => {
    const discovery = readFile("src/components/partials/tours/TourDiscoveryPage.tsx");
    const landingHeader = readFile("src/components/partials/shared/LandingHeader.tsx");

    expect(discovery.includes('t("tourInstance.spotsLeft", "spots left")')).toBe(true);
    expect(discovery.includes('t("tourInstance.soldOut", "Sold out")')).toBe(true);
    expect(landingHeader.includes("i18n.resolvedLanguage || i18n.language || \"en\"")).toBe(true);
  });
});
