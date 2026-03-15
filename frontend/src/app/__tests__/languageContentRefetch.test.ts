import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("language-aware content refetch", () => {
  it("keeps home tour sections wired to fetch latest/featured data", () => {
    const latestTours = readFile("src/features/home/components/LatestToursSection.tsx");
    const featuredTours = readFile("src/features/home/components/FeaturedTripsSection.tsx");

    expect(latestTours.includes("homeService.getLatestTours(6)")).toBe(true);
    expect(latestTours.includes("const activeLanguage =")).toBe(true);
    expect(latestTours.includes("}, [activeLanguage]);")).toBe(true);

    expect(featuredTours.includes("homeService.getFeaturedTours(8)")).toBe(true);
    expect(featuredTours.includes("const activeLanguage =")).toBe(true);
    expect(featuredTours.includes("}, [activeLanguage]);")).toBe(true);
  });

  it("keeps tour listing/detail wired to fetch data", () => {
    const discovery = readFile("src/features/tours/components/TourDiscoveryPage.tsx");
    const detail = readFile("src/features/tours/components/TourDetailPage.tsx");

    expect(discovery.includes("parseTourDiscoveryFilters")).toBe(true);
    expect(discovery.includes("buildTourDiscoverySearchParams")).toBe(true);
    expect(discovery.includes("homeService.searchTours")).toBe(true);
    expect(discovery.includes("languageChanged")).toBe(true);
    expect(discovery.includes("language: apiLanguage")).toBe(true);
    expect(discovery.includes("getAvailablePublicInstances(")).toBe(true);
    expect(discovery.includes("apiLanguage,")).toBe(true);

    expect(detail.includes("getPublicTourDetail(")).toBe(true);
    expect(detail.includes("languageChanged")).toBe(true);
    expect(detail.includes("}, [tourId, apiLanguage]);")).toBe(true);
  });
});
