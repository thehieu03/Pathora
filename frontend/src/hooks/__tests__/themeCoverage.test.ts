import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("app theme coverage", () => {
  it("keeps dark mode classes on tours main container", () => {
    const source = readFile("src/components/partials/landing/TourDiscoveryPage.tsx");
    expect(source.includes("dark:bg-")).toBe(true);
    expect(source.includes("dark:text-")).toBe(true);
  });

  it("uses header-level dark mode toggle in landing flows", () => {
    const source = readFile("src/components/partials/landing/LandingHeader.tsx");
    expect(source.includes("useDarkmode")).toBe(true);
    expect(source.includes("Switch to dark mode")).toBe(true);
    expect(source.includes("Switch to light mode")).toBe(true);
  });
});
