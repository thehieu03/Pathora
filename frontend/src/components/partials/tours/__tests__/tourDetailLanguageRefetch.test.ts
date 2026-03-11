import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("TourDetailPage language refetch", () => {
  it("refetches tour detail when the active language changes", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/partials/tours/TourDetailPage.tsx",
      ),
      "utf8",
    );

    expect(source).toContain("const { t, i18n } = useTranslation();");
    expect(source).toContain(
      "const languageKey = i18n.resolvedLanguage || i18n.language;",
    );
    expect(source).toContain(".getPublicTourDetail(tourId, currentLanguage)");
    expect(source).toContain("}, [tourId, fetchKey, languageKey]);");
  });
});
