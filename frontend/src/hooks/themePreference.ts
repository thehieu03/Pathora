export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark";

export const parseThemePreference = (
  value: string | null,
): ThemePreference | null => {
  if (value === "dark" || value === "light") {
    return value;
  }

  return null;
};

export const getPreferredTheme = (
  storedTheme: string | null,
  prefersDark: boolean,
): ThemePreference => {
  const parsedTheme = parseThemePreference(storedTheme);
  if (parsedTheme) {
    return parsedTheme;
  }

  return prefersDark ? "dark" : "light";
};

export const getSystemPrefersDark = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const applyThemeClass = (
  theme: ThemePreference,
  rootElement: { classList: { add: (...tokens: string[]) => void; remove: (...tokens: string[]) => void } },
  bodyElement?: { classList: { add: (...tokens: string[]) => void; remove: (...tokens: string[]) => void } } | null,
): void => {
  const oppositeTheme = theme === "dark" ? "light" : "dark";

  rootElement.classList.remove(oppositeTheme);
  rootElement.classList.add(theme);

  if (bodyElement) {
    bodyElement.classList.remove(oppositeTheme);
    bodyElement.classList.add(theme);
  }
};

export const buildThemeInitScript = (): string => {
  return `(() => {
  try {
    const themeKey = "${THEME_STORAGE_KEY}";
    const storedTheme = localStorage.getItem(themeKey);
    const resolvedTheme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    if (body) {
      body.classList.remove("light", "dark");
      body.classList.add(resolvedTheme);
    }
  } catch (error) {
    // no-op
  }
})();`;
};
