"use client";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "../shared/LandingImage";
import { Icon } from "@/components/ui";
import { LandingHeader } from "../shared/LandingHeader";
import { LandingFooter } from "../shared/LandingFooter";
import { useTranslation } from "react-i18next";
import { homeService } from "@/services/homeService";
import { formatCurrency } from "@/utils/format";
import { SearchTour } from "@/types/home";
import { TourInstanceVm, TourInstanceStatusMap } from "@/types/tour";

/* ── Sample Tour Data — replaced by API ───────────────────── */
const PAGE_SIZE = 12;

/* ── Filter Data ───────────────────────────────────────────── */
const CLASSIFICATION_OPTIONS = [
  "Standard Tour",
  "Premium Tour",
  "VIP / Luxury Tour",
  "Budget Tour",
  "Private Tour",
  "Group Tour",
];

const CATEGORY_OPTIONS = [
  "Adventure Tour",
  "Cultural Tour",
  "Relaxation Tour",
  "Eco Tour",
  "Food Tour",
  "Religious Tour",
  "Honeymoon Tour",
];

const DURATION_OPTIONS = [
  "One-day Tour",
  "1-3 Days Tour",
  "4-7 Days Tour",
  "7-15 Days Tour",
  "> 15 Days Tour",
];

const PRICE_QUICK_FILTERS = ["< 2tr", "2tr–5tr", "5tr–15tr", "15tr+"];

/* ── Hero Banner ───────────────────────────────────────────── */
const HeroBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      {/* Gradient background instead of external image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05073c] via-[#1a1c5e] to-[#2d1b69]" />
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#fa8b02] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#eb662b] rounded-full blur-[150px]" />
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,7,60,0.3)] via-transparent to-[rgba(5,7,60,0.5)]" />
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="inline-block bg-[rgba(250,139,2,0.2)] border border-[rgba(250,139,2,0.4)] text-[#fa8b02] text-xs font-semibold uppercase tracking-[1.2px] px-6 py-1.5 rounded-full mb-4">
          {t("landing.tourDiscovery.discoverAdventures")}
        </span>
        <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-bold text-white leading-[1.25] md:leading-[75px] mb-4">
          {t("landing.tourDiscovery.packageLabel")}{" "}
          <span className="text-[#fa8b02]">
            {t("landing.tourDiscovery.toursLabel")}
          </span>
        </h1>
        <p className="text-base text-white/70 mb-6 max-w-[550px]">
          {t("landing.tourDiscovery.heroDescription")}
        </p>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm">
          <Link
            href="/home"
            className="text-white/50 hover:text-white transition-colors">
            {t("landing.nav.home")}
          </Link>
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-3.5 h-3.5 text-white/50"
          />
          <span className="text-white/80">
            {t("landing.tourDiscovery.packageTours")}
          </span>
        </nav>
      </div>
    </section>
  );
};

/* ── Full-Width Search Bar ─────────────────────────────────── */
const SearchBar = ({
  onFilterToggle,
  searchText,
  onSearchChange,
  onSearchSubmit,
}: {
  onFilterToggle?: () => void;
  searchText: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border-b border-black/5 shadow-sm lg:border-0 lg:shadow-none">
      <div className="max-w-[1152px] mx-auto px-6 py-3 flex items-center gap-3">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}>
          <Icon
            icon="heroicons-outline:search"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a1af]"
          />
          <TextInput
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("landing.tourDiscovery.searchFullPlaceholder")}
            className="!h-[42px] !bg-[#f9fafb] !border-[#e5e7eb] lg:!border-[#f3f4f6] !rounded-xl lg:!rounded-lg !pl-11 !pr-4 !text-sm !text-[#05073c] placeholder:!text-[#99a1af] focus:!ring-[#eb662b]/30 focus:!border-[#eb662b] transition-colors"
          />
        </form>
        {/* Mobile filter button */}
        <Button
          type="button"
          onClick={onFilterToggle}
          className="lg:hidden inline-flex items-center gap-2 h-[42px] bg-white border border-[#e5e7eb] rounded-xl px-4 text-sm font-medium text-[#4a5565] hover:bg-gray-50 transition-colors shrink-0">
          <Icon
            icon="heroicons-outline:adjustments-horizontal"
            className="w-4 h-4"
          />
          {t("landing.tourDiscovery.filtersLabel")}
        </Button>
      </div>
    </div>
  );
};

