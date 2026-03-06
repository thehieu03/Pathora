import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("tour translation form wiring", () => {
  it("uses language tabs and sends translations payload in create page", () => {
    const source = readFile("src/app/(dashboard)/tour-management/create/page.tsx");

    expect(source.includes("LanguageTabs")).toBe(true);
    expect(source.includes("buildTourTranslationsPayload")).toBe(true);
    expect(source.includes("formData.append(\"translations\"")).toBe(true);
  });

  it("uses language tabs and sends translations payload in edit page", () => {
    const source = readFile("src/app/(dashboard)/tour-management/[id]/edit/page.tsx");

    expect(source.includes("LanguageTabs")).toBe(true);
    expect(source.includes("buildTourTranslationsPayload")).toBe(true);
    expect(source.includes("formData.append(\"translations\"")).toBe(true);
  });
});
