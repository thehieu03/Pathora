import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("Tour discovery custom request CTA", () => {
  it("uses custom tour request route and is visible on desktop", () => {
    const source = readFile("src/components/partials/tours/TourDiscoveryPage.tsx");

    expect(source).toContain('href="/custom-tour-request"');
    expect(source).toContain("prefetch={false}");

    const ctaClassMatch = source.match(
      /const\s+CustomizeTourCTA\s*=\s*\(\)\s*=>\s*\{[\s\S]*?<Link[\s\S]*?className="([^"]+)"/,
    );

    expect(ctaClassMatch?.[1]).toBeDefined();
    expect(ctaClassMatch?.[1]).not.toContain("lg:hidden");
  });
});
