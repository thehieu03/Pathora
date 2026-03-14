"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { HeroSection } from "./HeroSection";
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { FilterDrawer } from "./FilterDrawer";
import { TourCard } from "./TourCard";
import { TourInstanceCard } from "./TourInstanceCard";
import { homeService } from "@/api/services/homeService";
import { tourService } from "@/api/services/tourService";
import { mapTourVmToSearchTour } from "@/api/services/tourMappers";
import { SearchTour } from "@/types/home";
import { NormalizedTourInstanceVm } from "@/types/tour";
import { Icon } from "@/components/ui";

const PAGE_SIZE = 12;

export const TourDiscoveryPage = () => {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const safeT = (key: string, fallback: string) => {
    return mounted ? t(key, fallback) : fallback;
  };

  // State
  const [tours, setTours] = useState<SearchTour[]>([]);
  const [tourInstances, setTourInstances] = useState<NormalizedTourInstanceVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTours, setTotalTours] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter state
  const [selectedClassifications, setSelectedClassifications] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewType, setViewType] = useState<"tour" | "tourInstance">("tourInstance");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch tours/instances based on viewType
  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      if (viewType === "tour") {
        // Fetch Tours (template tours)
        const result = await tourService.getAllTours(
          searchText || undefined,
          currentPage,
          PAGE_SIZE
        );
        if (result) {
          setTours((result.data ?? []).map(mapTourVmToSearchTour));
          setTotalTours(result.total || 0);
          setTourInstances([]);
        }
      } else {
        // Fetch Tour Instances (scheduled tours)
        const result = await homeService.getAvailablePublicInstances(
          searchText || undefined,
          currentPage,
          PAGE_SIZE
        );
        if (result) {
          setTourInstances(result.data || []);
          setTotalTours(result.total || 0);
          setTours([]);
        }
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      if (viewType === "tour") {
        setTours([]);
      } else {
        setTourInstances([]);
      }
      setTotalTours(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchText, selectedClassifications, sortBy, viewType]);

  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also fetch when viewType changes
  useEffect(() => {
    setCurrentPage(1);
    fetchTours();
  }, [viewType]);

  // Handle search
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchTours();
  };

  // Handle filter changes
  const handleClassificationToggle = (value: string) => {
    setSelectedClassifications((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handleCategoryToggle = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedClassifications([]);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleViewTypeChange = (value: "tour" | "tourInstance") => {
    setViewType(value);
    setCurrentPage(1);
  };

  return (
    <>
      <LandingHeader />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection />

        {/* Search Bar */}
        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          onFilterToggle={() => setFilterDrawerOpen(true)}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                selectedClassifications={selectedClassifications}
                selectedCategories={selectedCategories}
                onClassificationToggle={handleClassificationToggle}
                onCategoryToggle={handleCategoryToggle}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Tour Grid */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Left side: View type tabs + Results count */}
                <div className="flex items-center gap-4">
                  {/* View type tabs */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setViewType("tour")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        viewType === "tour"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {safeT("landing.tourDiscovery.viewType.tour", "Tours")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("tourInstance")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        viewType === "tourInstance"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {safeT("landing.tourDiscovery.viewType.tourInstance", "Tour Instances")}
                    </button>
                  </div>

                  {/* Results count */}
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{totalTours}</span>{" "}
                    {safeT("landing.tourDiscovery.toursFound", "tours found")}
                  </p>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{safeT("landing.tourDiscovery.sortBy", "Sort by")}:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fa8b02]/20 focus:border-[#fa8b02] cursor-pointer"
                    >
                      <option value="recommended">{safeT("landing.tourDiscovery.sort.recommended", "Recommended")}</option>
                      <option value="price-low">{safeT("landing.tourDiscovery.sort.price-low", "Price: Low to High")}</option>
                      <option value="price-high">{safeT("landing.tourDiscovery.sort.price-high", "Price: High to Low")}</option>
                      <option value="duration-short">{safeT("landing.tourDiscovery.sort.duration-short", "Duration: Shortest")}</option>
                      <option value="duration-long">{safeT("landing.tourDiscovery.sort.duration-long", "Duration: Longest")}</option>
                    </select>
                    <Icon
                      icon="heroicons-outline:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewType === "tour" && tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : viewType === "tourInstance" && tourInstances.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tourInstances.map((instance) => (
                    <TourInstanceCard key={instance.id} tour={instance} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Icon icon="heroicons-outline:search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {safeT("landing.tourDiscovery.noToursFound", "No tours found")}
                  </h3>
                  <p className="text-gray-500">
                    {safeT("landing.tourDiscovery.tryAdjustingFilters", "Try adjusting your filters or search terms")}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalTours > PAGE_SIZE && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon icon="heroicons-outline:chevron-left" className="w-5 h-5" />
                    </button>
                    <span className="px-4 text-sm text-gray-600">
                      {currentPage} / {Math.ceil(totalTours / PAGE_SIZE)}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage >= Math.ceil(totalTours / PAGE_SIZE)}
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

      {/* Mobile Filter Drawer */}
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
