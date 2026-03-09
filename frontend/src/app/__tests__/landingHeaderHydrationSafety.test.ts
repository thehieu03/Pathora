import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("landing header hydration safety", () => {
  it("uses deterministic fallback auth labels before mount", () => {
    const source = readFile("src/components/partials/shared/LandingHeader.tsx");

    expect(source.includes('text={mounted ? t("common.signIn") : "Sign In"}')).toBe(
      true,
    );
    expect(source.includes('text={mounted ? t("common.signUp") : "Sign Up"}')).toBe(
      true,
    );
  });
});
