"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui";
import { CustomizeBanner } from "./CustomizeBanner";

interface FilterOption {
  value: string;
  labelKey: string;
  fallback: string;
}

// Filter options
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

interface FilterSidebarProps {
  selectedClassifications: string[];
  selectedCategories: string[];
  onClassificationToggle: (value: string) => void;
  onCategoryToggle: (value: string) => void;
  onClearFilters: () => void;
}

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 hover:bg-transparent"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <Icon
          icon={isOpen ? "heroicons-outline:chevron-up" : "heroicons-outline:chevron-down"}
          className="w-4 h-4 text-gray-500"
        />
      </Button>
      {isOpen && <div className="pb-1">{children}</div>}
    </div>
  );
};

const FilterCheckboxList = ({
  options,
  selected,
  onToggle,
  getLabel,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (optionValue: string) => void;
  getLabel: (key: string, fallback: string) => string;
}) => (
  <div className="flex flex-col gap-2">
    {options.map((option) => (
      <label
        key={option.value}
        className="flex items-center gap-3 cursor-pointer py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        {/* Native checkbox with custom styling */}
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={() => onToggle(option.value)}
          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white cursor-pointer relative
            checked:bg-[#fa8b02] checked:border-[#fa8b02]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa8b02]
            transition-colors duration-200
            checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:items-center checked:before:justify-center
            before:content-['']"
          style={{
            // Use pseudo-element for checkmark via inline SVG background
            backgroundImage: selected.includes(option.value)
              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 6l3 3 5-5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
              : "none",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "12px",
          }}
        />
        <span>{getLabel(option.labelKey, option.fallback)}</span>
      </label>
    ))}
  </div>
);

export const FilterSidebar = ({
  selectedClassifications,
  selectedCategories,
  onClassificationToggle,
  onCategoryToggle,
  onClearFilters,
}: FilterSidebarProps) => {
  const { t } = useTranslation();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const safeT = (key: string, fallback: string) => {
    return mounted ? t(key, fallback) : fallback;
  };

  const hasActiveFilters =
    selectedClassifications.length > 0 || selectedCategories.length > 0;

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
        {/* Filter Header */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons-outline:adjustments-horizontal" className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">
              {safeT("landing.tourDiscovery.filter", "Filter")}
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-[#fa8b02] hover:text-[#e67a00] font-medium transition-colors"
            >
              {safeT("landing.tourDiscovery.clearAll", "Clear all")}
            </button>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 pb-4 mb-4">
            {selectedClassifications.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => onClassificationToggle(cls)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-[#fa8b02] text-xs rounded-full hover:bg-orange-100 transition-colors"
              >
                {cls}
                <Icon icon="heroicons-outline:x-mark" className="w-3 h-3" />
              </button>
            ))}
            {selectedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryToggle(cat)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-[#fa8b02] text-xs rounded-full hover:bg-orange-100 transition-colors"
              >
                {cat}
                <Icon icon="heroicons-outline:x-mark" className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        {/* Classification Filter */}
        <FilterSection title={safeT("landing.tourDiscovery.classification", "Classification")}>
          <FilterCheckboxList
            options={CLASSIFICATION_OPTIONS}
            selected={selectedClassifications}
            onToggle={onClassificationToggle}
            getLabel={safeT}
          />
        </FilterSection>

        {/* Category Filter */}
        <FilterSection title={safeT("landing.tourDiscovery.category", "Category")}>
          <FilterCheckboxList
            options={CATEGORY_OPTIONS}
            selected={selectedCategories}
            onToggle={onCategoryToggle}
            getLabel={safeT}
          />
        </FilterSection>

        {/* Customize Banner */}
        <div className="mt-6">
          <CustomizeBanner />
        </div>
      </div>
    </aside>
  );
};
