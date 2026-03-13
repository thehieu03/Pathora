"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { PricingTierEditor } from "@/components/partials/dashboard/PricingTierEditor";
import { tourService } from "@/services/tourService";
import { handleApiError } from "@/utils/apiResponse";
import {
  DynamicPricingDto,
  TourDto,
  TourStatusMap,
  TourClassificationDto,
  TourPlanAccommodationDto,
  TourPlanLocationDto,
  TransportationTypeMap,
  ActivityTypeMap,
  RoomTypeMap,
  MealTypeMap,
  LocationTypeMap,
  InsuranceTypeMap,
} from "@/types/tour";
import { AdminLogoutButton } from "./AdminLogoutButton";

/* ══════════════════════════════════════════════════════════════
   Sidebar Navigation
   ══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "heroicons:squares-2x2", href: "/dashboard" },
  { label: "Tours", icon: "heroicons:globe-alt", href: "/tour-management" },
  {
    label: "Tour Instances",
    icon: "heroicons:calendar-days",
    href: "/tour-instances",
  },
  {
    label: "Bookings",
    icon: "heroicons:ticket",
    href: "/dashboard/bookings",
  },
  {
    label: "Payments",
    icon: "heroicons:credit-card",
    href: "/dashboard/payments",
  },
  {
    label: "Customers",
    icon: "heroicons:user-group",
    href: "/dashboard/customers",
  },
  {
    label: "Insurance",
    icon: "heroicons:shield-check",
    href: "/dashboard/insurance",
  },
  {
    label: "Visa Applications",
    icon: "heroicons:document-check",
    href: "/dashboard/visa",
  },
  {
    label: "Policies",
    icon: "heroicons:clipboard-document-list",
    href: "/dashboard/policies",
  },
  {
    label: "Settings",
    icon: "heroicons:cog-6-tooth",
    href: "/dashboard/settings",
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-lg font-semibold">Pathora Admin</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white">
          <Icon icon="heroicons:x-mark" className="size-5" />
        </button>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.label === "Tours"
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}>
            <Icon icon={item.icon} className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-700/50 p-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg">
          <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   Top Bar
   ══════════════════════════════════════════════════════════════ */
function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-slate-500">
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      <div className="relative flex-1 max-w-xl">
        <Icon
          icon="heroicons:magnifying-glass"
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>
      <div className="ml-auto relative">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon icon="heroicons:bell" className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════
   Status Badge
   ══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let bgColor = "bg-slate-100";
  let textColor = "text-slate-600";
  let icon = "heroicons:minus-circle";

  if (lower === "active") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    icon = "heroicons:check-circle";
  } else if (lower === "inactive") {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
    icon = "heroicons:x-circle";
  } else if (lower === "pending") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
    icon = "heroicons:clock";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
      <Icon icon={icon} className="size-3" />
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   Content Tab Definitions
   ══════════════════════════════════════════════════════════════ */
const CONTENT_TABS = [
  { id: "overview", label: "Overview", icon: "heroicons:information-circle" },
  { id: "itinerary", label: "Itinerary", icon: "heroicons:map" },
  {
    id: "accommodations",
    label: "Accommodations",
    icon: "heroicons:home-modern",
  },
  {
    id: "transportation",
    label: "Transportation Routes",
    icon: "heroicons:truck",
  },
  { id: "locations", label: "Locations", icon: "heroicons:map-pin" },
  {
    id: "services",
    label: "Other Services",
    icon: "heroicons:wrench-screwdriver",
  },
  { id: "insurance", label: "Insurance", icon: "heroicons:shield-check" },
];

/* ══════════════════════════════════════════════════════════════
   TourDetailPage - Main Export
   ══════════════════════════════════════════════════════════════ */
