import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("app theme coverage", () => {
  it("keeps explicit light mode classes on tours main container", () => {
    const source = readFile(
      "src/components/partials/tours/TourDiscoveryPage.tsx",
    );
    expect(source.includes("bg-white")).toBe(true);
    expect(source.includes("text-[#05073c]")).toBe(true);
  });

  it("does not include dark mode toggle wiring in landing header", () => {
    const source = readFile("src/components/partials/shared/LandingHeader.tsx");
    expect(source.includes("useDarkmode")).toBe(false);
    expect(source.includes("ThemeToggle")).toBe(false);
  });
});
