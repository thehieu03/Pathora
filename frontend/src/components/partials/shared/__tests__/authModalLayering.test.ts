import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("AuthModal layering", () => {
  it("uses a valid high z-index utility class", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/partials/shared/AuthModal.tsx"),
      "utf8",
    );

    expect(source).toContain("fixed inset-0 z-[200] flex items-center justify-center");
    expect(source).not.toContain("fixed inset-0 z-200 flex items-center justify-center");
  });
});
