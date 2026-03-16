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
  void storedTheme;
  void prefersDark;
  return "light";
};

export const getSystemPrefersDark = (): boolean => {
  return false;
};

export const applyThemeClass = (
  theme: ThemePreference,
  rootElement: {
    classList: {
      add: (...tokens: string[]) => void;
      remove: (...tokens: string[]) => void;
    };
  },
  bodyElement?: {
    classList: {
      add: (...tokens: string[]) => void;
      remove: (...tokens: string[]) => void;
    };
  } | null,
): void => {
  void theme;
  const forcedTheme: ThemePreference = "light";

  rootElement.classList.remove("light", "dark");
  rootElement.classList.add(forcedTheme);

  if (bodyElement) {
    bodyElement.classList.remove("light", "dark");
    bodyElement.classList.add(forcedTheme);
  }
};

export const buildThemeInitScript = (): string => {
  return `(() => {
  try {
    const forcedTheme = "light";
    const root = document.documentElement;
    const body = document.body;

    localStorage.setItem("${THEME_STORAGE_KEY}", forcedTheme);
    localStorage.setItem("darkMode", "false");

    root.classList.remove("light", "dark");
    root.classList.add(forcedTheme);
    if (body) {
      body.classList.remove("light", "dark");
      body.classList.add(forcedTheme);
    }
  } catch (error) {
    // no-op
  }
})();`;
};
