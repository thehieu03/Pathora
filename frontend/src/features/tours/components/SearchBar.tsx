"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui";

interface SearchBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onFilterToggle?: () => void;
  showFilterButton?: boolean;
}

export const SearchBar = ({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onFilterToggle,
  showFilterButton = true,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const safeT = (key: string, fallback: string) => {
    return mounted ? t(key, fallback) : fallback;
  };

  return (
    <div className="bg-white border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
          >
            <Icon
              icon="heroicons-outline:search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <TextInput
              type="text"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={safeT("landing.tourDiscovery.searchFullPlaceholder", "Search tours, destinations, activities...")}
              className="!h-12 !bg-gray-50 !border-gray-200 !rounded-xl !pl-12 !pr-4 !text-sm !text-gray-900 placeholder:!text-gray-400 focus:!ring-[#fa8b02]/20 focus:!border-[#fa8b02] transition-colors"
            />
          </form>

          {/* Filter Button (Mobile) */}
          {showFilterButton && (
            <Button
              type="button"
              onClick={onFilterToggle}
              className="lg:hidden flex items-center gap-2 h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
            >
              <Icon icon="heroicons-outline:adjustments-horizontal" className="w-5 h-5" />
              <span>{safeT("landing.tourDiscovery.filtersLabel", "Filters")}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