/* ── Collapsible Filter Section ─────────────────────────────── */
const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f3f4f6] pb-4">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3">
        <span className="text-[14px] font-semibold text-[#05073c]">
          {title}
        </span>
        <Icon
          icon={
            isOpen
              ? "heroicons-outline:chevron-up"
              : "heroicons-outline:chevron-down"
          }
          className="w-4 h-4 text-[#05073c]"
        />
      </Button>
      {isOpen && <div className="pb-1">{children}</div>}
    </div>
  );
};

/* ── Radio-style Filter List ────────────────────────────────── */
const FilterRadioList = ({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) => (
  <div className="flex flex-col">
    {options.map((option) => (
      <label
        key={option}
        className="flex items-center gap-2.5 cursor-pointer py-1 text-[12px] text-[#6a7282] hover:text-[#05073c] transition-colors">
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            selected.includes(option)
              ? "border-[#eb662b] bg-[#eb662b]"
              : "border-[#d1d5db]"
          }`}>
          {selected.includes(option) && (
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </div>
        <span>{option}</span>
      </label>
    ))}
  </div>
);

/* ── Sidebar Filter ────────────────────────────────────────── */
const TourSidebar = ({
  isMobileOpen,
  onClose,
  onClassificationChange,
  onDurationChange,
  onPriceRangeChange,
}: {
  isMobileOpen?: boolean;
  onClose?: () => void;
  onClassificationChange?: (value: string) => void;
  onDurationChange?: (value: string) => void;
  onPriceRangeChange?: (range: [number, number]) => void;
}) => {
  const { t } = useTranslation();
  const [classFilters, setClassFilters] = useState<string[]>([]);
  const [catFilters, setCatFilters] = useState<string[]>([]);
  const [durFilters, setDurFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [activePriceQuick, setActivePriceQuick] = useState<string | null>(null);

  const toggleFilter = (
    option: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(
      current.includes(option)
        ? current.filter((f) => f !== option)
        : [...current, option],
    );
  };

  const handleClassToggle = (option: string) => {
    const newValue = classFilters.includes(option) ? "" : option;
    toggleFilter(option, classFilters, setClassFilters);
    onClassificationChange?.(newValue);
  };

  const handleDurToggle = (option: string) => {
    const newValue = durFilters.includes(option) ? "" : option;
    toggleFilter(option, durFilters, setDurFilters);
    onDurationChange?.(newValue);
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    onPriceRangeChange?.(newRange);
  };

  const sidebarContent = (
    <>
      {/* Orange top bar */}
      <div className="h-1 bg-[#eb662b] rounded-t-lg" />
      <div className="border border-t-0 border-[#f3f4f6] rounded-b-lg px-5 pb-5">
        {/* Filter Header */}
        <div className="flex items-center gap-2 py-5 border-b border-[#f3f4f6]">
          <Icon
            icon="heroicons-outline:adjustments-horizontal"
            className="w-4 h-4 text-[#05073c]"
          />
          <span className="text-sm font-semibold text-[#05073c]">
            {t("landing.tourDiscovery.filter")}
          </span>
        </div>

        {/* Classification */}
        <FilterSection title={t("landing.tourDiscovery.classification")}>
          <FilterRadioList
            options={CLASSIFICATION_OPTIONS}
            selected={classFilters}
            onToggle={handleClassToggle}
          />
        </FilterSection>

        {/* Category */}
        <FilterSection title={t("landing.tourDiscovery.category")}>
          <FilterRadioList
            options={CATEGORY_OPTIONS}
            selected={catFilters}
            onToggle={(o) => toggleFilter(o, catFilters, setCatFilters)}
          />
        </FilterSection>

        {/* Duration */}
        <FilterSection title={t("landing.tourDiscovery.duration")}>
          <FilterRadioList
            options={DURATION_OPTIONS}
            selected={durFilters}
            onToggle={handleDurToggle}
          />
        </FilterSection>

        {/* Price Range */}
        <FilterSection title={t("landing.tourDiscovery.priceRange")}>
          <div className="flex flex-col gap-3">
            {/* Min/Max labels */}
            <div className="flex items-center justify-between text-[12px] text-[#99a1af]">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>

            {/* Slider */}
            <div className="relative h-[3px] bg-[#f3f4f6] rounded-full">
              <div
                className="absolute h-full bg-[#eb662b] rounded-full"
                style={{
                  left: `${(priceRange[0] / 50000000) * 100}%`,
                  right: `${100 - (priceRange[1] / 50000000) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={50000000}
                step={500000}
                value={priceRange[0]}
                onChange={(e) =>
                  handlePriceRangeChange([+e.target.value, priceRange[1]])
                }
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min={0}
                max={50000000}
                step={500000}
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange([priceRange[0], +e.target.value])
                }
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* From / To display */}
            <div className="flex items-center justify-center gap-3 bg-[#f9fafb] rounded-lg py-2 px-3 mt-1">
              <div className="text-center">
                <p className="text-[10px] text-[#99a1af] uppercase tracking-wider">
                  {t("landing.tourDiscovery.from")}
                </p>
                <p className="text-sm font-bold text-[#eb662b]">
                  {formatCurrency(priceRange[0])}
                </p>
              </div>
              <div className="w-4 h-[1px] bg-[#d1d5db]" />
              <div className="text-center">
                <p className="text-[10px] text-[#99a1af] uppercase tracking-wider">
                  {t("landing.tourDiscovery.to")}
                </p>
                <p className="text-sm font-bold text-[#eb662b]">
                  {formatCurrency(priceRange[1])}
                </p>
              </div>
            </div>

            {/* Quick price buttons */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_QUICK_FILTERS.map((label) => (
                <Button
                  key={label}
                  type="button"
                  onClick={() =>
                    setActivePriceQuick(
                      activePriceQuick === label ? null : label,
                    )
                  }
                  className={`px-2 py-1 rounded-md text-[10px] border transition-colors ${
                    activePriceQuick === label
                      ? "bg-[#eb662b] text-white border-[#eb662b]"
                      : "bg-white text-[#6a7282] border-[#f3f4f6] hover:border-[#eb662b]"
                  }`}>
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </FilterSection>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[256px] shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white overflow-y-auto shadow-xl">
            {/* Close button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
              <span className="text-sm font-semibold text-[#05073c]">
                {t("landing.tourDiscovery.filtersLabel")}
              </span>
              <Button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Icon
                  icon="heroicons-outline:x-mark"
                  className="w-5 h-5 text-[#05073c]"
                />
              </Button>
            </div>
            <div className="p-4">{sidebarContent}</div>
          </aside>
        </div>
      )}
    </>
  );
};

/* ── Customize Your Tour CTA ───────────────────────────────── */
const CustomizeTourCTA = () => {
  const { t } = useTranslation();
  return (
    <Link
      href="/tours/customize"
      className="block lg:hidden bg-gradient-to-b from-[#fa8b02] via-[#eb662b] to-[#fa8b02] rounded-2xl p-5 shadow-lg mb-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Icon
          icon="heroicons-outline:sparkles"
          className="w-5 h-5 text-white"
        />
        <span className="text-[14px] font-bold text-white">
          {t("landing.tourDiscovery.customizeYourTour")}
        </span>
      </div>
      <p className="text-[12px] text-white/90 leading-[19.5px] max-w-[265px] mb-3">
        {t("landing.tourDiscovery.customizeDescription")}
      </p>
      <div className="flex items-center gap-1">
        <span className="text-[12px] font-semibold text-white">
          {t("landing.tourDiscovery.createCustomTour")}
        </span>
        <Icon
          icon="heroicons-outline:chevron-right"
          className="w-3.5 h-3.5 text-white"
        />
      </div>
    </Link>
  );
};

/* ── Tour Card (Grid Style) ────────────────────────────────── */
const TourCard = ({ tour }: { tour: SearchTour }) => {
  const { t } = useTranslation();
  return (
    <article className="bg-white border border-[#f3f4f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative w-full h-[192px] overflow-hidden">
        {tour.thumbnail ? (
          <Image
            src={tour.thumbnail}
            alt={tour.tourName}
            fill
            sizes="(max-width: 767px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon
              icon="heroicons-outline:photo"
              className="w-10 h-10 text-gray-400"
            />
          </div>
        )}
        {/* Classification badge on image */}
        {tour.classificationName && (
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {tour.classificationName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center justify-between mb-2">
          {tour.location && (
            <div className="flex items-center gap-1 text-[12px] text-[#99a1af]">
              <Icon
                icon="heroicons-solid:map-pin"
                className="w-3 h-3 shrink-0"
              />
              <span>{tour.location}</span>
            </div>
          )}
          {tour.rating && (
            <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[rgba(106,114,130,0.1)] text-[10px] font-bold text-[#6a7282] px-2 py-0.5 rounded-full">
              <Icon
                icon="heroicons-solid:star"
                className="w-3 h-3 text-[#fa8b02]"
              />
              {tour.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-semibold text-[#05073c] leading-[19px] mb-3 line-clamp-2 min-h-[38px]">
          {tour.tourName}
        </h3>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[#f3f4f6] text-[10px] text-[#6a7282] px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:clock"
              className="w-3 h-3 text-[#6a7282]"
            />
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
          <p className="text-[12px] text-[#99a1af]">
            <span>{t("landing.tourDiscovery.from")} </span>
            {tour.salePrice > 0 && tour.salePrice < tour.price ? (
              <>
                <span className="text-[14px] font-bold text-[#eb662b]">
                  {formatCurrency(tour.salePrice)}
                </span>
                <span className="ml-1 line-through text-[11px] text-[#99a1af]">
                  {formatCurrency(tour.price)}
                </span>
              </>
            ) : (
              <span className="text-[14px] font-bold text-[#05073c]">
                {formatCurrency(tour.price)}
              </span>
            )}
            <span> /pax</span>
          </p>
          <Link
            href={`/tours/${tour.id}`}
            className="w-[26px] h-[26px] bg-[#fff7ed] rounded-[10px] flex items-center justify-center hover:bg-[#eb662b] group/arrow transition-colors">
            <Icon
              icon="heroicons-outline:arrow-right"
              className="w-3.5 h-3.5 text-[#eb662b] group-hover/arrow:text-white transition-colors"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ── Results Toolbar ───────────────────────────────────────── */
const VIEW_MODE_OPTIONS = [
  { id: "tours" as const, icon: "heroicons-outline:rectangle-stack", labelKey: "landing.tourDiscovery.byTour" },
  { id: "instances" as const, icon: "heroicons-outline:calendar-days", labelKey: "landing.tourDiscovery.byDeparture" },
];

const ResultsToolbar = ({
  count,
  viewMode,
  onViewModeChange,
}: {
  count: number;
  viewMode: "tours" | "instances";
  onViewModeChange: (mode: "tours" | "instances") => void;
}) => {
  const { t } = useTranslation();
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const activeOption = VIEW_MODE_OPTIONS.find((o) => o.id === viewMode)!;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="flex items-center justify-between py-2 mb-4">
      <p className="text-sm text-[#6a7282] lg:text-[#05073c]">
        {t("landing.tourDiscovery.showing")}{" "}
        <span className="font-semibold text-[#05073c]">{count}</span>{" "}
        {viewMode === "tours"
          ? t("landing.tourDiscovery.toursLower")
          : t("landing.tourDiscovery.departuresLower")}
      </p>
      <div className="flex items-center gap-2 lg:gap-2">
        {/* View Mode Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-b from-[#fa8b02] to-[#eb662b] text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl shadow-sm hover:opacity-90 transition-opacity">
            <Icon icon={activeOption.icon} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t(activeOption.labelKey)}</span>
            <Icon
              icon="heroicons-outline:chevron-down"
              className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#e5e7eb] rounded-xl shadow-lg z-20 overflow-hidden">
              {VIEW_MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onViewModeChange(option.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${
                    viewMode === option.id
                      ? "bg-[#fff7ed] text-[#eb662b] font-semibold"
                      : "text-[#4a5565] hover:bg-[#f9fafb]"
                  }`}>
                  <Icon icon={option.icon} className="w-4 h-4 shrink-0" />
                  <span>{t(option.labelKey)}</span>
                  {viewMode === option.id && (
                    <Icon icon="heroicons-outline:check" className="w-4 h-4 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Dropdown - compact on mobile */}
        <Button
          type="button"
          className="inline-flex items-center gap-1.5 lg:gap-2 bg-white border border-[#e5e7eb] lg:border-[#f3f4f6] text-[#05073c] text-xs font-medium px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl lg:rounded-lg hover:bg-gray-50 transition-colors">
          <Icon
            icon="heroicons-outline:sparkles"
            className="w-3.5 h-3.5 text-[#eb662b]"
          />
          <span className="hidden lg:inline">
            {t("landing.tourDiscovery.recommended")}
          </span>
          <Icon icon="heroicons-outline:chevron-down" className="w-3.5 h-3.5" />
        </Button>

        {/* View Mode Toggle - hidden on mobile */}
        <div className="hidden lg:flex items-center border border-[#f3f4f6] rounded-lg overflow-hidden">
          <Button
            type="button"
            onClick={() => setGridView("grid")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              gridView === "grid"
                ? "bg-[#eb662b] text-white"
                : "bg-white text-[#6a7282] hover:bg-gray-50"
            }`}>
            <Icon icon="heroicons-outline:squares-2x2" className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => setGridView("list")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              gridView === "list"
                ? "bg-[#eb662b] text-white"
                : "bg-white text-[#6a7282] hover:bg-gray-50"
            }`}>
            <Icon icon="heroicons-outline:bars-3" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Pagination ────────────────────────────────────────────── */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("landing.tourDiscovery.pagination")}
      className="flex items-center justify-center gap-2 mt-10">
      {/* Prev */}
      <Button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#6a7282] hover:bg-gray-50 disabled:opacity-40 transition-colors">
        <Icon icon="heroicons-outline:chevron-left" className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      {(() => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
          for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          if (currentPage > 3) pages.push("...");
          const start = Math.max(2, currentPage - 1);
          const end = Math.min(totalPages - 1, currentPage + 1);
          for (let i = start; i <= end; i++) pages.push(i);
          if (currentPage < totalPages - 2) pages.push("...");
          pages.push(totalPages);
        }
        return pages.map((page, idx) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-[#6a7282]">
              ...
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#fa8b02] text-white"
                  : "border border-[#e5e7eb] text-[#4a5565] hover:bg-gray-50"
              }`}>
              {page}
            </Button>
          ),
        );
      })()}

      {/* Next */}
      <Button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#6a7282] hover:bg-gray-50 disabled:opacity-40 transition-colors">
        <Icon icon="heroicons-outline:chevron-right" className="w-4 h-4" />
      </Button>
    </nav>
  );
};

/* ── Floating Social Buttons ───────────────────────────────── */
const FloatingButtons = () => (
  <div className="fixed right-4 top-[502px] z-50 flex flex-col gap-3">
    <a
      href="#"
      aria-label="Facebook"
      className="w-11 h-11 bg-[#1877f2] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
      <Icon icon="ri:facebook-fill" className="w-5 h-5" />
    </a>
    <Button
      type="button"
      aria-label="Chat"
      className="w-11 h-11 bg-[#eb662b] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
      <Icon
        icon="heroicons-outline:chat-bubble-oval-left"
        className="w-5 h-5"
      />
    </Button>
  </div>
);

/* ── Loading Skeleton ───────────────────────────────────────── */
const TourCardSkeleton = () => (
  <div className="bg-white border border-[#f3f4f6] rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-[192px] bg-gray-200" />
    <div className="p-4">
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
      <div className="border-t border-[#f3f4f6] pt-3 flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="w-[26px] h-[26px] bg-gray-200 rounded-[10px]" />
      </div>
    </div>
  </div>
);

/* ── Scheduled Tour Instance Card ──────────────────────────── */
const ScheduledTourCard = ({ instance }: { instance: TourInstanceVm }) => {
  const { t } = useTranslation();

  const statusKey = instance.status.toLowerCase().replace(/\s+/g, "_");
  const statusConfig = TourInstanceStatusMap[statusKey] ?? {
    label: instance.status,
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  const spotsLeft = instance.maxParticipants - instance.registeredParticipants;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <article className="bg-white border border-[#f3f4f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative w-full h-[180px] overflow-hidden">
        {instance.thumbnail?.publicURL ? (
          <Image
            src={instance.thumbnail.publicURL}
            alt={instance.tourName}
            fill
            sizes="(max-width: 767px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#05073c] to-[#1a1c5e] flex items-center justify-center">
            <Icon
              icon="heroicons-outline:calendar-days"
              className="w-10 h-10 text-white/40"
            />
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
        {/* Date badge */}
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Icon icon="heroicons-outline:calendar" className="w-3 h-3" />
          {formatDate(instance.startDate)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location & Classification */}
        <div className="flex items-center justify-between mb-2">
          {instance.location && (
            <div className="flex items-center gap-1 text-[12px] text-[#99a1af]">
              <Icon
                icon="heroicons-solid:map-pin"
                className="w-3 h-3 shrink-0"
              />
              <span>{instance.location}</span>
            </div>
          )}
          {instance.classificationName && (
            <span className="text-[10px] font-semibold text-[#6a7282] bg-[#f9fafb] border border-[#f3f4f6] px-2 py-0.5 rounded-full">
              {instance.classificationName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-semibold text-[#05073c] leading-[19px] mb-2 line-clamp-2 min-h-[38px]">
          {instance.tourName}
        </h3>

        {/* Duration & Spots */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[#f3f4f6] text-[10px] text-[#6a7282] px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:clock"
              className="w-3 h-3 text-[#6a7282]"
            />
            {instance.durationDays} {instance.durationDays === 1 ? "day" : "days"}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[#f3f4f6] text-[10px] text-[#6a7282] px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:user-group"
              className="w-3 h-3 text-[#6a7282]"
            />
            {spotsLeft > 0
              ? `${spotsLeft} ${t("tourInstance.spotsLeft", "spots left")}`
              : t("tourInstance.soldOut", "Sold out")}
          </span>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
          <p className="text-[12px] text-[#99a1af]">
            <span>{t("landing.tourDiscovery.from")} </span>
            <span className="text-[14px] font-bold text-[#eb662b]">
              {formatCurrency(instance.price)}
            </span>
            <span> /pax</span>
          </p>
          <Link
            href={`/tours/${instance.tourId}?instanceId=${instance.id}`}
            className="w-[26px] h-[26px] bg-[#fff7ed] rounded-[10px] flex items-center justify-center hover:bg-[#eb662b] group/arrow transition-colors">
            <Icon
              icon="heroicons-outline:arrow-right"
              className="w-3.5 h-3.5 text-[#eb662b] group-hover/arrow:text-white transition-colors"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ── Main Tour Discovery Page ──────────────────────────────── */
export const TourDiscoveryPage = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");

  // View mode: tours (default) or instances (departures)
  const [viewMode, setViewMode] = useState<"tours" | "instances">("tours");

  // API state — tours
  const [tours, setTours] = useState<SearchTour[]>([]);
  const [totalTours, setTotalTours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<string[]>([]);

  // API state — instances (departure mode)
  const [instanceData, setInstanceData] = useState<TourInstanceVm[]>([]);
  const [instanceTotal, setInstanceTotal] = useState(0);
  const [instancePage, setInstancePage] = useState(1);
  const [instanceLoading, setInstanceLoading] = useState(false);
  const [instanceError, setInstanceError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalTours / PAGE_SIZE));
  const instanceTotalPages = Math.max(1, Math.ceil(instanceTotal / PAGE_SIZE));

  const fetchTours = useCallback(
    async (page: number, destination?: string, classification?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await homeService.searchTours({
          destination: destination || undefined,
          classification: classification || undefined,
          page,
          pageSize: PAGE_SIZE,
        });
        if (result) {
          setTours(result.data || []);
          setTotalTours(result.total || 0);
        } else {
          setTours([]);
          setTotalTours(0);
        }
      } catch {
        setError(t("landing.tourDiscovery.errorLoading"));
        setTours([]);
        setTotalTours(0);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  const fetchInstances = useCallback(
    async (page: number, destination?: string) => {
      setInstanceLoading(true);
      setInstanceError(null);
      try {
        const result = await homeService.getAvailablePublicInstances(
          destination || undefined,
          page,
          PAGE_SIZE,
        );
        if (result) {
          setInstanceData(result.data || []);
          setInstanceTotal(result.total || 0);
        } else {
          setInstanceData([]);
          setInstanceTotal(0);
        }
      } catch {
        setInstanceError(t("landing.tourDiscovery.errorLoadingInstances"));
        setInstanceData([]);
        setInstanceTotal(0);
      } finally {
        setInstanceLoading(false);
      }
    },
    [t],
  );

  // Read ?tab=scheduled from URL to auto-switch to instance mode
  useEffect(() => {
    if (searchParams.get("tab") === "scheduled") {
      setViewMode("instances");
    }
  }, [searchParams]);

  // Initial load + fetch destinations
  useEffect(() => {
    fetchTours(1);
    homeService
      .getDestinations()
      .then(setDestinations)
      .catch(() => {});
  }, [fetchTours]);

  // Fetch instances when switching to instance mode
  useEffect(() => {
    if (viewMode === "instances" && instanceData.length === 0 && !instanceLoading) {
      fetchInstances(1, searchText);
    }
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when page or filters change
  const handlePageChange = (page: number) => {
    if (viewMode === "tours") {
      setCurrentPage(page);
      fetchTours(page, searchText, classificationFilter);
    } else {
      setInstancePage(page);
      fetchInstances(page, searchText);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setInstancePage(1);
    if (viewMode === "tours") {
      fetchTours(1, searchText, classificationFilter);
    } else {
      fetchInstances(1, searchText);
    }
  };

  const handleViewModeChange = (mode: "tours" | "instances") => {
    setViewMode(mode);
  };

  const handleClassificationChange = (classification: string) => {
    setClassificationFilter(
      classification === classificationFilter ? "" : classification,
    );
    setCurrentPage(1);
    fetchTours(
      1,
      searchText,
      classification === classificationFilter ? "" : classification,
    );
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Header */}
      <LandingHeader variant="solid" />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Search Bar */}
      <SearchBar
        onFilterToggle={() => setIsMobileFilterOpen(true)}
        searchText={searchText}
        onSearchChange={setSearchText}
        onSearchSubmit={handleSearch}
      />

      {/* Page Content */}
      <div className="bg-[#f9fafb] lg:bg-transparent">
        <div className="max-w-[1152px] mx-auto px-6 py-4">
          {/* Content: Sidebar + Main */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <TourSidebar
              isMobileOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              onClassificationChange={handleClassificationChange}
              onDurationChange={(dur) => {
                setCurrentPage(1);
                fetchTours(1, searchText, classificationFilter);
              }}
              onPriceRangeChange={() => {
                setCurrentPage(1);
              }}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Customize Your Tour CTA (mobile only) */}
              <CustomizeTourCTA />

              {/* Upcoming Scheduled Tours preview removed — user switches via view mode toggle */}

              {/* Results Toolbar */}
              <ResultsToolbar
                count={viewMode === "tours" ? totalTours : instanceTotal}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />

              {/* ══════════ Tour Mode Content ══════════ */}
              {viewMode === "tours" && (
                <>
                  {/* Error State */}
                  {error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon
                        icon="heroicons-outline:exclamation-circle"
                        className="w-12 h-12 text-red-400 mb-4"
                      />
                      <p className="text-sm text-[#6a7282] mb-4">{error}</p>
                      <Button
                        type="button"
                        onClick={() =>
                          fetchTours(currentPage, searchText, classificationFilter)
                        }
                        className="inline-flex items-center gap-2 bg-[#eb662b] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        <Icon
                          icon="heroicons-outline:arrow-path"
                          className="w-4 h-4"
                        />
                        {t("landing.tourDiscovery.retry")}
                      </Button>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TourCardSkeleton key={i} />
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!loading && !error && tours.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon
                        icon="heroicons-outline:magnifying-glass"
                        className="w-12 h-12 text-[#99a1af] mb-4"
                      />
                      <h3 className="text-lg font-semibold text-[#05073c] mb-2">
                        {t("landing.tourDiscovery.noResults")}
                      </h3>
                      <p className="text-sm text-[#6a7282] max-w-md">
                        {t("landing.tourDiscovery.noResultsDescription")}
                      </p>
                    </div>
                  )}

                  {/* Tour Grid */}
                  {!loading && !error && tours.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {tours.map((tour) => (
                          <TourCard key={tour.id} tour={tour} />
                        ))}
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </>
              )}

              {/* ══════════ Instance (Departure) Mode Content ══════════ */}
              {viewMode === "instances" && (
                <>
                  {/* Error State */}
                  {instanceError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon
                        icon="heroicons-outline:exclamation-circle"
                        className="w-12 h-12 text-red-400 mb-4"
                      />
                      <p className="text-sm text-[#6a7282] mb-4">{instanceError}</p>
                      <Button
                        type="button"
                        onClick={() => fetchInstances(instancePage, searchText)}
                        className="inline-flex items-center gap-2 bg-[#eb662b] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        <Icon
                          icon="heroicons-outline:arrow-path"
                          className="w-4 h-4"
                        />
                        {t("landing.tourDiscovery.retry")}
                      </Button>
                    </div>
                  )}

                  {/* Loading State */}
                  {instanceLoading && !instanceError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TourCardSkeleton key={i} />
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!instanceLoading && !instanceError && instanceData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon
                        icon="heroicons-outline:calendar"
                        className="w-12 h-12 text-[#99a1af] mb-4"
                      />
                      <h3 className="text-lg font-semibold text-[#05073c] mb-2">
                        {t("landing.tourDiscovery.noInstancesTitle")}
                      </h3>
                      <p className="text-sm text-[#6a7282] max-w-md">
                        {t("landing.tourDiscovery.noInstancesDescription")}
                      </p>
                    </div>
                  )}

                  {/* Instance Grid */}
                  {!instanceLoading && !instanceError && instanceData.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {instanceData.map((instance) => (
                          <ScheduledTourCard key={instance.id} instance={instance} />
                        ))}
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={instancePage}
                        totalPages={instanceTotalPages}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Social Buttons */}
      <FloatingButtons />

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default TourDiscoveryPage;
