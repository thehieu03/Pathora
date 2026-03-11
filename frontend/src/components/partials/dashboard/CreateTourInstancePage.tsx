"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { tourService } from "@/services/tourService";
import { tourInstanceService } from "@/services/tourInstanceService";
import { TourVm, TourDto, TourClassificationDto } from "@/types/tour";

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
  { label: "Bookings", icon: "heroicons:ticket", href: "/bookings" },
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
    href: "/policies",
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
              item.label === "Tour Instances"
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
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
          <Icon icon="heroicons:arrow-right-on-rectangle" className="size-5" />
          <span>Logout</span>
        </button>
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
   Instance Type Card
   ══════════════════════════════════════════════════════════════ */
const INSTANCE_TYPES = [
  {
    id: "FIT",
    label: "FIT",
    description: "Free Independent Traveler",
    icon: "heroicons:user",
    color: "blue",
  },
  {
    id: "MICE",
    label: "MICE",
    description: "Meetings, Incentives, Conferences, Exhibitions",
    icon: "heroicons:building-office-2",
    color: "purple",
  },
  {
    id: "GROUP",
    label: "Group Tour",
    description: "Traditional group tour",
    icon: "heroicons:user-group",
    color: "green",
  },
];

/* ══════════════════════════════════════════════════════════════
   CreateTourInstancePage – Main Export
   ══════════════════════════════════════════════════════════════ */
