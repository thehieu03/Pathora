import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("component lazy loading", () => {
  it("lazy loads the calendar widget as a client-only dynamic chunk", () => {
    const source = readFile("src/components/partials/widget/CalendarView.tsx");

    expect(source.includes("import dynamic from \"next/dynamic\";")).toBe(true);
    expect(source.includes("dynamic(() => import(\"react-calendar\"), {")).toBe(
      true,
    );
    expect(source.includes("ssr: false")).toBe(true);
    expect(source.includes("animate-pulse")).toBe(true);
  });

  it("lazy loads vector map widgets with stable-size loading placeholders", () => {
    const targets = [
      "src/components/partials/widget/most-sales.tsx",
      "src/components/partials/widget/most-sales2.tsx",
    ];

    targets.forEach((filePath) => {
      const source = readFile(filePath);

      expect(source.includes("import dynamic from \"next/dynamic\";")).toBe(
        true,
      );
      expect(
        source.includes(
          "dynamic(() =>\n  import(\"@south-paw/react-vector-maps\").then((m) => m.VectorMap),",
        ),
      ).toBe(true);
      expect(source.includes("ssr: false")).toBe(true);
      expect(source.includes("dash-codevmap")).toBe(true);
      expect(source.includes("animate-pulse")).toBe(true);
    });
  });
});
