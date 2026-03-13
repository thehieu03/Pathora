import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("dark style presence", () => {
  it("has theme-aware styles in core ui components", () => {
    const checks: Array<[string, string[]]> = [
      ["src/components/ui/Button.tsx", ["bg-primary", "text-primary-foreground"]],
      ["src/components/ui/TextInput.tsx", ["bg-background", "text-muted-foreground"]],
      ["src/components/ui/Card.tsx", ["bg-card", "text-card-foreground"]],
      ["src/components/ui/Modal.tsx", ["dark:bg-slate-800"]],
      ["src/components/ui/Dropdown.tsx", ["dark:bg-slate-800"]],
      ["src/components/skeleton/Table.tsx", ["dark:bg-slate-700"]],
    ];

    checks.forEach(([filePath, expectedTokens]) => {
      const source = readFile(filePath);
      expectedTokens.forEach((token) => {
        expect(source.includes(token)).toBe(true);
      });
    });
  });

  it("has dark styles in app-level layout surfaces", () => {
    const targets = [
      "src/app/(user)/home/page.tsx",
      "src/components/ui/ThemeToggle.tsx",
      "src/components/partials/tours/TourDiscoveryPage.tsx",
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
