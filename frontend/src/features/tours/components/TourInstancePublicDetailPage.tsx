"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";
import { Icon } from "@/components/ui";
import Button from "@/components/ui/Button";
import Image from "@/features/shared/components/LandingImage";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { homeService } from "@/api/services/homeService";
import { handleApiError } from "@/utils/apiResponse";
import { useAuth } from "@/contexts/AuthContext";
import {
  NormalizedTourInstanceDto,
  TourInstanceStatusMap,
} from "@/types/tour";

// Localized currency formatter - adapts to active language locale
const createCurrencyFormatter = (locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// Localized date formatter - adapts to active language locale
const createDateFormatter = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Format currency with locale awareness
const formatCurrency = (value: number, locale: string): string => {
  const formatter = createCurrencyFormatter(locale);
  return formatter.format(value).replace("VND", "VND").trim();
};

// Format date with locale awareness
const toDateText = (value: string | null | undefined, locale: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const formatter = createDateFormatter(locale);
  return formatter.format(date);
};

/* ── Info Pill ─────────────────────────────────────────────── */
function InfoPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
      <div className="bg-orange-50/80 rounded-full size-12 flex items-center justify-center shrink-0">
        <Icon icon={icon} className="text-orange-500 size-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-[0.5px] text-gray-400 font-semibold mb-0.5">
          {label}
        </span>
        <span className="text-sm font-bold text-[#05073c] break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.trim().toLowerCase().replace(/[\s_]+/g, "");
  const config = TourInstanceStatusMap[normalized] ?? {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`size-2 rounded-full ${config.dot}`} />
      {t(`tourInstance.statusLabels.${normalized}`, config.label)}
    </span>
  );
}

