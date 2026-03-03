"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "./LandingImage";
import { Icon } from "@/components/ui";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";
import { useTranslation } from "react-i18next";

/* ── Hero Background ───────────────────────────────────────── */
const HERO_BG =
  "https://www.figma.com/api/mcp/asset/6b3bd8ae-6ffb-498d-a62b-9de9ca38cdd4";

/* ── Sample Tour Data ──────────────────────────────────────── */
interface TourItem {
  id: number;
  image: string;
  location: string;
  title: string;
  duration: string;
  maxPax: number;
  price: number;
  category: string;
  classification: string;
}

const SAMPLE_TOURS: TourItem[] = [
  {
    id: 1,
    image:
      "https://www.figma.com/api/mcp/asset/2f522778-a155-437a-b5a2-6142ef1c1bb2",
    location: "New York, USA",
    title: "Statue of Liberty & Ellis Island Ferry Access Tour",
    duration: "1 day",
    maxPax: 12,
    price: 35,
    category: "Cultural Tour",
    classification: "Budget Tour",
  },
  {
    id: 2,
    image:
      "https://www.figma.com/api/mcp/asset/376def41-3ada-46d6-bc15-15a90d47e877",
    location: "Washington, USA",
    title: "National Mall Monuments Guided Sunset Walking Tour",
    duration: "1 day",
    maxPax: 12,
    price: 45,
    category: "Cultural Tour",
    classification: "Budget Tour",
  },
  {
    id: 3,
    image:
      "https://www.figma.com/api/mcp/asset/0b0f78f8-a3d5-455a-8517-d3e9a30ba3ee",
    location: "Bangkok, Thailand",
    title: "Floating Market & Temple Day Tour by Long-Tail Boat",
    duration: "1 day",
    maxPax: 12,
    price: 49,
    category: "Cultural Tour",
    classification: "Budget Tour",
  },
  {
    id: 4,
    image:
      "https://www.figma.com/api/mcp/asset/b8a1b3ef-885e-4918-a4bd-28cc72158758",
    location: "Rome, Italy",
    title: "Colosseum, Roman Forum & Palatine Hill Guided Tour",
    duration: "2 days",
    maxPax: 12,
    price: 65,
    category: "Cultural Tour",
    classification: "Standard Tour",
  },
  {
    id: 5,
    image:
      "https://www.figma.com/api/mcp/asset/f69eee8d-bc64-4c1c-9077-7a16614f5cda",
    location: "Dubai, UAE",
    title: "Dubai Desert Safari with BBQ Dinner & Camel Ride",
    duration: "1 day",
    maxPax: 12,
    price: 75,
    category: "Adventure Tour",
    classification: "Group Tour",
  },
  {
    id: 6,
    image:
      "https://www.figma.com/api/mcp/asset/f5d4fd9b-5ccc-427a-940a-d0f92012d69a",
    location: "Bali, Indonesia",
    title: "Sacred Monkey Forest & Tegallalang Rice Terrace Tour",
    duration: "2 days",
    maxPax: 12,
    price: 79,
    category: "Eco Tour",
    classification: "Standard Tour",
  },
  {
    id: 7,
    image:
      "https://www.figma.com/api/mcp/asset/e0caae3f-56bd-4093-b2ed-66986ad053ae",
    location: "Paris, France",
    title: "Louvre Museum Skip-the-Line Guided Tour",
    duration: "1 day",
    maxPax: 12,
    price: 85,
    category: "Cultural Tour",
    classification: "Standard Tour",
  },
  {
    id: 8,
    image:
      "https://www.figma.com/api/mcp/asset/376def41-3ada-46d6-bc15-15a90d47e877",
    location: "Tokyo, Japan",
    title: "Tokyo Night Lights & Street Food Walking Experience",
    duration: "1 day",
    maxPax: 12,
    price: 89,
    category: "Food Tour",
    classification: "Standard Tour",
  },
  {
    id: 9,
    image:
      "https://www.figma.com/api/mcp/asset/0b0f78f8-a3d5-455a-8517-d3e9a30ba3ee",
    location: "Phuket, Thailand",
    title: "Phi Phi Islands Speedboat Snorkeling Day Trip",
    duration: "1 day",
    maxPax: 12,
    price: 95,
    category: "Adventure Tour",
    classification: "Group Tour",
  },
  {
    id: 10,
    image:
      "https://www.figma.com/api/mcp/asset/b8a1b3ef-885e-4918-a4bd-28cc72158758",
    location: "Paris, France",
    title: "Eiffel Tower Summit Access with Champagne Toast",
    duration: "1 day",
    maxPax: 12,
    price: 120,
    category: "Relaxation Tour",
    classification: "Premium Tour",
  },
  {
    id: 11,
    image:
      "https://www.figma.com/api/mcp/asset/f69eee8d-bc64-4c1c-9077-7a16614f5cda",
    location: "Singapore, Singapore",
    title: "Marina Bay Sands Sunset Cruise with Dinner",
    duration: "1 day",
    maxPax: 12,
    price: 149,
    category: "Relaxation Tour",
    classification: "VIP / Luxury Tour",
  },
  {
    id: 12,
    image:
      "https://www.figma.com/api/mcp/asset/f5d4fd9b-5ccc-427a-940a-d0f92012d69a",
    location: "London, UK",
    title: "Tower of London & Crown Jewels Exclusive Tour",
    duration: "2 days",
    maxPax: 12,
    price: 180,
    category: "Cultural Tour",
    classification: "Standard Tour",
  },
];

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

