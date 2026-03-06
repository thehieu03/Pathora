import { describe, expect, it } from "vitest";

import {
  getCurrentApiLanguage,
  normalizeLanguageForApi,
} from "../languageHeader";

describe("languageHeader", () => {
  it("normalizes complex language tags to en/vi", () => {
    expect(normalizeLanguageForApi("en-US")).toBe("en");
    expect(normalizeLanguageForApi("vi-VN")).toBe("vi");
  });

  it("falls back to vi for unsupported or empty languages", () => {
    expect(normalizeLanguageForApi("fr-FR")).toBe("vi");
    expect(normalizeLanguageForApi("")).toBe("vi");
    expect(normalizeLanguageForApi(undefined)).toBe("vi");
  });

  it("returns currently normalized i18n language", () => {
    expect(getCurrentApiLanguage("en-US")).toBe("en");
    expect(getCurrentApiLanguage("fr-FR")).toBe("vi");
  });
});