/* ── Guest Row Component ────────────────────────────────────── */
function GuestRow({
  label,
  subtitle,
  value,
  onDecrement,
  onIncrement,
  showBorder = true,
}: {
  label: string;
  subtitle?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  showBorder?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${showBorder ? "border-b border-gray-100" : ""}`}>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-[#05073c]">{label}</span>
        {subtitle && (
          <span className="text-[10px] text-gray-400 leading-[15px]">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 hover:shadow-md active:scale-95 transition-all text-gray-500 shrink-0">
          <HiOutlineMinus className="w-4 h-4" strokeWidth={2} />
        </button>
        <span className="text-sm font-extrabold text-[#05073c] w-8 text-center tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 hover:shadow-md active:scale-95 transition-all text-gray-500 shrink-0">
          <HiOutlinePlus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export function TourInstancePublicDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params.id as string;

  const resolveApiLanguage = useCallback((): string => {
    return i18n.resolvedLanguage || i18n.language || "en";
  }, [i18n.resolvedLanguage, i18n.language]);

  const [activeTab, setActiveTab] = useState<"overview" | "pricing">("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NormalizedTourInstanceDto | null>(null);
  const [apiLanguage, setApiLanguage] = useState(() => resolveApiLanguage());

  // Guest selection state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  useEffect(() => {
    const handleLanguageChanged = (language: string): void => {
      setApiLanguage(language || resolveApiLanguage());
    };

    i18n.on("languageChanged", handleLanguageChanged);
    setApiLanguage(resolveApiLanguage());

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, resolveApiLanguage]);

  // Formatter locale based on active language (e.g., 'en' -> 'en-GB', 'vi' -> 'vi-VN')
  const formatterLocale = useMemo(() => {
    return apiLanguage === "vi" ? "vi-VN" : "en-GB";
  }, [apiLanguage]);

  // Subscribe to language changes and refetch data
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const detail = await homeService.getPublicInstanceDetail(id, apiLanguage);
        setData(detail);
      } catch (error: unknown) {
        const handledError = handleApiError(error);
        console.error("Failed to load public instance detail:", handledError.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, apiLanguage]);

  const heroImage = useMemo(() => {
    if (!data) return "";
    return data.thumbnail?.publicURL || data.images?.[0]?.publicURL || "";
  }, [data]);

  const galleryImages = useMemo(
    () =>
      (data?.images?.map((img) => img.publicURL).filter(Boolean) as string[]) ??
      [],
    [data?.images],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <LandingHeader variant="solid" />
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 rounded-xl bg-slate-200" />
            <div className="h-72 rounded-xl bg-slate-200" />
            <div className="h-72 rounded-xl bg-slate-200" />
          </div>
        </div>
        <LandingFooter />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <LandingHeader variant="solid" />
        <div className="mx-auto max-w-2xl p-6 md:p-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Icon
              icon="heroicons:exclamation-circle"
              className="mx-auto mb-2 size-10 text-slate-400"
            />
            <p className="text-base font-semibold text-slate-900">
              {t("tourInstance.notFound", "Tour instance not found")}
            </p>
            <Link
              href="/tours"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours", "All tours")}
            </Link>
          </div>
        </div>
        <LandingFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero Section ───────────────────────────────────── */}
      <div className="relative h-[60vh] max-h-[600px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-20">
          <LandingHeader />
        </div>

        {/* Back + Heart/Share buttons */}
        <div className="absolute inset-x-0 top-[81px] z-10 mx-auto max-w-6xl px-6 md:px-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/tours/${data.tourId}`}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 backdrop-blur-md">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("tourInstance.backToTour", "Back to tour")}
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-6xl px-6 pb-10 md:px-8">
          <div className="flex flex-col items-start gap-4">
            {/* Breadcrumb Floating Pill */}
            <nav className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-md">
              <Link href="/home" className="transition-colors hover:text-white">
                {t("landing.tourDetail.home", "Home")}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <Link href="/tours" className="transition-colors hover:text-white">
                {t("landing.tourDetail.packageTours", "Package Tours")}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <Link href={`/tours/${data.tourId}`} className="transition-colors hover:text-white truncate max-w-[100px] md:max-w-[200px]">
                {data.tourName}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <span className="font-semibold text-white truncate max-w-[100px] md:max-w-none">
                {data.title}
              </span>
            </nav>

            <div>
              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold text-white">
                  <Icon icon="heroicons:tag" className="size-3" />
                  {data.tourInstanceCode}
                </span>
                <StatusBadge status={data.status} />
              </div>

              {/* Title */}
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl">
                {data.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 md:px-8 mt-8">
        <div className="flex flex-col gap-5 pb-16 lg:flex-row">
          {/* ── Left Column ──────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Image Gallery */}
          {galleryImages.length > 0 && (
            <div className={`flex gap-3 h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-sm`}>
              {/* Large image */}
              <div className={`relative min-w-0 rounded-l-3xl overflow-hidden group ${galleryImages.length === 1 ? "w-full rounded-r-3xl" : "flex-1"}`}>
                <Image
                  src={galleryImages[0]}
                  alt={data.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Small images grid */}
              {galleryImages.length > 1 && (
                <div
                  className={`grid gap-3 w-[220px] md:w-[260px] shrink-0 ${
                    galleryImages.length === 2 ? "grid-cols-1" : "grid-cols-2"
                  }`}>
                  {galleryImages.slice(1, 5).map((img, i) => {
                    const isTopRight = i === 1 || (galleryImages.length === 2 && i === 0);
                    const isBottomRight = i === 3 || (galleryImages.length === 2 && i === 0) || (galleryImages.length === 3 && i === 2);
                    const isLastImage = i === Math.min(galleryImages.length - 2, 3);
                    return (
                      <div
                        key={i}
                        className={`relative overflow-hidden group ${isTopRight ? "rounded-tr-3xl" : ""} ${isBottomRight ? "rounded-br-3xl" : ""}`}>
                        <Image
                          src={img}
                          alt={`Gallery ${i + 2}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="130px"
                        />
                        {isLastImage && galleryImages.length > 5 && (
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center">
                            <Button type="button" className="bg-white text-[#05073c] px-4 py-2 rounded-full shadow-md font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform">
                              <Icon icon="heroicons:photo" className="size-4" />
                              +{galleryImages.length - 5}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Info Pills */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-2">
            <InfoPill
              icon="heroicons:map-pin"
              label={t("tourInstance.location", "Location")}
              value={data.location || "—"}
            />
            <InfoPill
              icon="heroicons:calendar"
              label={t("tourInstance.startDate", "Start Date")}
              value={toDateText(data.startDate, formatterLocale)}
            />
            <InfoPill
              icon="heroicons:calendar-days"
              label={t("tourInstance.endDate", "End Date")}
              value={toDateText(data.endDate, formatterLocale)}
            />
            <InfoPill
              icon="heroicons:users"
              label={t("tourInstance.participants", "Participants")}
              value={`${data.currentParticipation}/${data.maxParticipation}`}
            />
          </section>


          {/* Tabs: Overview / Pricing Details */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-6">
            {/* Segmented Control Tab bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="bg-gray-100 p-1 rounded-2xl inline-flex w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all rounded-xl ${
                    activeTab === "overview"
                      ? "bg-white shadow-sm text-orange-500"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}>
                  <Icon
                    icon="heroicons:information-circle"
                    className="size-4"
                  />
                  {t("tourInstance.overview", "Overview")}
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("pricing")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all rounded-xl ${
                    activeTab === "pricing"
                      ? "bg-white shadow-sm text-orange-500"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}>
                  <Icon icon="heroicons:currency-dollar" className="size-4" />
                  {t("tourInstance.pricingDetails", "Pricing Details")}
                </Button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6">
                  {/* Guide & Included Services */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-xl border border-slate-200 bg-white p-5">
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                         <Icon icon="heroicons:user" className="size-5 text-orange-500" />
                        {t("tourInstance.guide", "Guide")}
                      </h2>
                      {data.guide ? (
                        <div className="mt-4 space-y-2 text-sm text-slate-700">
                          <p className="font-semibold text-slate-900">{data.guide.name}</p>
                          <p>
                            {t("tourInstance.languages", "Languages")}: {" "}
                            {data.guide.languages.join(", ") || "—"}
                          </p>
                          <p>
                            {t("tourInstance.experience", "Experience")}: {" "}
                            {data.guide.experience || "—"}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          {t("tourInstance.userNotAssigned", "Not assigned")}
                        </p>
                      )}
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-5">
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                         <Icon icon="heroicons:check-badge" className="size-5 text-orange-500" />
                        {t("tourInstance.includedServices", "Included Services")}
                      </h2>
                      {data.includedServices.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {data.includedServices.map((service) => (
                            <li
                              key={service}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                              {service}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">—</p>
                      )}
                    </article>
                  </div>

                  {/* Confirmation Deadline */}
                  <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Icon icon="heroicons:calendar" className="size-5 text-orange-500" />
                      {t("tourInstance.confirmationDeadline", "Confirmation Deadline")}
                    </h2>
                    <p className="mt-3 text-sm text-slate-700 font-semibold bg-gray-50 border border-gray-100 p-3 rounded-xl inline-block">
                      {toDateText(data.confirmationDeadline, formatterLocale)}
                    </p>
                  </article>
                </div>
              )}

              {activeTab === "pricing" && (
                <div className="flex flex-col gap-6">
                  {/* Dynamic Pricing Table */}
                   <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Icon icon="heroicons:document-currency-dollar" className="size-5 text-orange-500" />
                      {t("tourInstance.dynamicPricing", "Dynamic Pricing")}
                    </h2>
                    {data.dynamicPricing.length > 0 ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-left text-slate-500">
                              <th className="px-2 py-2">{t("tourInstance.form.minParticipants", "Min participants")}</th>
                              <th className="px-2 py-2">{t("tourInstance.form.maxParticipants", "Max participants")}</th>
                              <th className="px-2 py-2">{t("tourInstance.form.pricePerPerson", "Price per person")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.dynamicPricing.map((tier, index) => (
                              <tr
                                key={`${tier.minParticipants}-${tier.maxParticipants}-${index}`}
                                className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                                <td className="px-2 py-3">{tier.minParticipants}</td>
                                <td className="px-2 py-3">{tier.maxParticipants}</td>
                                <td className="px-2 py-3 font-bold text-orange-600">
                                  {formatCurrency(tier.pricePerPerson, formatterLocale)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">—</p>
                    )}
                  </article>
                </div>
              )}
            </div>
          </div>
        </div> {/* End Left Column */}

        {/* ── Right Sidebar (Pricing & Booking) ────────────────────────────── */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
          <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
            {/* Orange gradient top bar */}
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400" />

            <div className="p-6 flex flex-col gap-5">
              <h3 className="text-sm font-bold text-[#05073c]">
                {t("tourInstance.userPricingBreakdown", "Pricing breakdown")}
              </h3>

              {/* Guest Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#05073c]">
                  {t("landing.tourDetail.guestsLabel", "Guests")}
                </label>
                <div className="border border-gray-200 rounded-[14px] overflow-hidden">
                  <GuestRow
                    label={t("landing.tourDetail.adults", "Adults")}
                    value={adults}
                    onDecrement={() => setAdults(Math.max(1, adults - 1))}
                    onIncrement={() => setAdults(Math.min(20, adults + 1))}
                  />
                  <GuestRow
                    label={t("landing.tourDetail.children", "Children")}
                    subtitle="< 12 years"
                    value={children}
                    onDecrement={() => setChildren(Math.max(0, children - 1))}
                    onIncrement={() => setChildren(Math.min(20, children + 1))}
                  />
                  <GuestRow
                    label={t("landing.tourDetail.infants", "Infants")}
                    subtitle="< 2 years"
                    value={infants}
                    onDecrement={() => setInfants(Math.max(0, infants - 1))}
                    onIncrement={() => setInfants(Math.min(20, infants + 1))}
                    showBorder={false}
                  />
                </div>
              </div>

              {/* Price Details */}
              <div className="flex flex-col gap-3">
                {adults > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">{t("landing.tourDetail.adults", "Adults")} × {adults}</span>
                    <span className="text-base font-bold text-[#05073c]">{formatCurrency(data.basePrice * adults, formatterLocale)}</span>
                  </div>
                )}
                {children > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">{t("landing.tourDetail.children", "Children")} × {children}</span>
                    <span className="text-base font-bold text-[#05073c]">{formatCurrency(data.basePrice * children, formatterLocale)}</span>
                  </div>
                )}
                {infants > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">{t("landing.tourDetail.infants", "Infants")} × {infants}</span>
                    <span className="text-base font-bold text-[#05073c]">{formatCurrency(data.basePrice * infants, formatterLocale)}</span>
                  </div>
                )}
              </div>

              {/* Deposit Required */}
              <div className="bg-orange-50/50 rounded-xl p-4 flex flex-col gap-1 border border-orange-100/50">
                <span className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
                  {t("tourInstance.form.depositPerPerson", "Deposit Required")}
                </span>
                <span className="text-[28px] font-black text-orange-500 leading-tight">
                  {formatCurrency(data.depositPerPerson, formatterLocale)}
                </span>
                <span className="text-[10px] text-gray-500 leading-snug mt-1">
                  {t(
                    "tourInstance.depositRequiredNote",
                    "Deposit is required to secure your booking. The remaining balance is due prior to departure.",
                  )}
                </span>
              </div>

              {/* CTA Button */}
              <div className="relative group/book mt-2">
                 <Button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        // Redirect to login with return URL
                        router.push(`/home?login=true&returnUrl=/tours/instances/${id}`);
                        return;
                      }
                      if (data) {
                        // Determine booking type based on instance type
                        // Public instance = Instant confirmation (InstanceJoin)
                        // Private instance = Admin approval required (InstanceJoin with pending)
                        const isPublicInstance = (data.instanceType || "").toLowerCase() === "public" || data.instanceType === "Public";

                        // Navigate to checkout with tour instance info and guest counts
                        const params = new URLSearchParams({
                          tourInstanceId: id,
                          tourName: data.tourName,
                          startDate: data.startDate || "",
                          endDate: data.endDate || "",
                          location: data.location || "",
                          depositPerPerson: String(data.depositPerPerson),
                          adults: String(adults),
                          children: String(children),
                          infants: String(infants),
                          bookingType: "InstanceJoin",
                          instanceType: isPublicInstance ? "public" : "private",
                        });
                        router.push(`/checkout?${params.toString()}`);
                      }
                    }}
                    className={`relative w-full py-4 rounded-2xl text-[15px] tracking-wide font-extrabold text-white overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ${
                      (data?.instanceType || "").toLowerCase() === "public" || data?.instanceType === "Public"
                        ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_auto] hover:bg-[center_right_1rem] shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_24px_rgba(249,115,22,0.4)] hover:-translate-y-1"
                        : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-[length:200%_auto] hover:bg-[center_right_1rem] shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_24px_rgba(59,130,246,0.4)] hover:-translate-y-1"
                    } active:scale-[0.98]`}>
                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover/book:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    </div>
                    <Icon
                      icon={((data?.instanceType || "").toLowerCase() === "public" || data?.instanceType === "Public") ? "heroicons:check-circle" : "heroicons:clock"}
                      className="size-5 transition-transform group-hover/book:-translate-y-0.5 group-hover/book:translate-x-0.5 group-hover/book:rotate-[-10deg]" />
                    <span className="relative z-10">
                      {((data?.instanceType || "").toLowerCase() === "public" || data?.instanceType === "Public")
                        ? t("landing.tourDetail.bookNow", "Book Now - Instant Confirmation")
                        : t("landing.tourDetail.requestToJoin", "Request to Join - Admin will review")}
                    </span>
                  </Button>
              </div>
            </div>
          </div>
          
          {/* Need Help Card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 rounded-[14px] size-10 flex items-center justify-center shrink-0">
                <Icon
                  icon="heroicons:phone"
                  className="size-5 text-orange-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#05073c]">
                  {t("landing.tourDetail.needHelp", "Need help booking?")}
                </span>
                <span className="text-[10px] text-gray-400">
                  {t("landing.tourDetail.hereForYou", "We're here for you")}
                </span>
              </div>
            </div>
            <Button
              type="button"
              className="w-full border-2 border-gray-100 rounded-xl py-3 text-sm font-extrabold text-[#05073c] hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all duration-300 flex items-center justify-center gap-2 group">
              {t("landing.tourDetail.contactUs", "Contact us")}
              <Icon icon="heroicons:arrow-small-right" className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div> {/* End Right Sidebar */}

      </div> {/* End layout flex container */}
    </div> {/* End max-w-6xl container */}

    {/* ── Floating Social Buttons ────────────────────────── */}
    <div className="fixed right-5 bottom-28 z-50 flex flex-col gap-3">
      <a
        href="#"
        className="bg-[#1877f2] rounded-full size-11 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
        <Icon icon="ri:facebook-fill" className="size-5 text-white" />
      </a>
      <Button
        type="button"
        className="bg-orange-500 rounded-full size-11 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
        <Icon
          icon="heroicons:chat-bubble-oval-left"
          className="size-5 text-white"
        />
      </Button>
    </div>
    <LandingFooter />
  </main>
  );
}
