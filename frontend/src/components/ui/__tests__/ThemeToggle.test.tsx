import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ThemeToggle from "../ThemeToggle";

vi.mock("@/hooks/useDarkMode", () => {
  return {
    default: () => [true, vi.fn()],
  };
});

describe("ThemeToggle", () => {
  it("renders pressed state and light-mode target label when dark mode is active", () => {
    const markup = renderToStaticMarkup(<ThemeToggle />);

    expect(markup).toContain("aria-pressed=\"true\"");
    expect(markup).toContain("Switch to light mode");
  });
});
