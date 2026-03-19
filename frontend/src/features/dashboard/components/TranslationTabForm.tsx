"use client";

import { useState } from "react";

export type Language = "vi" | "en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslationRecord = Record<string, any>;

export interface TranslationTabFormProps {
  translations?: TranslationRecord;
  onChange?: (translations: TranslationRecord) => void;
}

const languageLabels: Record<Language, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export function TranslationTabForm({ translations = {}, onChange }: TranslationTabFormProps) {
  const [activeTab, setActiveTab] = useState<Language>("vi");

  const handleChange = (field: string, value: string) => {
    const currentTranslations = { ...translations };
    if (!currentTranslations[activeTab]) {
      currentTranslations[activeTab] = {};
    }
    currentTranslations[activeTab] = {
      ...currentTranslations[activeTab],
      [field]: value,
    };
    onChange?.(currentTranslations);
  };

  const currentFields = translations[activeTab] || {};

  return (
    <div className="space-y-4">
      {/* Language Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {(Object.keys(languageLabels) as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === lang
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </nav>
      </div>

      {/* Translation Fields */}
      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name ({languageLabels[activeTab]})
          </label>
          <input
            type="text"
            value={currentFields.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={activeTab === "vi" ? "Nhập tên chính sách" : "Enter policy name"}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description ({languageLabels[activeTab]})
          </label>
          <textarea
            value={currentFields.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder={activeTab === "vi" ? "Nhập mô tả" : "Enter description"}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
