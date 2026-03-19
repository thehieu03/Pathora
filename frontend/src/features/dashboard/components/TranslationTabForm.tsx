"use client";

import { useState } from "react";

export type Language = "vi" | "en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslationRecord = Record<string, any>;

export interface TranslationField {
  /** Tên field gửi lên API (phải khớp với backend DTO) */
  key: string;
  /** Nhãn hiển thị */
  label: string;
  /** Placeholder theo ngôn ngữ: { vi: "...", en: "..." } */
  placeholder: Record<Language, string>;
  /** Loại input: text hoặc textarea */
  type?: "text" | "textarea";
}

export interface translationTabFormProps {
  translations?: TranslationRecord;
  onChange?: (translations: TranslationRecord) => void;
  /** Danh sách fields cần hiển thị. Mỗi field config riêng cho từng policy. */
  fields?: TranslationField[];
}

const languageLabels: Record<Language, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

/**
 * Default fields — dùng cho PricingPolicy (name + description).
 * Giữ lại để tương thích ngược với các form chưa truyền fields prop.
 */
const defaultFields: TranslationField[] = [
  {
    key: "name",
    label: "Name",
    placeholder: {
      vi: "Nhập tên chính sách",
      en: "Enter policy name",
    },
    type: "text",
  },
  {
    key: "description",
    label: "Description",
    placeholder: {
      vi: "Nhập mô tả",
      en: "Enter description",
    },
    type: "textarea",
  },
];

export function TranslationTabForm({
  translations = {},
  onChange,
  fields = defaultFields,
}: translationTabFormProps) {
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

      {/* Translation Fields — render động theo cấu hình fields */}
      <div className="space-y-4 pt-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label} ({languageLabels[activeTab]})
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={currentFields[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder[activeTab]}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <input
                type="text"
                value={currentFields[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder[activeTab]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
