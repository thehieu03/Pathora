import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import viTranslations from "./locales/vi.json";

const SUPPORTED_LANGUAGES = ["en", "vi"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const normalizeLanguageCode = (value?: string): SupportedLanguage => {
  if (!value) return DEFAULT_LANGUAGE;
  const normalized = value.toLowerCase().split("-")[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(normalized)
    ? (normalized as SupportedLanguage)
    : DEFAULT_LANGUAGE;
};

const detectClientPreferredLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  return normalizeLanguageCode(
    localStorage.getItem("i18nextLng") ?? navigator.language,
  );
};

const resources = {
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
} as const;

const i18nConfig: InitOptions = {
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  nonExplicitSupportedLngs: true,
  load: "languageOnly",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  // Keep first server/client render deterministic to avoid hydration mismatch.
  lng: DEFAULT_LANGUAGE,
};

const syncHtmlLanguage = (language: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = normalizeLanguageCode(language);
};
const mergeResources = () => {
  SUPPORTED_LANGUAGES.forEach((language) => {
    i18n.addResourceBundle(
      language,
      "translation",
      resources[language].translation,
      true,
      true,
    );
  });
};
const handleLanguageChanged = (language: string) => {
  const normalizedLanguage = normalizeLanguageCode(language);
  syncHtmlLanguage(normalizedLanguage);
  if (typeof window !== "undefined") {
    localStorage.setItem("i18nextLng", normalizedLanguage);
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init(i18nConfig);
} else {
  // In dev HMR, i18n instance may stay alive with stale resources.
  mergeResources();
  const normalizedLanguage = normalizeLanguageCode(
    i18n.resolvedLanguage || i18n.language,
  );
  if (normalizedLanguage !== i18n.language) {
    i18n.changeLanguage(normalizedLanguage);
  }
}

syncHtmlLanguage(i18n.language || "en");
i18n.off("languageChanged", handleLanguageChanged);
i18n.on("languageChanged", handleLanguageChanged);

export const hydrateClientLanguage = () => {
  const preferredLanguage = detectClientPreferredLanguage();
  const currentLanguage = normalizeLanguageCode(
    i18n.resolvedLanguage || i18n.language,
  );

  if (preferredLanguage !== currentLanguage) {
    void i18n.changeLanguage(preferredLanguage);
    return;
  }

  syncHtmlLanguage(currentLanguage);
};

export default i18n;
