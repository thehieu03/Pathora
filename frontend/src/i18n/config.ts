import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import viTranslations from "./locales/vi.json";

const SUPPORTED_LANGUAGES = ["en", "vi"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const normalizeLanguageCode = (value?: string): SupportedLanguage => {
  if (!value) return "en";
  const normalized = value.toLowerCase().split("-")[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(normalized)
    ? (normalized as SupportedLanguage)
    : "en";
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
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LANGUAGES],
  nonExplicitSupportedLngs: true,
  load: "languageOnly",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  lng: normalizeLanguageCode(
    typeof window !== "undefined"
      ? (localStorage.getItem("i18nextLng") ?? navigator.language)
      : "en",
  ),
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng",
  },
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
  i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);
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

export default i18n;
