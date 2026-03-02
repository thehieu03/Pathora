"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "./LandingImage";
import { Icon } from "@/components/ui";
import { StarRating } from "./shared";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";
import { useTranslation } from "react-i18next";

/* ── Sample Tour Data ──────────────────────────────────────── */
const TOUR_IMAGES = [
  "https://www.figma.com/api/mcp/asset/376def41-3ada-46d6-bc15-15a90d47e877",
  "https://www.figma.com/api/mcp/asset/0b0f78f8-a3d5-455a-8517-d3e9a30ba3ee",
  "https://www.figma.com/api/mcp/asset/b8a1b3ef-885e-4918-a4bd-28cc72158758",
  "https://www.figma.com/api/mcp/asset/f69eee8d-bc64-4c1c-9077-7a16614f5cda",
  "https://www.figma.com/api/mcp/asset/f5d4fd9b-5ccc-427a-940a-d0f92012d69a",
  "https://www.figma.com/api/mcp/asset/e0caae3f-56bd-4093-b2ed-66986ad053ae",
];

interface TourItem {
  id: number;
  image: string;
  location: string;
  title: string;
  description: string;
  rating: number;
  duration: string;
  originalPrice: string;
  price: string;
  featured?: boolean;
}

const SAMPLE_TOURS: TourItem[] = [
  {
    id: 1,
    image: TOUR_IMAGES[0],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
  },
  {
    id: 2,
    image: TOUR_IMAGES[1],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
  },
  {
    id: 3,
    image: TOUR_IMAGES[2],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
    featured: true,
  },
  {
    id: 4,
    image: TOUR_IMAGES[3],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
  },
  {
    id: 5,
    image: TOUR_IMAGES[4],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
  },
  {
    id: 6,
    image: TOUR_IMAGES[5],
    location: "Paris, France",
    title:
      "Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour",
    description:
      "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip.",
    rating: 5,
    duration: "2 Days 1 Nights",
    originalPrice: "$1200",
    price: "$114",
  },
];

const FILTER_OPTIONS = [
  "departureDate",
  "destination",
  "duration",
  "visaRequirement",
  "depositRate",
  "seatsAvailability",
];

/* ── SearchBar ─────────────────────────────────────────────── */
const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#f7f7f7] flex items-center justify-between rounded-full px-3 py-1.5 w-full">
      <span className="text-[#828282] text-base pl-2">
        {t("landing.tourDiscovery.searchPlaceholder")}
      </span>
      <button
        type="button"
        aria-label={t("landing.hero.searchAria")}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
        <Icon
          icon="heroicons-outline:search"
          className="w-6 h-6 text-[#828282]"
        />
      </button>
    </div>
  );
};

/* ── Filter Checkbox List ───────────────────────────────────── */
const FilterCheckboxList = ({
  filters,
  selected,
  onToggle,
}: {
  filters: string[];
  selected: string[];
  onToggle: (filter: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 pt-3">
      {filters.map((filter) => (
        <label
          key={filter}
          className="flex items-center gap-2.5 cursor-pointer text-sm text-landing-heading">
          <input
            type="checkbox"
            checked={selected.includes(filter)}
            onChange={() => onToggle(filter)}
            className="w-[18px] h-[18px] rounded border border-landing-heading accent-landing-accent"
          />
          <span>{t(`landing.tourDiscovery.filters.${filter}`)}</span>
        </label>
      ))}
    </div>
  );
};

/* ── Sidebar Filter ────────────────────────────────────────── */
const TourSidebar = () => {
  const { t } = useTranslation();
  const [tourTypeFilters, setTourTypeFilters] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);

  const toggleFilter = (
    filter: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(
      current.includes(filter)
        ? current.filter((f) => f !== filter)
        : [...current, filter],
    );
  };

  return (
    <aside className="w-full lg:w-[300px] shrink-0 border border-landing-border rounded-xl overflow-hidden">
      {/* Date Range Header */}
      <div className="bg-[#eb662b] px-7 pt-5 pb-5 rounded-t-xl">
        <p className="text-white text-[15px] font-medium mb-3">
          {t("landing.tourDiscovery.whenTraveling")}
        </p>
        <div className="bg-white rounded-xl h-[50px] flex items-center px-5 gap-2">
          <Icon
            icon="heroicons-outline:calendar"
            className="w-5 h-5 text-landing-heading"
          />
          <span className="text-sm text-landing-heading">
            February 05 ~ March 14
          </span>
        </div>
      </div>

      {/* Tour Type */}
      <div className="px-5 pt-4 pb-4">
        <h3 className="text-[17px] font-medium text-landing-heading">
          {t("landing.tourDiscovery.tourType")}
        </h3>
        <FilterCheckboxList
          filters={FILTER_OPTIONS}
          selected={tourTypeFilters}
          onToggle={(f) => toggleFilter(f, tourTypeFilters, setTourTypeFilters)}
        />
      </div>

      {/* Filter Price */}
      <div className="px-5 pt-4 pb-5 border-t border-landing-border">
        <h3 className="text-[17px] font-medium text-landing-heading">
          {t("landing.tourDiscovery.filterPrice")}
        </h3>
        <FilterCheckboxList
          filters={FILTER_OPTIONS}
          selected={priceFilters}
          onToggle={(f) => toggleFilter(f, priceFilters, setPriceFilters)}
        />
      </div>
    </aside>
  );
};

