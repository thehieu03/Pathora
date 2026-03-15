"use client";

import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { normalizeLanguageForApi } from "@/api/languageHeader";
import { homeService } from "@/api/services/homeService";
import { Icon } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchTour } from "@/types/home";
import { NormalizedTourInstanceVm } from "@/types/tour";
import {
  buildTourDiscoverySearchParams,
  parseTourDiscoveryFilters,
  TourDiscoveryView,
} from "@/utils/tourDiscoveryFilters";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { FilterDrawer } from "./FilterDrawer";
import { FilterSidebar } from "./FilterSidebar";
import { HeroSection } from "./HeroSection";
import { SearchBar } from "./SearchBar";
import { TourCard } from "./TourCard";
import { TourInstanceCard } from "./TourInstanceCard";

const PAGE_SIZE = 6;

export const TourDiscoveryPage = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const safeT = (key: string, fallback: string) => {
    return mounted ? t(key, fallback) : fallback;
  };

  const [tours, setTours] = useState<SearchTour[]>([]);
  const [tourInstances, setTourInstances] = useState<NormalizedTourInstanceVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTours, setTotalTours] = useState(0);
  const [searchText, setSearchText] = useState(() => parseTourDiscoveryFilters(searchParams).destination);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [apiLanguage, setApiLanguage] = useState(() =>
    normalizeLanguageForApi(i18n.resolvedLanguage || i18n.language),
  );

  const [selectedClassifications, setSelectedClassifications] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  const filters = useMemo(() => parseTourDiscoveryFilters(searchParams), [searchParams]);
  const currentPage = filters.page;
  const viewType = filters.view;
  const submittedSearchText = filters.destination;
  const debouncedSearchText = useDebounce(searchText, 400);
  const totalPages = Math.max(1, Math.ceil(totalTours / PAGE_SIZE));

  useEffect(() => {
    setSearchText(submittedSearchText);
  }, [submittedSearchText]);

  useEffect(() => {
    const updateLanguage = (language: string) => {
      setApiLanguage(normalizeLanguageForApi(language));
    };

    updateLanguage(i18n.resolvedLanguage || i18n.language);
    i18n.on("languageChanged", updateLanguage);

    return () => {
      i18n.off("languageChanged", updateLanguage);
    };
  }, [i18n]);

  const syncFilters = useCallback((updates: Partial<typeof filters>) => {
    const nextFilters = {
      ...filters,
      ...updates,
    };
    const nextParams = buildTourDiscoverySearchParams(nextFilters);
    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    if (debouncedSearchText.trim() === submittedSearchText) {
      return;
    }

    syncFilters({
      destination: debouncedSearchText.trim(),
      page: 1,
    });
  }, [debouncedSearchText, submittedSearchText, syncFilters]);

  useEffect(() => {
    let isActive = true;

    const fetchTours = async () => {
      setLoading(true);

      try {
        if (viewType === "tours") {
          const result = await homeService.searchTours({
            q: submittedSearchText || undefined,
            page: currentPage,
            pageSize: PAGE_SIZE,
            language: apiLanguage,
          });

          if (!isActive) {
            return;
          }

          setTours(result?.data ?? []);
          setTourInstances([]);
          setTotalTours(result?.total ?? 0);
          return;
        }

        const result = await homeService.getAvailablePublicInstances(
          submittedSearchText || undefined,
          currentPage,
          PAGE_SIZE,
          apiLanguage,
        );

        if (!isActive) {
          return;
        }

        setTourInstances(result?.data ?? []);
        setTours([]);
        setTotalTours(result?.total ?? 0);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Error fetching tours:", error);
        setTours([]);
        setTourInstances([]);
        setTotalTours(0);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => {
      isActive = false;
    };
  }, [
    apiLanguage,
    currentPage,
    submittedSearchText,
    viewType,
  ]);

  const handleSearchSubmit = () => {
    syncFilters({
      destination: searchText.trim(),
      page: 1,
    });
  };

  const handleClassificationToggle = (value: string) => {
    setSelectedClassifications((prev) =>
      prev.includes(value)
        ? prev.filter((classification) => classification !== value)
        : [...prev, value]
    );
  };

  const handleCategoryToggle = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value]
    );
  };

  const handleClearFilters = () => {
    setSelectedClassifications([]);
    setSelectedCategories([]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleViewTypeChange = (value: TourDiscoveryView) => {
    syncFilters({
      view: value,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);

    if (nextPage === currentPage) {
      return;
    }

    syncFilters({ page: nextPage });
  };

  return (
    <>
      <LandingHeader />

      <main className="min-h-screen bg-gray-50">
        <HeroSection />

        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          onFilterToggle={() => setFilterDrawerOpen(true)}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block">
              <FilterSidebar
                selectedClassifications={selectedClassifications}
                selectedCategories={selectedCategories}
                onClassificationToggle={handleClassificationToggle}
                onCategoryToggle={handleCategoryToggle}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => handleViewTypeChange("tours")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        viewType === "tours"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {safeT("landing.tourDiscovery.viewType.tour", "By Tour")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewTypeChange("instances")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        viewType === "instances"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {safeT("landing.tourDiscovery.viewType.tourInstance", "By Departure")}
                    </button>
                  </div>

                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{totalTours}</span>{" "}
                    {viewType === "tours"
                      ? safeT("landing.tourDiscovery.toursFound", "tours found")
                      : safeT(
                          "landing.tourDiscovery.departuresFound",
                          "departures found",
                        )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{safeT("landing.tourDiscovery.sortBy", "Sort by")}:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => handleSortChange(event.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fa8b02]/20 focus:border-[#fa8b02] cursor-pointer"
                    >
                      <option value="recommended">
                        {safeT(
                          "landing.tourDiscovery.sort.recommended",
                          "Recommended",
                        )}
                      </option>
                      <option value="price-low">
                        {safeT(
                          "landing.tourDiscovery.sort.price-low",
                          "Price: Low to High",
                        )}
                      </option>
                      <option value="price-high">
                        {safeT(
                          "landing.tourDiscovery.sort.price-high",
                          "Price: High to Low",
                        )}
                      </option>
                      <option value="duration-short">
                        {safeT(
                          "landing.tourDiscovery.sort.duration-short",
                          "Duration: Shortest",
                        )}
                      </option>
                      <option value="duration-long">
                        {safeT(
                          "landing.tourDiscovery.sort.duration-long",
                          "Duration: Longest",
                        )}
                      </option>
                    </select>
                    <Icon
                      icon="heroicons-outline:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(PAGE_SIZE)].map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewType === "tours" && tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : viewType === "instances" && tourInstances.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tourInstances.map((instance) => (
                    <TourInstanceCard key={instance.id} tour={instance} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Icon icon="heroicons-outline:search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {viewType === "tours"
                      ? safeT(
                          "landing.tourDiscovery.noToursFound",
                          "No tours found",
                        )
                      : safeT(
                          "landing.tourDiscovery.noDeparturesFound",
                          "No departures found",
                        )}
                  </h3>
                  <p className="text-gray-500">
                    {viewType === "tours"
                      ? safeT(
                          "landing.tourDiscovery.tryAdjustingFilters",
                          "Try adjusting your filters or search terms",
                        )
                      : safeT(
                          "landing.tourDiscovery.noInstancesDescription",
                          "There are no upcoming departures matching your search. Please check back later.",
                        )}
                  </p>
                </div>
              )}

              {totalTours > PAGE_SIZE && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon icon="heroicons-outline:chevron-left" className="w-5 h-5" />
                    </button>
                    <span className="px-4 text-sm text-gray-600">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon icon="heroicons-outline:chevron-right" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />

      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        selectedClassifications={selectedClassifications}
        selectedCategories={selectedCategories}
        onClassificationToggle={handleClassificationToggle}
        onCategoryToggle={handleCategoryToggle}
        onClearFilters={handleClearFilters}
      />
    </>
  );
};

export default TourDiscoveryPage;
