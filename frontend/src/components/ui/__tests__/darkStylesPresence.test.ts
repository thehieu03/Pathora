import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("dark style presence", () => {
  it("has dark styles in target ui components", () => {
    const targets = [
      "src/components/ui/Button.tsx",
      "src/components/ui/TextInput.tsx",
      "src/components/ui/Card.tsx",
      "src/components/ui/Modal.tsx",
      "src/components/ui/Dropdown.tsx",
      "src/components/skeleton/Table.tsx",
    ];

    targets.forEach((filePath) => {
      const source = readFile(filePath);
      expect(source.includes("dark:")).toBe(true);
    });
  });

  it("has dark styles in layout/navigation areas", () => {
    const targets = [
      "src/components/partials/shared/LandingHeader.tsx",
      "src/components/partials/shared/LandingFooter.tsx",
      "src/app/home/page.tsx",
    ];

    targets.forEach((filePath) => {
      const source = readFile(filePath);
      expect(source.includes("dark:")).toBe(true);
    });
  });

  it("injects theme init script before hydration in root layout", () => {
    const layoutSource = readFile("src/app/layout.tsx");

    expect(layoutSource.includes("theme-init")).toBe(true);
    expect(layoutSource.includes("buildThemeInitScript")).toBe(true);
  });
});