/* ── Tour Card ─────────────────────────────────────────────── */
const TourCard = ({ tour }: { tour: TourItem }) => {
  const { t } = useTranslation();
  return (
    <article className="border border-landing-border rounded-xl p-5 flex flex-col md:flex-row gap-5 md:gap-7 hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full md:w-[280px] h-[200px] md:h-[264px] shrink-0 rounded-xl overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 767px) 100vw, 280px"
          className="object-cover"
        />
        {tour.featured && (
          <span className="absolute top-4 left-4 bg-[#4a43c4] text-white text-xs px-4 py-2 rounded-xl">
            {t("landing.tourDiscovery.featured")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Location */}
        <div>
          <div className="flex items-center gap-1 text-landing-heading text-sm mb-1">
            <Icon icon="heroicons-solid:map-pin" className="w-4 h-4 shrink-0" />
            <span>{tour.location}</span>
          </div>

          {/* Title */}
          <h3 className="text-[17px] font-bold text-landing-heading leading-[30px] mb-3">
            {tour.title}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <StarRating count={tour.rating} size="md" />
          </div>

          {/* Description */}
          <p className="text-sm text-landing-heading leading-7 mb-3 line-clamp-2">
            {tour.description}
          </p>

          {/* Best Price Guarantee */}
          <div className="flex items-center gap-1.5 text-[#eb662b] text-[13px]">
            <Icon icon="heroicons-solid:shield-check" className="w-3.5 h-3.5" />
            <span>{t("landing.tourDiscovery.bestPriceGuarantee")}</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex flex-row md:flex-col items-center md:items-center justify-between md:justify-between border-t md:border-t-0 md:border-l border-landing-border pt-4 md:pt-0 md:pl-6 w-full md:w-[185px] shrink-0">
        <div className="flex flex-col items-center gap-2 md:mt-2.5">
          {/* Duration */}
          <div className="flex items-center gap-1 text-landing-heading text-[13px]">
            <Icon icon="heroicons-outline:clock" className="w-3.5 h-3.5" />
            <span>{tour.duration}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:mt-auto md:mb-2">
          {/* Price */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[#c6c6d2] text-sm line-through">
              {tour.originalPrice}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-landing-heading text-[15px]">
                {t("landing.tourDiscovery.from")}
              </span>
              <span className="text-landing-heading font-medium text-[17px]">
                {tour.price}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <button
            type="button"
            className="border border-[#eb662b] text-[#eb662b] rounded-xl px-6 py-3.5 text-sm font-medium hover:bg-[#eb662b] hover:text-white transition-colors duration-200 flex items-center gap-1.5">
            <span>{t("landing.tourDiscovery.viewDetails")}</span>
            <Icon icon="heroicons-outline:arrow-right" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4);
      if (currentPage > 4 && currentPage < totalPages - 1) {
        pages.push("...", currentPage);
      } else {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label={t("landing.tourDiscovery.pagination")}
      className="flex flex-col items-center gap-3 mt-8">
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-landing-heading text-sm">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#eb662b] text-white"
                  : "text-landing-heading hover:bg-gray-100"
              }`}>
              {page}
            </button>
          ),
        )}
      </div>
      <p className="text-[13px] text-landing-heading text-center">
        {t("landing.tourDiscovery.showingResults", {
          start: 1,
          end: 30,
          total: "1,415",
        })}
      </p>
    </nav>
  );
};

/* ── Main Tour Discovery Page ──────────────────────────────── */
export const TourDiscoveryPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Header */}
      <LandingHeader variant="solid" />

      {/* Page Content */}
      <div className="max-w-[1380px] mx-auto px-4 md:px-12 py-5">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-1 text-sm text-landing-heading">
            <li>
              <Link
                href="/home"
                className="hover:text-landing-accent transition-colors">
                {t("landing.nav.home")}
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link
                href="/tours"
                className="hover:text-landing-accent transition-colors">
                {t("landing.tourDiscovery.tours")}
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li aria-current="page" className="text-landing-body">
              {t("landing.tourDiscovery.availableDepartures")}
            </li>
          </ol>
        </nav>

        {/* Title */}
        <h1 className="text-[40px] font-bold text-landing-heading leading-[60px] mb-8">
          {t("landing.tourDiscovery.title")}
        </h1>

        {/* Content: Sidebar + Main */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <TourSidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <SearchBar />

            {/* Results header */}
            <div className="flex items-center justify-between mt-6 mb-6">
              <p className="text-sm text-landing-heading">
                {t("landing.tourDiscovery.resultsCount", { count: 1362 })}
              </p>
              <div className="flex items-center gap-1 text-sm text-landing-heading">
                <span>{t("landing.tourDiscovery.sortBy")}:</span>
                <span className="font-medium">
                  {t("landing.tourDiscovery.sortFeatured")}
                </span>
              </div>
            </div>

            {/* Tour List */}
            <div className="flex flex-col gap-7">
              {SAMPLE_TOURS.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={20}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default TourDiscoveryPage;
