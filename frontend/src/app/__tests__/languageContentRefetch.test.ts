import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

const expectLanguageAwareRefetch = (source: string) => {
  expect(source).toMatch(
    /const\s+languageKey\s*=\s*i18n\.resolvedLanguage\s*\|\|\s*i18n\.language/,
  );
  expect(source).toMatch(/\[[^\]]*languageKey[^\]]*\]/);
};

describe("language-aware content refetch", () => {
  it("refetches home tour sections when language changes", () => {
    const latestTours = readFile(
      "src/components/partials/home/LatestToursSection.tsx",
    );
    const featuredTours = readFile(
      "src/components/partials/home/FeaturedTripsSection.tsx",
    );
    const destinations = readFile(
      "src/components/partials/home/DestinationsSection.tsx",
    );

    expectLanguageAwareRefetch(latestTours);
    expectLanguageAwareRefetch(featuredTours);
    expectLanguageAwareRefetch(destinations);
  });

  it("refetches tour listing and detail when language changes", () => {
    const discovery = readFile("src/components/partials/tours/TourDiscoveryPage.tsx");
    const detail = readFile("src/components/partials/tours/TourDetailPage.tsx");

    expectLanguageAwareRefetch(discovery);
    expect(discovery).toMatch(/fetchTours\([\s\S]*\);/);

    expectLanguageAwareRefetch(detail);
    expect(detail).toMatch(/\},\s*\[tourId,\s*fetchKey,\s*languageKey\]\);/);
  });

  it("refetches dashboard tour instance pages when language changes", () => {
    const list = readFile(
      "src/components/partials/dashboard/TourInstanceListPage.tsx",
    );
    const detail = readFile(
      "src/components/partials/dashboard/TourInstanceDetailPage.tsx",
    );
    const create = readFile(
      "src/components/partials/dashboard/CreateTourInstancePage.tsx",
    );

    expectLanguageAwareRefetch(list);

    expectLanguageAwareRefetch(detail);
    expect(detail).toMatch(/const\s+\{\s*t,\s*i18n\s*\}\s*=\s*useTranslation\(\)/);
    expect(detail).toMatch(/\},\s*\[id,\s*t,\s*languageKey\]\);/);

    expectLanguageAwareRefetch(create);
    expect(create).toMatch(/\},\s*\[languageKey\]\);/);
    expect(create).toMatch(/\},\s*\[selectedTourId,\s*t,\s*languageKey\]\);/);
  });
});
