"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui";
import { Transition, TransitionChild } from "@headlessui/react";
import { CustomizeBanner } from "./CustomizeBanner";

interface FilterOption {
  value: string;
  labelKey: string;
  fallback: string;
}

const CLASSIFICATION_OPTIONS: FilterOption[] = [
  {
    value: "Standard Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.standard",
    fallback: "Standard Tour",
  },
  {
    value: "Premium Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.premium",
    fallback: "Premium Tour",
  },
  {
    value: "VIP / Luxury Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.vipLuxury",
    fallback: "VIP / Luxury Tour",
  },
  {
    value: "Budget Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.budget",
    fallback: "Budget Tour",
  },
  {
    value: "Private Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.private",
    fallback: "Private Tour",
  },
  {
    value: "Group Tour",
    labelKey: "landing.tourDiscovery.classificationOptions.group",
    fallback: "Group Tour",
  },
];

const CATEGORY_OPTIONS: FilterOption[] = [
  {
    value: "Adventure Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.adventure",
    fallback: "Adventure Tour",
  },
  {
    value: "Cultural Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.cultural",
    fallback: "Cultural Tour",
  },
  {
    value: "Relaxation Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.relaxation",
    fallback: "Relaxation Tour",
  },
  {
    value: "Eco Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.eco",
    fallback: "Eco Tour",
  },
  {
    value: "Food Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.food",
    fallback: "Food Tour",
  },
  {
    value: "Religious Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.religious",
    fallback: "Religious Tour",
  },
  {
    value: "Honeymoon Tour",
    labelKey: "landing.tourDiscovery.categoryOptions.honeymoon",
    fallback: "Honeymoon Tour",
  },
];

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClassifications: string[];
  selectedCategories: string[];
  onClassificationToggle: (value: string) => void;
  onCategoryToggle: (value: string) => void;
  onClearFilters: () => void;
}

export const FilterDrawer = ({
  isOpen,
  onClose,
  selectedClassifications,
  selectedCategories,
  onClassificationToggle,
  onCategoryToggle,
  onClearFilters,
}: FilterDrawerProps) => {
  const { t } = useTranslation();

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <TransitionChild
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        </TransitionChild>

        {/* Drawer */}
        <TransitionChild
          enter="transform transition duration-300 ease-out"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition duration-200 ease-in"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Icon icon="heroicons-outline:adjustments-horizontal" className="w-5 h-5 text-gray-900" />
                <span className="text-lg font-semibold text-gray-900">
                  {t("landing.tourDiscovery.filtersLabel", "Filters")}
                </span>
              </div>
              <Button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 bg-transparent"
                icon="heroicons-outline:x"
                iconClass="w-5 h-5 text-gray-500"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Classification */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t("landing.tourDiscovery.classification", "Classification")}
                </h3>
                <div className="flex flex-col gap-2">
                  {CLASSIFICATION_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer py-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClassifications.includes(option.value)}
                        onChange={() => onClassificationToggle(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedClassifications.includes(option.value)
                            ? "border-[#fa8b02] bg-[#fa8b02]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selectedClassifications.includes(option.value) && (
                          <Icon icon="heroicons-outline:check" className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>{t(option.labelKey, option.fallback)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t("landing.tourDiscovery.category", "Category")}
                </h3>
                <div className="flex flex-col gap-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer py-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(option.value)}
                        onChange={() => onCategoryToggle(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedCategories.includes(option.value)
                            ? "border-[#fa8b02] bg-[#fa8b02]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selectedCategories.includes(option.value) && (
                          <Icon icon="heroicons-outline:check" className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>{t(option.labelKey, option.fallback)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customize Banner */}
              <div className="mt-8">
                <CustomizeBanner />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <Button
                  onClick={onClearFilters}
                  className="flex-1 py-3 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  {t("landing.tourDiscovery.clearAll", "Clear all")}
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#fa8b02] text-white rounded-lg font-medium hover:bg-[#e67a00] transition-colors"
                >
                  {t("landing.tourDiscovery.showResults", "Show Results")}
                </Button>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};