export function TourDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const tourId = params?.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tour, setTour] = useState<TourDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [classificationTiers, setClassificationTiers] = useState<
    Record<string, DynamicPricingDto[]>
  >({});
  const [savingTierForClassificationId, setSavingTierForClassificationId] =
    useState<string | null>(null);

  /* ── Fetch tour detail ────────────────────────────────────── */
  const fetchTour = useCallback(async () => {
    if (!tourId) return;
    try {
      setLoading(true);
      const result = await tourService.getTourDetail(tourId);
      if (result) {
        setTour(result);
      }
    } catch (error) {
      console.error("Failed to fetch tour detail:", error);
      toast.error(t("tourAdmin.fetchError", "Failed to load tour details"));
    } finally {
      setLoading(false);
    }
  }, [tourId, t]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  /* ── Derived data ─────────────────────────────────────────── */
  const statusLabel =
    tour?.status !== undefined
      ? (TourStatusMap[tour.status] ?? "Unknown")
      : "Unknown";
  const classifications = tour?.classifications ?? [];
  const selectedPackage: TourClassificationDto | undefined =
    classifications[selectedPackageIdx];

  useEffect(() => {
    if (!tour) {
      return;
    }

    setClassificationTiers((current) => {
      const next = { ...current };

      for (const classification of tour.classifications ?? []) {
        if (!next[classification.id]) {
          next[classification.id] = classification.dynamicPricing ?? [];
        }
      }

      return next;
    });
  }, [tour]);

  useEffect(() => {
    if (!selectedPackage?.id) {
      return;
    }

    let mounted = true;

    const fetchClassificationTiers = async () => {
      try {
        const tiers = await tourService.getClassificationPricingTiers(
          selectedPackage.id,
        );

        if (!mounted) {
          return;
        }

        setClassificationTiers((current) => ({
          ...current,
          [selectedPackage.id]: tiers,
        }));
      } catch (error) {
        console.error("Failed to load classification pricing tiers:", error);
      }
    };

    fetchClassificationTiers();

    return () => {
      mounted = false;
    };
  }, [selectedPackage?.id]);

  /* ── Format helpers ───────────────────────────────────────── */
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  /* ── Collect all routes from selected package ─────────────── */
  const allRoutes =
    selectedPackage?.plans?.flatMap((day) =>
      day.activities.flatMap((activity) => activity.routes),
    ) ?? [];

  const selectedClassificationTiers = selectedPackage
    ? classificationTiers[selectedPackage.id] ?? []
    : [];

  const handleSaveClassificationTiers = useCallback(async () => {
    if (!selectedPackage?.id) {
      return;
    }

    const tiers = classificationTiers[selectedPackage.id] ?? [];

    try {
      setSavingTierForClassificationId(selectedPackage.id);
      await tourService.upsertClassificationPricingTiers(selectedPackage.id, tiers);
      toast.success("Classification pricing tiers saved.");
    } catch (error) {
      console.error("Failed to save classification pricing tiers:", error);
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to save classification pricing tiers.");
    } finally {
      setSavingTierForClassificationId(null);
    }
  }, [classificationTiers, selectedPackage?.id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Icon
              icon="heroicons:arrow-path"
              className="size-8 animate-spin text-slate-400"
            />
          </div>
        )}

        {/* Not found */}
        {!loading && !tour && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="size-12 text-slate-300 mb-3"
            />
            <p className="text-sm text-slate-500">Tour not found</p>
            <Link
              href="/tour-management"
              className="mt-4 text-sm text-orange-500 hover:underline">
              Back to Tours
            </Link>
          </div>
        )}

        {/* Main Content */}
        {!loading && tour && (
          <>
            {/* ══════════════════════════════════════════════════
                Header Section
                ══════════════════════════════════════════════════ */}
            <div className="bg-white border-b border-slate-200">
              <div className="px-8 pt-5 pb-0">
                {/* Back + Actions */}
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href="/tour-management"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-base font-semibold transition-colors">
                    <Icon icon="heroicons:arrow-left" className="size-5" />
                    Back to Tours
                  </Link>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={statusLabel} />
                    <button
                      onClick={() =>
                        router.push(`/tour-management/${tourId}/edit`)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium rounded-lg transition-colors">
                      <Icon icon="heroicons:pencil-square" className="size-4" />
                      Edit Tour
                    </button>
                  </div>
                </div>

                {/* Tour Info Header */}
                <div className="flex gap-4 mb-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {tour.thumbnail?.publicURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={tour.thumbnail.publicURL}
                        alt={tour.tourName}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Icon
                        icon="heroicons:photo"
                        className="size-8 text-slate-400"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title + Code */}
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl font-bold text-slate-900">
                        {tour.tourName}
                      </h1>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                        {tour.tourCode}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-2">
                      {tour.shortDescription}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="heroicons:calendar" className="size-3.5" />
                        Created: {formatDate(tour.createdOnUtc)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="heroicons:clock" className="size-3.5" />
                        Updated: {formatDate(tour.lastModifiedOnUtc)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="heroicons:cube" className="size-3.5" />
                        {classifications.length} Packages
                      </span>
                    </div>
                  </div>
                </div>

                {/* Package Selector */}
                {classifications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Select Package to View Details
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {classifications.map((cls, idx) => (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedPackageIdx(idx)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                            idx === selectedPackageIdx
                              ? "bg-orange-500 border-orange-500 text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}>
                          <span>{cls.name}</span>
                          <span
                            className={`text-xs ${
                              idx === selectedPackageIdx
                                ? "opacity-90"
                                : "text-slate-400"
                            }`}>
                            {formatCurrency(cls.salePrice || cls.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedPackage && (
                      <p className="text-sm text-slate-500 mt-2">
                        <span className="font-bold">Package Details:</span>{" "}
                        {selectedPackage.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Content Tabs */}
                <div className="flex gap-1 border-t border-slate-200 -mx-8 px-8 overflow-x-auto">
                  {CONTENT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}>
                      <Icon icon={tab.icon} className="size-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                Tab Content
                ══════════════════════════════════════════════════ */}
            <div className="p-8 space-y-6">
              {activeTab === "overview" && (
                <>
                  <OverviewTab
                    tour={tour}
                    classifications={classifications}
                    selectedPackageIdx={selectedPackageIdx}
                    allRoutes={allRoutes}
                    formatCurrency={formatCurrency}
                  />

                  {selectedPackage && (
                    <PricingTierEditor
                      title="Classification Tier Pricing"
                      subtitle={`Manage default participant-tier pricing for ${selectedPackage.name}.`}
                      tiers={selectedClassificationTiers}
                      saving={savingTierForClassificationId === selectedPackage.id}
                      saveLabel="Save classification tiers"
                      infoMessage="These are default tiers. Instance-level override tiers will take precedence when configured."
                      onChange={(tiers) =>
                        setClassificationTiers((current) => ({
                          ...current,
                          [selectedPackage.id]: tiers,
                        }))
                      }
                      onSave={handleSaveClassificationTiers}
                    />
                  )}
                </>
              )}

              {activeTab === "itinerary" && selectedPackage && (
                <ItineraryTab classification={selectedPackage} />
              )}

              {activeTab === "accommodations" && selectedPackage && (
                <AccommodationsTab
                  classification={selectedPackage}
                  formatCurrency={formatCurrency}
                />
              )}

              {activeTab === "transportation" && (
                <TransportationTab
                  routes={allRoutes}
                  packageName={selectedPackage?.name}
                />
              )}

              {activeTab === "locations" && selectedPackage && (
                <LocationsTab classification={selectedPackage} />
              )}

              {activeTab === "services" && selectedPackage && (
                <OtherServicesTab
                  classification={selectedPackage}
                  formatCurrency={formatCurrency}
                />
              )}

              {activeTab === "insurance" && selectedPackage && (
                <InsuranceTab
                  classification={selectedPackage}
                  allClassifications={classifications}
                  formatCurrency={formatCurrency}
                />
              )}

              {activeTab !== "overview" &&
                activeTab !== "itinerary" &&
                activeTab !== "accommodations" &&
                activeTab !== "transportation" &&
                activeTab !== "locations" &&
                activeTab !== "services" &&
                activeTab !== "insurance" && (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                    <Icon
                      icon="heroicons:document-text"
                      className="size-12 text-slate-300 mx-auto mb-3"
                    />
                    <p className="text-sm text-slate-500">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                      content will be shown here.
                    </p>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Overview Tab
   ══════════════════════════════════════════════════════════════ */
function OverviewTab({
  tour,
  classifications,
  selectedPackageIdx,
  allRoutes,
  formatCurrency,
}: {
  tour: TourDto;
  classifications: TourClassificationDto[];
  selectedPackageIdx: number;
  allRoutes: {
    id: string;
    order: number;
    transportationName: string | null;
    note: string | null;
    durationMinutes: number | null;
    price: number | null;
  }[];
  formatCurrency: (n: number) => string;
}) {
  return (
    <>
      {/* Tour Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
          <Icon
            icon="heroicons:information-circle"
            className="size-5 text-orange-500"
          />
          Tour Information
        </h2>

        <div className="space-y-5">
          {/* Row 1: Code + Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="Tour Code" value={tour.tourCode} mono />
            <InfoField label="Tour Name" value={tour.tourName} />
          </div>

          {/* SEO Title */}
          <InfoField label="SEO Title" value={tour.seoTitle} />

          {/* Short Description */}
          <InfoField label="Short Description" value={tour.shortDescription} />

          {/* Long Description */}
          <InfoField label="Long Description" value={tour.longDescription} />

          {/* ECO / SEO Description */}
          <InfoField label="ECO Description" value={tour.seoDescription} />
        </div>
      </div>

      {/* Package Classifications */}
      {classifications.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
            <Icon icon="heroicons:tag" className="size-5 text-orange-500" />
            Package Classifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classifications.map((cls, idx) => {
              const isSelected = idx === selectedPackageIdx;
              const accommodationCount =
                cls.plans?.flatMap((d) =>
                  d.activities.filter((a) => a.accommodation),
                ).length ?? 0;
              const locationCount =
                cls.plans?.flatMap((d) =>
                  d.activities.flatMap((a) =>
                    a.routes.flatMap((r) =>
                      [r.fromLocation, r.toLocation].filter(Boolean),
                    ),
                  ),
                ).length ?? 0;
              const serviceCount = cls.insurances?.length ?? 0;

              return (
                <div
                  key={cls.id}
                  className={`rounded-xl border-2 p-4 space-y-3 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200"
                  }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      {cls.name}
                    </h3>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                      {cls.durationDays}D
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{cls.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-orange-500">
                      {formatCurrency(cls.salePrice || cls.price)}
                    </span>
                    {cls.salePrice > 0 && cls.salePrice < cls.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(cls.price)}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">/person</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-400">
                      {accommodationCount} accommodations • {locationCount}{" "}
                      locations • {serviceCount} services
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transportation Routes */}
      {allRoutes.length > 0 && <TransportationTab routes={allRoutes} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Info Field
   ══════════════════════════════════════════════════════════════ */
function InfoField({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-slate-700 leading-relaxed ${
          mono ? "font-mono" : ""
        }`}>
        {value || "—"}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Other Services Tab
   ══════════════════════════════════════════════════════════════ */
function OtherServicesTab({
  classification,
  formatCurrency,
}: {
  classification: TourClassificationDto;
  formatCurrency: (amount: number) => string;
}) {
  // Insurance items shown as services (lightweight view)
  const insurances = classification.insurances ?? [];

  if (insurances.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:wrench-screwdriver"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No other services available for {classification.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Package banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
        <p className="text-sm text-orange-700">
          Viewing services for:{" "}
          <span className="font-semibold">{classification.name}</span>
        </p>
      </div>

      {/* Service cards */}
      {insurances.map((ins) => (
        <div
          key={ins.id}
          className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            {/* Star icon */}
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Icon icon="heroicons:star" className="size-5 text-orange-500" />
            </div>

            {/* Title + badge */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900">
                {ins.insuranceName}
              </h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold text-orange-700 bg-orange-100 rounded">
                Per Person
              </span>
            </div>

            {/* Price */}
            <span className="text-lg font-bold text-slate-900 shrink-0">
              {formatCurrency(ins.coverageFee)}
            </span>
          </div>

          {/* Contact info */}
          {ins.insuranceProvider && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-4 ml-[52px] text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Icon
                  icon="heroicons:envelope"
                  className="size-3.5 text-slate-400"
                />
                {ins.insuranceProvider}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Insurance Tab
   ══════════════════════════════════════════════════════════════ */
const INSURANCE_BADGE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-gray-100", text: "text-gray-600" },
  1: { bg: "bg-blue-100", text: "text-blue-700" },
  2: { bg: "bg-green-100", text: "text-green-700" },
  3: { bg: "bg-amber-100", text: "text-amber-700" },
  4: { bg: "bg-purple-100", text: "text-purple-700" },
  5: { bg: "bg-red-100", text: "text-red-700" },
  6: { bg: "bg-orange-100", text: "text-orange-700" },
};

function InsuranceTab({
  classification,
  allClassifications,
  formatCurrency,
}: {
  classification: TourClassificationDto;
  allClassifications: TourClassificationDto[];
  formatCurrency: (amount: number) => string;
}) {
  const insurances = classification.insurances ?? [];

  if (insurances.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:shield-check"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No insurance packages available for {classification.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
        <p className="text-sm text-green-700">
          {insurances.length} insurance package(s) are available for customers
          booking this tour.
        </p>
      </div>

      {/* Insurance cards */}
      {insurances.map((ins) => {
        const typeName = InsuranceTypeMap[ins.insuranceType] ?? "Other";
        const badge =
          INSURANCE_BADGE_COLORS[ins.insuranceType] ??
          INSURANCE_BADGE_COLORS[0];

        // Parse coverageDescription lines
        const descriptionLines = ins.coverageDescription
          ? ins.coverageDescription
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
          : [];

        return (
          <div
            key={ins.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Icon icon="heroicons:shield-check" className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900">
                    {ins.insuranceName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provider: {ins.insuranceProvider}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${badge.bg} ${badge.text}`}>
                  {formatCurrency(ins.coverageFee)}/person
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-5">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Coverage Amount
                  </p>
                  <p className="text-sm font-bold text-green-600 mt-0.5">
                    {formatCurrency(ins.coverageAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Type
                  </p>
                  <p className="text-sm text-slate-800 mt-0.5">{typeName}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Optional
                  </p>
                  <p className="text-sm text-slate-800 mt-0.5">
                    {ins.isOptional ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage details */}
            {descriptionLines.length > 0 && (
              <div className="px-6 pb-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Coverage Details
                </p>
                <ul className="space-y-1.5">
                  {descriptionLines.map((line, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-600">
                      <Icon
                        icon="heroicons:check-circle"
                        className="size-4 text-green-500 shrink-0 mt-px"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applicable classifications */}
            {allClassifications.length > 1 && (
              <div className="px-6 pb-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Applicable Classifications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allClassifications
                    .filter((c) =>
                      (c.insurances ?? []).some((i) => i.id === ins.id),
                    )
                    .map((c) => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-100 text-orange-700">
                        {c.name}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Note */}
            {ins.note && (
              <div className="mx-6 mb-5 px-3 py-2 bg-orange-50 border border-orange-100 rounded-lg">
                <p className="text-xs text-orange-700">
                  <span className="font-semibold">Note:</span> {ins.note}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Accommodations Tab
   ══════════════════════════════════════════════════════════════ */
const decodeMeals = (value: number): string => {
  if (value === 0) return "None";
  const meals: string[] = [];
  if (value & 1) meals.push("Breakfast");
  if (value & 2) meals.push("Lunch");
  if (value & 4) meals.push("Dinner");
  if (meals.length > 0) return meals.join(", ");
  return MealTypeMap[value] ?? "—";
};

function AccommodationsTab({
  classification,
  formatCurrency,
}: {
  classification: TourClassificationDto;
  formatCurrency: (amount: number) => string;
}) {
  // Collect all accommodations from activities across all days
  const accommodations: TourPlanAccommodationDto[] = (
    classification.plans ?? []
  ).flatMap((day) =>
    day.activities
      .filter((a) => a.accommodation != null)
      .map((a) => a.accommodation!),
  );

  if (accommodations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:home-modern"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No accommodations available for this package.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Package banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
        <p className="text-sm text-orange-700">
          Viewing accommodations for:{" "}
          <span className="font-semibold">{classification.name}</span>
        </p>
      </div>

      {/* Accommodation cards */}
      {accommodations.map((acc) => (
        <div
          key={acc.id}
          className="bg-white border border-slate-200 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Icon icon="heroicons:building-office" className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {acc.accommodationName}
            </h3>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-4">
            {/* Row 1 */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Room Type
              </p>
              <p className="text-sm text-slate-800">
                {RoomTypeMap[acc.roomType] ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Capacity
              </p>
              <p className="text-sm text-slate-800">
                <Icon
                  icon="heroicons:users"
                  className="size-3.5 inline mr-1 -mt-0.5 text-slate-500"
                />
                {acc.roomCapacity} guests
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Price
              </p>
              <p className="text-sm">
                <span className="text-orange-600 font-semibold">
                  {acc.roomPrice != null ? formatCurrency(acc.roomPrice) : "—"}
                </span>
                {acc.roomPrice != null && (
                  <span className="text-slate-400 text-xs"> / Per Room</span>
                )}
              </p>
            </div>

            {/* Row 2 */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Check-in
              </p>
              <p className="text-sm text-slate-800">{acc.checkInTime ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Check-out
              </p>
              <p className="text-sm text-slate-800">
                {acc.checkOutTime ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Meals
              </p>
              <p className="text-sm text-slate-800 italic">
                {decodeMeals(acc.mealsIncluded)}
              </p>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="border-t border-slate-100 pt-3 space-y-1.5">
            {(acc.address || acc.city) && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Icon
                  icon="heroicons:map-pin"
                  className="size-3.5 text-slate-400 shrink-0"
                />
                {[acc.address, acc.city].filter(Boolean).join(", ")}
              </p>
            )}
            {acc.contactPhone && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Icon
                  icon="heroicons:phone"
                  className="size-3.5 text-slate-400 shrink-0"
                />
                {acc.contactPhone}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Locations Tab
   ══════════════════════════════════════════════════════════════ */
const LOCATION_BADGE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-blue-100", text: "text-blue-700" },
  1: { bg: "bg-purple-100", text: "text-purple-700" },
  2: { bg: "bg-green-100", text: "text-green-700" },
  3: { bg: "bg-purple-100", text: "text-purple-700" },
  4: { bg: "bg-cyan-100", text: "text-cyan-700" },
  5: { bg: "bg-amber-100", text: "text-amber-700" },
  6: { bg: "bg-pink-100", text: "text-pink-700" },
  7: { bg: "bg-red-100", text: "text-red-700" },
  8: { bg: "bg-indigo-100", text: "text-indigo-700" },
  9: { bg: "bg-sky-100", text: "text-sky-700" },
  10: { bg: "bg-orange-100", text: "text-orange-700" },
  11: { bg: "bg-teal-100", text: "text-teal-700" },
  12: { bg: "bg-slate-100", text: "text-slate-700" },
  99: { bg: "bg-gray-100", text: "text-gray-700" },
};

function LocationsTab({
  classification,
}: {
  classification: TourClassificationDto;
}) {
  // Collect unique locations from all routes across all days
  const locationMap = new Map<string, TourPlanLocationDto>();
  (classification.plans ?? []).forEach((day) =>
    day.activities.forEach((activity) =>
      activity.routes.forEach((route) => {
        if (route.fromLocation)
          locationMap.set(route.fromLocation.id, route.fromLocation);
        if (route.toLocation)
          locationMap.set(route.toLocation.id, route.toLocation);
      }),
    ),
  );
  const locations = Array.from(locationMap.values());

  if (locations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:map-pin"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No locations available for {classification.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Package banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
        <p className="text-sm text-orange-700">
          Viewing locations for:{" "}
          <span className="font-semibold">{classification.name}</span>
        </p>
      </div>

      {/* Location cards */}
      {locations.map((loc) => {
        const typeName = LocationTypeMap[loc.locationType] ?? "Other";
        const badge =
          LOCATION_BADGE_COLORS[loc.locationType] ?? LOCATION_BADGE_COLORS[99];
        const hasCoords = loc.latitude != null && loc.longitude != null;

        return (
          <div
            key={loc.id}
            className="bg-white border border-slate-200 rounded-xl p-6">
            {/* Header row */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon
                  icon="heroicons:map-pin"
                  className="size-5 text-green-600"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">
                  {loc.locationName}
                </h3>
                {loc.locationDescription && (
                  <p className="text-sm text-slate-500 mt-0.5">
                    {loc.locationDescription}
                  </p>
                )}
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${badge.bg} ${badge.text}`}>
                {typeName}
              </span>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-12">
              {(loc.address || loc.city) && (
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Address:{" "}
                  </span>
                  <span className="text-xs text-slate-500">
                    {[loc.address, loc.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {loc.city && (
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    City:{" "}
                  </span>
                  <span className="text-xs text-slate-500">
                    {[loc.city, loc.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {loc.entranceFee != null && (
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Entrance Fee:{" "}
                  </span>
                  <span className="text-xs text-slate-500">
                    {loc.entranceFee === 0
                      ? "Free (Per Person)"
                      : `${loc.entranceFee.toLocaleString()} VND (Per Person)`}
                  </span>
                </div>
              )}
              {hasCoords && (
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Coordinates:{" "}
                  </span>
                  <span className="text-xs text-slate-500">
                    {loc.latitude}, {loc.longitude}
                  </span>
                </div>
              )}
            </div>

            {/* Note */}
            {loc.note && (
              <div className="mt-3 ml-12 px-3 py-2 bg-orange-50 border border-orange-100 rounded-lg">
                <p className="text-xs text-orange-700">
                  <span className="font-semibold">Note:</span> {loc.note}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Transportation Tab
   ══════════════════════════════════════════════════════════════ */
function TransportationTab({
  routes,
  packageName,
}: {
  routes: {
    id: string;
    order: number;
    transportationName: string | null;
    note: string | null;
    durationMinutes: number | null;
    price: number | null;
    fromLocation?: { locationName: string } | null;
    toLocation?: { locationName: string } | null;
    transportationType?: number;
  }[];
  packageName?: string;
}) {
  if (routes.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:truck"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No transportation routes available
          {packageName ? ` for ${packageName}` : ""}
        </p>
      </div>
    );
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
        <Icon icon="heroicons:truck" className="size-5 text-orange-500" />
        Transportation Routes
      </h2>

      <div className="space-y-3">
        {routes.map((route, idx) => {
          const routeTitle =
            route.fromLocation && route.toLocation
              ? `${route.fromLocation.locationName} to ${route.toLocation.locationName}`
              : route.transportationName || `Route ${idx + 1}`;

          const transportType =
            route.transportationType !== undefined
              ? (TransportationTypeMap[route.transportationType] ?? "")
              : (route.transportationName ?? "");

          const details = [
            transportType,
            formatDuration(route.durationMinutes),
            route.note,
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <div
              key={route.id}
              className="flex items-center gap-4 px-4 py-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {routeTitle}
                </p>
                {details && <p className="text-xs text-slate-500">{details}</p>}
              </div>
              {route.price != null && route.price > 0 && (
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-normal">
                  Per Person
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Itinerary Tab
   ══════════════════════════════════════════════════════════════ */
/* Activity type → badge color mapping */
const ACTIVITY_BADGE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-blue-100", text: "text-blue-700" }, // Sightseeing
  1: { bg: "bg-red-100", text: "text-red-700" }, // Dining
  2: { bg: "bg-purple-100", text: "text-purple-700" }, // Shopping
  3: { bg: "bg-green-100", text: "text-green-700" }, // Adventure
  4: { bg: "bg-teal-100", text: "text-teal-700" }, // Relaxation
  5: { bg: "bg-amber-100", text: "text-amber-700" }, // Cultural
  6: { bg: "bg-pink-100", text: "text-pink-700" }, // Entertainment
  7: { bg: "bg-sky-100", text: "text-sky-700" }, // Transportation
  8: { bg: "bg-rose-100", text: "text-rose-700" }, // Accommodation
  9: { bg: "bg-teal-100", text: "text-teal-700" }, // Free Time
  99: { bg: "bg-orange-100", text: "text-orange-700" }, // Other
};

const ACTIVITY_ICONS: Record<number, string> = {
  0: "heroicons:eye",
  1: "heroicons:cake",
  2: "heroicons:shopping-bag",
  3: "heroicons:fire",
  4: "heroicons:sparkles",
  5: "heroicons:building-library",
  6: "heroicons:musical-note",
  7: "heroicons:truck",
  8: "heroicons:home-modern",
  9: "heroicons:clock",
  99: "heroicons:ellipsis-horizontal-circle",
};

function ItineraryTab({
  classification,
}: {
  classification: TourClassificationDto;
}) {
  const days = [...(classification.plans ?? [])].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    () => new Set(days.length > 0 ? [days[0].id] : []),
  );

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayId)) next.delete(dayId);
      else next.add(dayId);
      return next;
    });
  };

  if (days.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Icon
          icon="heroicons:map"
          className="size-12 text-slate-300 mx-auto mb-3"
        />
        <p className="text-sm text-slate-500">
          No itinerary available for this package.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isExpanded = expandedDays.has(day.id);
        const sortedActivities = [...day.activities].sort(
          (a, b) => a.order - b.order,
        );

        return (
          <div
            key={day.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Day header – always visible */}
            <button
              type="button"
              onClick={() => toggleDay(day.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors">
              {/* Day number circle */}
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {day.dayNumber}
              </div>

              {/* Title & description */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900">
                  {day.title}
                </h3>
                {day.description && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {day.description}
                  </p>
                )}
              </div>

              {/* Activity count + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                {!isExpanded && sortedActivities.length > 0 && (
                  <span className="text-xs text-orange-600 font-medium">
                    {sortedActivities.length} activities
                  </span>
                )}
                <Icon
                  icon="heroicons:chevron-down"
                  className={`size-5 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Expanded: activity list */}
            {isExpanded && sortedActivities.length > 0 && (
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {sortedActivities.map((activity, idx) => {
                    const badgeColor =
                      ACTIVITY_BADGE_COLORS[activity.activityType] ??
                      ACTIVITY_BADGE_COLORS[99];
                    const actIcon =
                      ACTIVITY_ICONS[activity.activityType] ??
                      ACTIVITY_ICONS[99];
                    const typeName =
                      ActivityTypeMap[activity.activityType] ?? "Other";

                    return (
                      <div
                        key={activity.id}
                        className="flex gap-3 p-4 bg-slate-50 rounded-xl">
                        {/* Icon circle */}
                        <div
                          className={`w-8 h-8 rounded-full ${badgeColor.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon
                            icon={actIcon}
                            className={`size-4 ${badgeColor.text}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badge + time row */}
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${badgeColor.bg} ${badgeColor.text}`}>
                              {typeName}
                            </span>
                            {activity.startTime && (
                              <span className="text-xs text-slate-400">
                                {activity.startTime}
                                {activity.endTime && ` – ${activity.endTime}`}
                              </span>
                            )}
                            {activity.isOptional && (
                              <span className="text-[11px] text-blue-500 font-medium">
                                Optional
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <p className="text-sm font-semibold text-slate-800">
                            {activity.title}
                          </p>

                          {/* Description */}
                          {activity.description && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {activity.description}
                            </p>
                          )}

                          {/* Note */}
                          {activity.note && (
                            <div className="mt-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-lg">
                              <p className="text-xs text-orange-700">
                                <Icon
                                  icon="heroicons:information-circle"
                                  className="size-3.5 inline mr-1 -mt-0.5"
                                />
                                {activity.note}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Activity number */}
                        <span className="text-xs text-slate-400 font-medium shrink-0">
                          #{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