const PRICE_QUICK_FILTERS = ["Under $100", "$100–$300", "$300–$1k", "$1k+"];

/* ── Hero Banner ───────────────────────────────────────────── */
const HeroBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <Image
        src={HERO_BG}
        alt="Package Tours hero background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,7,60,0.7)] via-[rgba(5,7,60,0.4)] to-[rgba(5,7,60,0.8)]" />
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
const SearchBar = ({ onFilterToggle }: { onFilterToggle?: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border-b border-black/5 shadow-sm lg:border-0 lg:shadow-none">
      <div className="max-w-[1152px] mx-auto px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Icon
            icon="heroicons-outline:search"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a1af]"
          />
          <input
            type="text"
            placeholder={t("landing.tourDiscovery.searchFullPlaceholder")}
            className="w-full h-[42px] bg-[#f9fafb] border border-[#e5e7eb] lg:border-[#f3f4f6] rounded-xl lg:rounded-lg pl-11 pr-4 text-sm text-[#05073c] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#eb662b]/30 focus:border-[#eb662b] transition-colors"
          />
        </div>
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={onFilterToggle}
          className="lg:hidden inline-flex items-center gap-2 h-[42px] bg-white border border-[#e5e7eb] rounded-xl px-4 text-sm font-medium text-[#4a5565] hover:bg-gray-50 transition-colors shrink-0">
          <Icon
            icon="heroicons-outline:adjustments-horizontal"
            className="w-4 h-4"
          />
          {t("landing.tourDiscovery.filtersLabel")}
        </button>
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
      <button
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
      </button>
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
}: {
  isMobileOpen?: boolean;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [classFilters, setClassFilters] = useState<string[]>([]);
  const [catFilters, setCatFilters] = useState<string[]>([]);
  const [durFilters, setDurFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
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
            onToggle={(o) => toggleFilter(o, classFilters, setClassFilters)}
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
            onToggle={(o) => toggleFilter(o, durFilters, setDurFilters)}
          />
        </FilterSection>

        {/* Price Range */}
        <FilterSection title={t("landing.tourDiscovery.priceRange")}>
          <div className="flex flex-col gap-3">
            {/* Min/Max labels */}
            <div className="flex items-center justify-between text-[12px] text-[#99a1af]">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>

            {/* Slider */}
            <div className="relative h-[3px] bg-[#f3f4f6] rounded-full">
              <div
                className="absolute h-full bg-[#eb662b] rounded-full"
                style={{
                  left: `${(priceRange[0] / 3000) * 100}%`,
                  right: `${100 - (priceRange[1] / 3000) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={3000}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min={0}
                max={3000}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
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
                  ${priceRange[0]}
                </p>
              </div>
              <div className="w-4 h-[1px] bg-[#d1d5db]" />
              <div className="text-center">
                <p className="text-[10px] text-[#99a1af] uppercase tracking-wider">
                  {t("landing.tourDiscovery.to")}
                </p>
                <p className="text-sm font-bold text-[#eb662b]">
                  ${priceRange[1].toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick price buttons */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_QUICK_FILTERS.map((label) => (
                <button
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
                </button>
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
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Icon
                  icon="heroicons-outline:x-mark"
                  className="w-5 h-5 text-[#05073c]"
                />
              </button>
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
const TourCard = ({ tour }: { tour: TourItem }) => {
  const { t } = useTranslation();
  return (
    <article className="bg-white border border-[#f3f4f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative w-full h-[192px] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 767px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge on image */}
        <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {tour.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location + Classification */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-[12px] text-[#99a1af]">
            <Icon icon="heroicons-solid:map-pin" className="w-3 h-3 shrink-0" />
            <span>{tour.location}</span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[rgba(106,114,130,0.1)] text-[10px] font-bold text-[#6a7282] px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#99a1af]" />
            {tour.classification}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-semibold text-[#05073c] leading-[19px] mb-3 line-clamp-2 min-h-[38px]">
          {tour.title}
        </h3>

        {/* Duration & Max Pax */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[#f3f4f6] text-[10px] text-[#6a7282] px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:clock"
              className="w-3 h-3 text-[#6a7282]"
            />
            {tour.duration}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#f9fafb] border border-[#f3f4f6] text-[10px] text-[#6a7282] px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:users"
              className="w-3 h-3 text-[#6a7282]"
            />
            {t("landing.tourDiscovery.maxPax", { count: tour.maxPax })}
          </span>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
          <p className="text-[12px] text-[#99a1af]">
            <span>{t("landing.tourDiscovery.from")} </span>
            <span className="text-[14px] font-bold text-[#05073c]">
              ${tour.price}
            </span>
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
const ResultsToolbar = ({ count }: { count: number }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex items-center justify-between py-2 mb-4">
      <p className="text-sm text-[#6a7282] lg:text-[#05073c]">
        {t("landing.tourDiscovery.showing")}{" "}
        <span className="font-semibold text-[#05073c]">{count}</span>{" "}
        {t("landing.tourDiscovery.toursLower")}
      </p>
      <div className="flex items-center gap-2 lg:gap-2">
        {/* Scheduled Tours Button */}
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-gradient-to-b from-[#fa8b02] to-[#eb662b] lg:bg-none lg:bg-[#eb662b] text-white text-xs font-semibold lg:font-medium px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl lg:rounded-lg shadow-md lg:shadow-none hover:opacity-90 transition-opacity">
          <Icon icon="heroicons-outline:calendar" className="w-4 h-4" />
          <span className="text-[12px] lg:text-xs">
            {t("landing.tourDiscovery.scheduledTours")}
          </span>
        </button>

        {/* Recommended Dropdown - compact on mobile */}
        <button
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
        </button>

        {/* View Mode Toggle - hidden on mobile */}
        <div className="hidden lg:flex items-center border border-[#f3f4f6] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              viewMode === "grid"
                ? "bg-[#eb662b] text-white"
                : "bg-white text-[#6a7282] hover:bg-gray-50"
            }`}>
            <Icon icon="heroicons-outline:squares-2x2" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              viewMode === "list"
                ? "bg-[#eb662b] text-white"
                : "bg-white text-[#6a7282] hover:bg-gray-50"
            }`}>
            <Icon icon="heroicons-outline:bars-3" className="w-4 h-4" />
          </button>
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
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#6a7282] hover:bg-gray-50 disabled:opacity-40 transition-colors">
        <Icon icon="heroicons-outline:chevron-left" className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: Math.min(totalPages, 2) }, (_, i) => i + 1).map(
        (page) => (
          <button
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
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#6a7282] hover:bg-gray-50 disabled:opacity-40 transition-colors">
        <Icon icon="heroicons-outline:chevron-right" className="w-4 h-4" />
      </button>
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
    <button
      type="button"
      aria-label="Chat"
      className="w-11 h-11 bg-[#eb662b] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
      <Icon
        icon="heroicons-outline:chat-bubble-oval-left"
        className="w-5 h-5"
      />
    </button>
  </div>
);

/* ── Main Tour Discovery Page ──────────────────────────────── */
export const TourDiscoveryPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
      <SearchBar onFilterToggle={() => setIsMobileFilterOpen(true)} />

      {/* Page Content */}
      <div className="bg-[#f9fafb] lg:bg-transparent">
        <div className="max-w-[1152px] mx-auto px-6 py-4">
          {/* Content: Sidebar + Main */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <TourSidebar
              isMobileOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Customize Your Tour CTA (mobile only) */}
              <CustomizeTourCTA />

              {/* Results Toolbar */}
              <ResultsToolbar count={SAMPLE_TOURS.length} />

              {/* Tour Grid (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SAMPLE_TOURS.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={2}
                onPageChange={setCurrentPage}
              />
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