export function CreateTourInstancePage() {
  const { t, i18n } = useTranslation();
  const languageKey = i18n.resolvedLanguage || i18n.language;
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Step 1 state
  const [tours, setTours] = useState<TourVm[]>([]);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [tourDetail, setTourDetail] = useState<TourDto | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);

  // Step 2 state
  const [selectedClassificationId, setSelectedClassificationId] = useState("");

  // Step 3 state
  const [instanceType, setInstanceType] = useState("FIT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* ── Fetch tours list ─────────────────────────────────────── */
  const fetchTours = useCallback(async () => {
    try {
      const result = await tourService.getAllTours(undefined, 1, 100);
      if (result) setTours(result.data ?? []);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  }, [languageKey]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  /* ── Load tour detail when selected ───────────────────────── */
  useEffect(() => {
    if (!selectedTourId) {
      setTourDetail(null);
      setSelectedClassificationId("");
      return;
    }
    const loadDetail = async () => {
      setLoadingTour(true);
      try {
        const result = await tourService.getTourDetail(selectedTourId);
        if (result) {
          setTourDetail(result);
          setSelectedClassificationId("");
        }
      } catch (error) {
        console.error("Failed to load tour detail:", error);
        toast.error(t("tourInstance.fetchError", "Failed to load tour instances"));
      } finally {
        setLoadingTour(false);
      }
    };
    loadDetail();
  }, [selectedTourId, t, languageKey]);

  /* ── Derived ──────────────────────────────────────────────── */
  const classifications: TourClassificationDto[] =
    tourDetail?.classifications ?? [];
  const selectedClassification = classifications.find(
    (c) => c.id === selectedClassificationId,
  );

  const formatCurrency = (amount: number) =>
    `${new Intl.NumberFormat(languageKey || "en-US").format(amount)} VND`;

  const canSubmit =
    selectedTourId &&
    selectedClassificationId &&
    instanceType &&
    startDate &&
    endDate &&
    maxParticipants;

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await tourInstanceService.createInstance({
        tourId: selectedTourId,
        classificationId: selectedClassificationId,
        instanceType,
        startDate,
        endDate,
        maxParticipants: parseInt(maxParticipants, 10),
      });
      toast.success(
        t("tourInstance.created", "Tour instance created successfully!"),
      );
      router.push("/tour-instances");
    } catch (error) {
      console.error("Failed to create tour instance:", error);
      toast.error(
        t("tourInstance.createError", "Failed to create tour instance"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition";

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

        {/* ── Sticky Header ──────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/tour-instances")}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Icon
                  icon="heroicons:arrow-left"
                  className="size-5 text-slate-500"
                />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {t("tourInstance.createTitle")}
                </h1>
                <p className="text-sm text-slate-500">
                  {t("tourInstance.createSubtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/tour-instances")}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                {t("tourInstance.cancel")}
              </button>
              <button
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
                <Icon icon="heroicons:bookmark" className="size-4" />
                {submitting
                  ? t("tourInstance.creating")
                  : t("tourInstance.createTitle")}
              </button>
            </div>
          </div>
        </div>

        <main id="main-content" className="max-w-4xl mx-auto p-8 space-y-6">
          {/* ── Info Banner ─────────────────────────────── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Icon
              icon="heroicons:information-circle"
              className="size-5 text-blue-600 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {t("tourInstance.createTitle")}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {t("tourInstance.createInfo")}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
             Step 1: Select Package Tour
             ══════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  icon="heroicons:map-pin"
                  className="size-5 text-slate-700"
                />
                <h2 className="text-lg font-bold text-slate-900">
                  {t("tourInstance.step1Title")}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {t("tourInstance.step1Subtitle")}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                {t("tourInstance.packageTour")} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className={inputClass}>
                <option value="">{t("tourInstance.selectPackageTour")}</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.tourName}
                  </option>
                ))}
              </select>

              {/* Tour detail info */}
              {loadingTour && (
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center">
                  <Icon
                    icon="heroicons:arrow-path"
                    className="size-5 animate-spin text-slate-400"
                  />
                </div>
              )}

              {tourDetail && !loadingTour && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-slate-600">
                    {tourDetail.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {classifications.length} {t("tourInstance.packageClassification")}
                    </span>
                    {classifications[0] && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        {classifications[0].durationDays} {t("tourInstance.days")} {t("tourInstance.itinerary")}
                      </span>
                    )}
                    {classifications[0]?.insurances?.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        <Icon
                          icon="heroicons:shield-check"
                          className="size-3"
                        />
                        {classifications[0].insurances.length} {t("tourInstance.insurance")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
             Step 2: Select Package Classification
             ══════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="heroicons:tag" className="size-5 text-slate-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  {t("tourInstance.step2Title")}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {t("tourInstance.step2Subtitle")}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                {t("tourInstance.packageClassification")} <span className="text-red-500">*</span>
              </label>

              {!selectedTourId && (
                  <p className="text-sm text-slate-400 italic">
                    {t("tourInstance.selectTourFirst")}
                  </p>
              )}

              {selectedTourId &&
                classifications.length === 0 &&
                !loadingTour && (
                  <p className="text-sm text-slate-400 italic">
                    {t("tourInstance.noClassifications")}
                  </p>
                )}

              <div className="space-y-3">
                {classifications.map((cls) => {
                  const isSelected = selectedClassificationId === cls.id;
                  return (
                    <label
                      key={cls.id}
                      className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="classification"
                          value={cls.id}
                          checked={isSelected}
                          onChange={() => setSelectedClassificationId(cls.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-orange-500"
                              : "border-slate-300"
                          }`}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">
                                {cls.name}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                {cls.durationDays} {t("tourInstance.days")}
                              </span>
                            </div>
                            <div className="text-right">
                              {cls.salePrice > 0 &&
                                cls.salePrice < cls.price && (
                                  <p className="text-xs text-slate-400 line-through">
                                    {formatCurrency(cls.price)}
                                  </p>
                                )}
                              <p className="text-lg font-bold text-orange-600">
                                {formatCurrency(
                                  cls.salePrice > 0 ? cls.salePrice : cls.price,
                                )}
                              </p>
                                <p className="text-xs text-slate-500">{t("tourInstance.perPerson")}</p>
                              </div>
                            </div>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {cls.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
             Step 3: Tour Instance Details
             ══════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  icon="heroicons:calendar-days"
                  className="size-5 text-slate-700"
                />
                <h2 className="text-lg font-bold text-slate-900">
                  {t("tourInstance.step3Title")}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {t("tourInstance.step3Subtitle")}
              </p>
            </div>

            <div className="space-y-6">
              {/* Tour Instance Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  {t("tourInstance.instanceType")} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {INSTANCE_TYPES.map((type) => {
                    const isSelected = instanceType === type.id;
                    const colorMap: Record<
                      string,
                      { bg: string; border: string; icon: string }
                    > = {
                      blue: {
                        bg: "bg-blue-50",
                        border: "border-blue-500",
                        icon: "text-blue-600",
                      },
                      purple: {
                        bg: "bg-purple-50",
                        border: "border-purple-500",
                        icon: "text-purple-600",
                      },
                      green: {
                        bg: "bg-green-50",
                        border: "border-green-500",
                        icon: "text-green-600",
                      },
                    };
                    const colors = colorMap[type.color] ?? colorMap.blue;
                    const typeLabelMap: Record<string, string> = {
                      FIT: t("tourInstance.fit"),
                      MICE: t("tourInstance.mice"),
                      GROUP: t("tourInstance.group"),
                    };
                    const typeDescMap: Record<string, string> = {
                      FIT: t("tourInstance.fitDescription"),
                      MICE: t("tourInstance.miceDescription"),
                      GROUP: t("tourInstance.groupDescription"),
                    };
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInstanceType(type.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          isSelected
                            ? `${colors.bg} ${colors.border}`
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}>
                        <Icon
                          icon={type.icon}
                          className={`size-6 mb-2 ${isSelected ? colors.icon : "text-slate-400"}`}
                        />
                        <p
                          className={`text-sm font-bold ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                          {typeLabelMap[type.id] ?? type.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {typeDescMap[type.id] ?? type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MICE Info Banner */}
              {instanceType === "MICE" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
                  <Icon
                    icon="heroicons:information-circle"
                    className="size-5 text-purple-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-purple-900">
                      {t("tourInstance.mice")} {t("tourInstance.title")}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      {t("tourInstance.miceInfo")}
                    </p>
                  </div>
                </div>
              )}

              {/* Date fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("tourInstance.startDate")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("tourInstance.endDate")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("tourInstance.maxParticipants")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  placeholder={t("tourInstance.maxParticipants")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
             Instance Summary
             ══════════════════════════════════════════════ */}
          {canSubmit && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {t("tourInstance.instanceSummary")}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">{t("tourInstance.packageTour")}</p>
                  <p className="font-medium text-slate-900">
                    {tourDetail?.tourName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("tourInstance.classification")}</p>
                  <p className="font-medium text-slate-900">
                    {selectedClassification?.name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("tourInstance.instanceType")}</p>
                  <p className="font-medium text-slate-900">{instanceType}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("tourInstance.duration")}</p>
                  <p className="font-medium text-slate-900">
                    {startDate && endDate
                      ? `${startDate} → ${endDate}`
                      : t("common.noData", "No data")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("tourInstance.maxParticipants")}</p>
                  <p className="font-medium text-slate-900">
                    {maxParticipants}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("tourInstance.basePrice")}</p>
                  <p className="font-medium text-orange-600">
                    {selectedClassification
                      ? formatCurrency(
                          selectedClassification.salePrice > 0
                            ? selectedClassification.salePrice
                            : selectedClassification.price,
                        )
                      : t("common.noData", "No data")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
