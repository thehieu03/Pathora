import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("CustomTourRequestPage layout", () => {
  it("uses solid landing header to avoid hero overlap", () => {
    const source = readFile(
      "src/components/partials/custom-tour-request/CustomTourRequestPage.tsx",
    );

    expect(source).toContain("<LandingHeader variant=\"solid\" />");
  });
});
