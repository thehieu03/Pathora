import { describe, expect, it } from "vitest";

import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  buildThemeInitScript,
  getPreferredTheme,
  parseThemePreference,
} from "../themePreference";

describe("themePreference", () => {
  it("parses stored theme values safely", () => {
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("invalid")).toBeNull();
    expect(parseThemePreference(null)).toBeNull();
  });

  it("always resolves to light theme", () => {
    expect(getPreferredTheme("light", true)).toBe("light");
    expect(getPreferredTheme("dark", true)).toBe("light");
    expect(getPreferredTheme(null, true)).toBe("light");
    expect(getPreferredTheme(null, false)).toBe("light");
  });

  it("applies light class to root and body element", () => {
    const rootClassSet = new Set<string>();
    const bodyClassSet = new Set<string>();

    const root = {
      classList: {
        add: (...names: string[]) => names.forEach((name) => rootClassSet.add(name)),
        remove: (...names: string[]) =>
          names.forEach((name) => rootClassSet.delete(name)),
      },
    };
    const body = {
      classList: {
        add: (...names: string[]) => names.forEach((name) => bodyClassSet.add(name)),
        remove: (...names: string[]) =>
          names.forEach((name) => bodyClassSet.delete(name)),
      },
    };

    applyThemeClass("dark", root as never, body as never);

    expect(rootClassSet.has("dark")).toBe(false);
    expect(rootClassSet.has("light")).toBe(true);
    expect(bodyClassSet.has("dark")).toBe(false);
    expect(bodyClassSet.has("light")).toBe(true);
  });

  it("builds pre-hydration script with forced light theme", () => {
    const script = buildThemeInitScript();

    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain("forcedTheme = \"light\"");
    expect(script).toContain("localStorage.setItem");
    expect(script).toContain("document.documentElement");
  });
});
