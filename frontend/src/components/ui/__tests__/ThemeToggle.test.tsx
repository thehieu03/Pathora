import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ThemeToggle from "../ThemeToggle";

describe("ThemeToggle", () => {
  it("renders nothing when theme toggle is disabled", () => {
    const markup = renderToStaticMarkup(<ThemeToggle />);

    expect(markup).toBe("");
  });
});
