import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("language-aware content refetch", () => {
  it("refetches home tour sections when language changes", () => {
    const latestTours = readFile("src/components/partials/home/LatestToursSection.tsx");
    const featuredTours = readFile("src/components/partials/home/FeaturedTripsSection.tsx");

    expect(
      latestTours.includes("const languageKey = i18n.resolvedLanguage || i18n.language"),
    ).toBe(true);
    expect(
      latestTours.includes("}, [languageKey]);"),
    ).toBe(true);

    expect(
      featuredTours.includes("const languageKey = i18n.resolvedLanguage || i18n.language"),
    ).toBe(true);
    expect(
      featuredTours.includes("}, [languageKey]);"),
    ).toBe(true);
  });

  it("refetches tour listing and detail when language changes", () => {
    const discovery = readFile("src/components/partials/tours/TourDiscoveryPage.tsx");
    const detail = readFile("src/components/partials/tours/TourDetailPage.tsx");

    expect(
      discovery.includes("const languageKey = i18n.resolvedLanguage || i18n.language"),
    ).toBe(true);
    expect(discovery.includes("[t, languageKey],")).toBe(true);

    expect(
      detail.includes("const languageKey = i18n.resolvedLanguage || i18n.language"),
    ).toBe(true);
    expect(detail.includes("}, [tourId, fetchKey, languageKey]);")).toBe(true);
  });
});
