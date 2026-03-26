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
import { tourInstanceService } from "@/api/services/tourInstanceService";
import { handleApiError } from "@/utils/apiResponse";
import { useAuth } from "@/contexts/AuthContext";
import {
  NormalizedTourInstanceDto,
  TourInstanceStatusMap,
  DynamicPricingDto,
  ActivityTypeMap,
  TransportationTypeMap,
  RoomTypeMap,
  MealTypeMap,
} from "@/types/tour";

/* ── Currency / Date formatters ──────────────────────────────── */
const createCurrencyFormatter = (locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const createDateFormatter = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (value: number, locale: string): string =>
  createCurrencyFormatter(locale).format(value).replace("VND", "VND").trim();

const toDateText = (value: string | null | undefined, locale: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return createDateFormatter(locale).format(date);
};

const daysRemaining = (value: string | null | undefined): number => {
  if (!value) return -1;
  const deadline = new Date(value);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/* ── Capacity Progress Bar ──────────────────────────────────── */
function CapacityBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const { t } = useTranslation();
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  const spotsLeft = max - current;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: "var(--tour-heading)" }}>
          {t("tourInstance.capacity", "Capacity")}
        </span>
        <span className="text-xs tabular-nums" style={{ color: "var(--tour-caption)" }}>
          {current}/{max} {t("tourInstance.occupied", "occupied")}
        </span>
      </div>
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "var(--tour-divider)" }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: pct >= 90
              ? "linear-gradient(90deg, #ef4444, #f97316)"
              : pct >= 70
              ? "linear-gradient(90deg, #f97316, #fa8b02)"
              : "linear-gradient(90deg, #fa8b02, #c9873a)",
          }}
        />
      </div>
      <span
        className="text-[11px] font-semibold"
        style={{ color: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : "#fa8b02" }}>
        {spotsLeft > 0
          ? `${spotsLeft} ${t("tourInstance.spotsLeft", "spots left")}`
          : t("tourInstance.soldOut", "Sold out")}
      </span>
    </div>
  );
}

/* ── Image Lightbox ─────────────────────────────────────────── */
function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + images.length) % images.length);
      if (e.key === "ArrowRight")
        setCurrent((c) => (c + 1) % images.length);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full size-10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
        <Icon icon="heroicons:x-mark" className="size-5" />
      </button>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-xs font-semibold">
        {current + 1} / {images.length}
      </div>
      <div className="relative max-w-5xl max-h-[80vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[current]}
          alt={`Photo ${current + 1}`}
          fill
          className="object-contain rounded-2xl animate-scale-in"
          sizes="90vw"
        />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full size-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
        <Icon icon="heroicons:chevron-left" className="size-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full size-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
        <Icon icon="heroicons:chevron-right" className="size-6" />
      </button>
    </div>
  );
}

/* ── Scroll Reveal Hook ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ── Info Card ──────────────────────────────────────────────── */
function InfoCard({
  icon,
  label,
  value,
  accent = "#fa8b02",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="reveal-on-scroll rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5 hover:bg-white"
      style={{
        boxShadow: "var(--shadow-warm-sm)",
        background: "var(--tour-surface)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}>
      <div className="rounded-full size-11 flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
        <Icon icon={icon} className="size-5" style={{ color: accent }} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-[0.5px] font-semibold mb-0.5" style={{ color: "var(--tour-caption)" }}>
          {label}
        </span>
        <span className="text-sm font-bold break-words" style={{ color: "var(--tour-heading)" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* ── Status Badge ───────────────────────────────────────────── */
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

/* ── Guest Row ──────────────────────────────────────────────── */
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
      className={`flex items-center justify-between px-4 py-3 transition-colors ${showBorder ? "border-b" : ""}`}
      style={{
        borderColor: "var(--tour-divider)",
        background: "var(--tour-surface-raised)",
      }}>
      <div className="flex flex-col">
        <span className="text-xs font-semibold" style={{ color: "var(--tour-heading)" }}>{label}</span>
        {subtitle && (
          <span className="text-[10px] leading-[15px]" style={{ color: "var(--tour-caption)" }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          className="rounded-full w-8 h-8 flex items-center justify-center shrink-0 hover:scale-110 active:scale-90 transition-all duration-200"
          style={{
            background: "var(--tour-surface)",
            border: "1px solid var(--tour-divider)",
            color: "var(--tour-body)",
            boxShadow: "var(--shadow-warm-sm)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#fa8b02";
            (e.currentTarget as HTMLButtonElement).style.color = "#fa8b02";
            (e.currentTarget as HTMLButtonElement).style.background = "#fef3e4";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--tour-divider)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--tour-body)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--tour-surface)";
          }}>
          <HiOutlineMinus className="w-4 h-4" strokeWidth={2} />
        </button>
        <span className="text-sm font-bold w-8 text-center tabular-nums" style={{ color: "var(--tour-heading)" }}>
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="rounded-full w-8 h-8 flex items-center justify-center shrink-0 hover:scale-110 active:scale-90 transition-all duration-200"
          style={{
            background: "var(--tour-surface)",
            border: "1px solid var(--tour-divider)",
            color: "var(--tour-body)",
            boxShadow: "var(--shadow-warm-sm)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#fa8b02";
            (e.currentTarget as HTMLButtonElement).style.color = "#fa8b02";
            (e.currentTarget as HTMLButtonElement).style.background = "#fef3e4";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--tour-divider)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--tour-body)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--tour-surface)";
          }}>
          <HiOutlinePlus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ── Pricing Tier Card ─────────────────────────────────────── */
function PricingTierCard({ tier, base }: { tier: DynamicPricingDto; base: number }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "vi" ? "vi-VN" : "en-GB";
  const isCheaper = tier.pricePerPerson < base;

  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-[var(--shadow-warm-sm)]"
      style={{
        background: isCheaper ? "rgba(250, 139, 2, 0.04)" : "var(--tour-surface-raised)",
        border: `1px solid ${isCheaper ? "rgba(250, 139, 2, 0.2)" : "var(--tour-divider)"}`,
      }}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold" style={{ color: "var(--tour-heading)" }}>
          {tier.minParticipants}–{tier.maxParticipants === 9999 ? "∞" : tier.maxParticipants} {t("tourInstance.people", "people")}
        </span>
        {isCheaper && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block w-fit" style={{ background: "#fef3e4", color: "#fa8b02" }}>
            {t("tourInstance.groupDiscount", "Group discount")}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="text-[15px] font-extrabold tabular-nums"
          style={{ color: isCheaper ? "#fa8b02" : "var(--tour-heading)" }}>
          {formatCurrency(tier.pricePerPerson, locale)}
        </span>
        <span className="text-[10px]" style={{ color: "var(--tour-caption)" }}>
          {t("tourInstance.perPerson", "/person")}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */
export function TourInstancePublicDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params.id as string;

  const resolveApiLanguage = useCallback((): string => {
    return i18n.resolvedLanguage || i18n.language || "en";
  }, [i18n.resolvedLanguage, i18n.language]);

  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "itinerary">("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NormalizedTourInstanceDto | null>(null);
  const [apiLanguage, setApiLanguage] = useState(() => resolveApiLanguage());
  const [pricingTiers, setPricingTiers] = useState<DynamicPricingDto[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Guest selection
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  useScrollReveal();

  useEffect(() => {
    const handleLanguageChanged = (language: string): void => {
      setApiLanguage(language || resolveApiLanguage());
    };
    i18n.on("languageChanged", handleLanguageChanged);
    setApiLanguage(resolveApiLanguage());
    return () => i18n.off("languageChanged", handleLanguageChanged);
  }, [i18n, resolveApiLanguage]);

  const formatterLocale = useMemo(() => {
    return apiLanguage === "vi" ? "vi-VN" : "en-GB";
  }, [apiLanguage]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const detail = await homeService.getPublicInstanceDetail(id, apiLanguage);
        setData(detail);
        setPricingTiers([]);
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
      (data?.images?.map((img) => img.publicURL).filter(Boolean) as string[]) ?? [],
    [data?.images],
  );

  const spotsLeft = useMemo(() => {
    if (!data) return 0;
    return Math.max(0, data.maxParticipation - data.currentParticipation);
  }, [data]);

  const deadlineDays = useMemo(() => {
    if (!data) return -1;
    return daysRemaining(data.confirmationDeadline);
  }, [data]);

  const totalGuests = adults + children + infants;

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--tour-surface-muted)" }}>
        <LandingHeader variant="solid" />
        <div className="max-w-6xl mx-auto px-6 md:px-8 mt-8">
          <div className="py-4 px-6">
            <div className="h-4 w-48 rounded animate-pulse" style={{ background: "var(--tour-divider)" }} />
          </div>
          <div className="flex flex-col lg:flex-row gap-5 px-6 pb-16">
            <div className="flex-1 flex flex-col gap-5">
              <div className="h-[260px] rounded-2xl animate-pulse" style={{ background: "var(--tour-divider)" }} />
              <div className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--tour-divider)" }} />
              <div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--tour-divider)" }} />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <div className="h-[500px] rounded-2xl animate-pulse" style={{ background: "var(--tour-divider)" }} />
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  /* ── Not Found ───────────────────────────────────────────── */
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--tour-surface-muted)" }}>
        <LandingHeader variant="solid" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Icon
              icon="heroicons:exclamation-circle"
              className="size-16 mx-auto mb-4"
              style={{ color: "var(--tour-caption)" }}
            />
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--tour-heading)" }}>
              {t("tourInstance.notFound", "Tour instance not found")}
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--tour-body)" }}>
              The tour instance you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "#fa8b02", color: "white" }}>
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours", "All tours")}
            </Link>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  const isPublicInstance =
    (data.instanceType || "").toLowerCase() === "public" ||
    data.instanceType === "Public";

  return (
    <div className="min-h-screen" style={{ background: "var(--tour-surface-muted)" }}>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <div className="relative h-[60vh] max-h-[600px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{ transform: "scale(1.05)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--tour-dark)]/40 via-[var(--tour-dark)]/20 to-[var(--tour-dark)]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--tour-dark)]/30 via-transparent to-transparent" />

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-20">
          <LandingHeader />
        </div>

        {/* Back button */}
        <div className="absolute inset-x-0 top-[81px] z-10 max-w-6xl mx-auto px-6 md:px-8">
          <Link
            href={`/tours/${data.tourId}`}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300">
            <Icon icon="heroicons:arrow-left" className="size-4" />
            {t("tourInstance.backToTour", "Back to tour")}
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-w-6xl mx-auto px-6 md:px-8 pb-10">
          <div className="flex flex-col items-start gap-4">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] text-white/90 animate-reveal-up">
              <Link href="/home" className="hover:text-white transition-colors">
                {t("landing.tourDetail.home", "Home")}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <Link href="/tours" className="hover:text-white transition-colors">
                {t("landing.tourDetail.packageTours", "Package Tours")}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <Link href={`/tours/${data.tourId}`} className="hover:text-white transition-colors truncate max-w-[150px]">
                {data.tourName}
              </Link>
              <Icon icon="heroicons:chevron-right" className="size-2.5 opacity-50" />
              <span className="font-semibold text-white truncate max-w-[120px]">{data.title}</span>
            </nav>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 animate-reveal-up stagger-1">
              <span className="flex items-center gap-1.5 bg-[#fa8b02] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-lg" style={{ boxShadow: "0 4px 12px rgba(250,139,2,0.3)" }}>
                <Icon icon="heroicons:tag" className="size-3" />
                {data.tourInstanceCode}
              </span>
              <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full">
                {data.classificationName}
              </span>
              <StatusBadge status={data.status} />
              {/* Rating */}
              {data.rating > 0 && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
                  <Icon icon="heroicons:star-solid" className="size-3.5 text-[#fa8b02]" />
                  <span className="text-white text-[11px] font-bold tabular-nums">{data.rating.toFixed(1)}</span>
                  {data.totalBookings > 0 && (
                    <span className="text-white/70 text-[11px]">({data.totalBookings})</span>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold text-white leading-[1.08] max-w-2xl animate-reveal-up stagger-2"
              style={{ textWrap: "balance", letterSpacing: "-0.025em", textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}>
              {data.title}
            </h1>

            {/* Location + Duration quick facts */}
            <div className="flex items-center gap-4 animate-reveal-up stagger-3">
              {data.location && (
                <div className="flex items-center gap-1.5 text-white/85 text-sm font-medium">
                  <Icon icon="heroicons:map-pin" className="size-4" />
                  {data.location}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/85 text-sm font-medium">
                <Icon icon="heroicons:clock" className="size-4" />
                {data.durationDays} {t("tourInstance.days", "days")}
              </div>
              {data.totalBookings > 0 && (
                <div className="flex items-center gap-1.5 text-white/85 text-sm font-medium">
                  <Icon icon="heroicons:user-group" className="size-4" />
                  {data.totalBookings} {t("tourInstance.bookings", "bookings")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--tour-surface-muted)] to-transparent pointer-events-none" />
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-5 pb-16">
          {/* ── Left Column ─────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <div className="reveal-on-scroll">
                <div className="flex gap-3 h-[260px] md:h-[300px] rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-warm-md)" }}>
                  {/* Large image */}
                  <div
                    className={`relative min-w-0 rounded-l-3xl overflow-hidden group cursor-pointer ${galleryImages.length === 1 ? "w-full rounded-r-3xl" : "flex-1"}`}
                    onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                    <Image
                      src={galleryImages[0]}
                      alt={data.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[var(--tour-dark)]/0 group-hover:bg-[var(--tour-dark)]/10 transition-colors duration-500 rounded-l-3xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full size-9 flex items-center justify-center shadow-lg">
                        <Icon icon="heroicons:magnifying-glass" className="size-5" style={{ color: "var(--tour-heading)" }} />
                      </div>
                    </div>
                  </div>
                  {/* Thumbnail grid */}
                  {galleryImages.length > 1 && (
                    <div className={`grid gap-3 w-[200px] md:w-[240px] shrink-0 ${galleryImages.length === 2 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {galleryImages.slice(1, 5).map((img, i) => {
                        const isTopRight = i === 1 || (galleryImages.length === 2 && i === 0);
                        const isBottomRight = i === 3 || (galleryImages.length === 2 && i === 0) || (galleryImages.length === 3 && i === 2);
                        const isLastImage = i === Math.min(galleryImages.length - 2, 3);
                        return (
                          <div
                            key={i}
                            className={`relative overflow-hidden group cursor-pointer ${isTopRight ? "rounded-tr-3xl" : ""} ${isBottomRight ? "rounded-br-3xl" : ""}`}
                            onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }}>
                            <Image
                              src={img}
                              alt={`Gallery ${i + 2}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              sizes="120px"
                            />
                            <div className="absolute inset-0 bg-[var(--tour-dark)]/0 group-hover:bg-[var(--tour-dark)]/10 transition-colors duration-500 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full size-8 flex items-center justify-center shadow-lg">
                                <Icon icon="heroicons:magnifying-glass" className="size-4" style={{ color: "var(--tour-heading)" }} />
                              </div>
                            </div>
                            {isLastImage && galleryImages.length > 5 && (
                              <div className="absolute inset-0 bg-[var(--tour-dark)]/30 group-hover:bg-[var(--tour-dark)]/50 transition-colors duration-300 flex flex-col items-center justify-center">
                                <div className="bg-white rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-md">
                                  <Icon icon="heroicons:photo" className="size-3.5" style={{ color: "var(--tour-heading)" }} />
                                  <span className="text-[11px] font-bold" style={{ color: "var(--tour-heading)" }}>+{galleryImages.length - 5}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
              <ImageLightbox
                images={galleryImages}
                initialIndex={lightboxIndex}
                onClose={() => setLightboxOpen(false)}
              />
            )}

            {/* Info Cards Grid — 6 cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 reveal-on-scroll">
              <InfoCard
                icon="heroicons:map-pin"
                label={t("tourInstance.location", "Location")}
                value={data.location || "—"}
              />
              <InfoCard
                icon="heroicons:calendar"
                label={t("tourInstance.startDate", "Start Date")}
                value={toDateText(data.startDate, formatterLocale)}
              />
              <InfoCard
                icon="heroicons:calendar-days"
                label={t("tourInstance.endDate", "End Date")}
                value={toDateText(data.endDate, formatterLocale)}
              />
              <InfoCard
                icon="heroicons:clock"
                label={t("tourInstance.duration", "Duration")}
                value={`${data.durationDays} ${t("tourInstance.days", "days")}`}
              />
              <InfoCard
                icon="heroicons:user-group"
                label={t("tourInstance.participants", "Participants")}
                value={`${data.currentParticipation}/${data.maxParticipation}`}
              />
              <InfoCard
                icon="heroicons:currency-dollar"
                label={t("tourInstance.basePrice", "Base Price")}
                value={formatCurrency(data.basePrice, formatterLocale)}
                accent="#fa8b02"
              />
            </div>

            {/* Capacity Progress Bar — full width */}
            <div
              className="reveal-on-scroll rounded-2xl p-5"
              style={{ boxShadow: "var(--shadow-warm-md)", background: "var(--tour-surface)", border: "1px solid rgba(255,255,255,0.8)" }}>
              <CapacityBar current={data.currentParticipation} max={data.maxParticipation} />
            </div>

            {/* Confirmation Deadline Card */}
            {data.confirmationDeadline && deadlineDays >= 0 && (
              <div
                className="reveal-on-scroll rounded-2xl p-5 flex items-center gap-4"
                style={{
                  boxShadow: "var(--shadow-warm-sm)",
                  background: deadlineDays <= 3 ? "#FDEBEC" : deadlineDays <= 7 ? "#FBF3DB" : "var(--tour-surface)",
                  border: `1px solid ${deadlineDays <= 3 ? "#F0C4C0" : deadlineDays <= 7 ? "#E8D5A3" : "var(--tour-divider)"}`,
                }}>
                <div
                  className="rounded-full size-11 flex items-center justify-center shrink-0"
                  style={{ background: deadlineDays <= 3 ? "#9F2F2D20" : deadlineDays <= 7 ? "#95640020" : "rgba(250,139,2,0.1)" }}>
                  <Icon
                    icon="heroicons:clock"
                    className="size-5"
                    style={{ color: deadlineDays <= 3 ? "#9F2F2D" : deadlineDays <= 7 ? "#956400" : "#fa8b02" }}
                  />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-xs font-semibold" style={{ color: deadlineDays <= 3 ? "#9F2F2D" : deadlineDays <= 7 ? "#956400" : "var(--tour-caption)" }}>
                    {t("tourInstance.confirmationDeadline", "Confirmation Deadline")}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: deadlineDays <= 3 ? "#9F2F2D" : deadlineDays <= 7 ? "#956400" : "var(--tour-heading)" }}>
                    {toDateText(data.confirmationDeadline, formatterLocale)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="text-[20px] font-extrabold tabular-nums"
                    style={{ color: deadlineDays <= 3 ? "#9F2F2D" : deadlineDays <= 7 ? "#956400" : "#fa8b02" }}>
                    {deadlineDays}
                  </span>
                  <span className="text-[10px]" style={{ color: deadlineDays <= 3 ? "#9F2F2D80" : deadlineDays <= 7 ? "#95640080" : "var(--tour-caption)" }}>
                    {t("tourInstance.daysLeft", "days left")}
                  </span>
                </div>
              </div>
            )}

            {/* Tabs: Overview / Pricing */}
            <div
              className="rounded-2xl overflow-hidden reveal-on-scroll"
              style={{ boxShadow: "var(--shadow-warm-md)", background: "var(--tour-surface)", border: "1px solid rgba(255,255,255,0.8)" }}>
              {/* Tab bar */}
              <div className="p-4">
                <div className="flex gap-1.5 p-1.5 rounded-2xl w-full" style={{ background: "var(--tour-surface-muted)" }}>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-xl duration-300 ${
                      activeTab === "overview"
                        ? "bg-white shadow-[var(--shadow-warm-sm)] text-[#fa8b02] ring-2 ring-[#fa8b02]/20"
                        : "text-[var(--tour-body)] hover:text-[var(--tour-heading)] hover:bg-white/50"
                    }`}>
                    <Icon icon="heroicons:information-circle" className="size-4" />
                    {t("tourInstance.overview", "Overview")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("pricing")}
                    className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-xl duration-300 ${
                      activeTab === "pricing"
                        ? "bg-white shadow-[var(--shadow-warm-sm)] text-[#fa8b02] ring-2 ring-[#fa8b02]/20"
                        : "text-[var(--tour-body)] hover:text-[var(--tour-heading)] hover:bg-white/50"
                    }`}>
                    <Icon icon="heroicons:currency-dollar" className="size-4" />
                    {t("tourInstance.pricingDetails", "Pricing Details")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("itinerary")}
                    className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-xl duration-300 ${
                      activeTab === "itinerary"
                        ? "bg-white shadow-[var(--shadow-warm-sm)] text-[#fa8b02] ring-2 ring-[#fa8b02]/20"
                        : "text-[var(--tour-body)] hover:text-[var(--tour-heading)] hover:bg-white/50"
                    }`}>
                    <Icon icon="heroicons:calendar-days" className="size-4" />
                    {t("tourInstance.itinerary", "Itinerary")}
                  </Button>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6">

                    {/* Guides & Managers */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--tour-heading)" }}>
                        <Icon icon="heroicons:user-group" className="size-4 text-[#fa8b02]" />
                        {t("tourInstance.guidesAndManagers", "Guides & Managers")}
                      </h3>
                      {data.managers && data.managers.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {data.managers.map((mgr) => (
                            <div
                              key={mgr.id}
                              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 transition-all duration-300 hover:shadow-[var(--shadow-warm-sm)]"
                              style={{
                                background: "var(--tour-surface-raised)",
                                border: "1px solid var(--tour-divider)",
                              }}>
                              {mgr.userAvatar ? (
                                <Image
                                  src={mgr.userAvatar}
                                  alt={mgr.userName}
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover size-8"
                                />
                              ) : (
                                <div className="size-8 rounded-full flex items-center justify-center" style={{ background: "#fef3e4" }}>
                                  <span className="text-sm font-bold" style={{ color: "#fa8b02" }}>
                                    {mgr.userName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold" style={{ color: "var(--tour-heading)" }}>
                                  {mgr.userName}
                                </span>
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                                  style={{
                                    background: mgr.role === "Guide" ? "#fef3e4" : "#E1F3FE",
                                    color: mgr.role === "Guide" ? "#c9873a" : "#1F6C9F",
                                  }}>
                                  {mgr.role}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: "var(--tour-body)" }}>
                          {t("tourInstance.noGuidesOrManagers", "No guides or managers assigned yet.")}
                        </p>
                      )}
                    </div>

                    {/* Included Services */}
                    {data.includedServices.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--tour-heading)" }}>
                          <Icon icon="heroicons:check-badge" className="size-4 text-[#fa8b02]" />
                          {t("tourInstance.includedServices", "Included Services")}
                        </h3>
                        <div className="flex flex-col gap-2">
                          {data.includedServices.map((service, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-all duration-200 hover:shadow-[var(--shadow-warm-sm)]"
                              style={{ background: "#EDF3EC", border: "1px solid #C6D9C2" }}>
                              <Icon icon="heroicons:check-circle" className="size-4 shrink-0" style={{ color: "#346538" }} />
                              <span className="text-sm" style={{ color: "#346538" }}>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick stats row */}
                    {(data.rating > 0 || data.totalBookings > 0) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.rating > 0 && (
                          <div className="rounded-xl p-4" style={{ background: "#fef3e4", border: "1px solid #fde8d4" }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon icon="heroicons:star-solid" className="size-4 text-[#fa8b02]" />
                              <span className="text-lg font-extrabold tabular-nums" style={{ color: "#fa8b02" }}>
                                {data.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                              {t("tourInstance.rating", "Rating")}
                            </span>
                          </div>
                        )}
                        {data.totalBookings > 0 && (
                          <div className="rounded-xl p-4" style={{ background: "var(--tour-surface-raised)", border: "1px solid var(--tour-divider)" }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon icon="heroicons:document-text" className="size-4" style={{ color: "var(--tour-caption)" }} />
                              <span className="text-lg font-extrabold tabular-nums" style={{ color: "var(--tour-heading)" }}>
                                {data.totalBookings}
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                              {t("tourInstance.totalBookings", "Bookings")}
                            </span>
                          </div>
                        )}
                        <div className="rounded-xl p-4" style={{ background: "var(--tour-surface-raised)", border: "1px solid var(--tour-divider)" }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon icon="heroicons:user-group" className="size-4" style={{ color: "var(--tour-caption)" }} />
                            <span className="text-lg font-extrabold tabular-nums" style={{ color: "var(--tour-heading)" }}>
                              {spotsLeft}
                            </span>
                          </div>
                          <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                            {t("tourInstance.spotsLeft", "Spots left")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="flex flex-col gap-5">
                    {/* Base Price Hero */}
                    <div className="rounded-xl p-5 text-center" style={{ background: "rgba(250, 139, 2, 0.06)", border: "1px solid rgba(250, 139, 2, 0.15)" }}>
                      <span className="text-[10px] uppercase tracking-wider font-bold block mb-1" style={{ color: "#fa8b02" }}>
                        {t("tourInstance.basePricePerPerson", "Base price per person")}
                      </span>
                      <span className="text-[32px] font-black tabular-nums leading-none" style={{ color: "#fa8b02" }}>
                        {formatCurrency(data.basePrice, formatterLocale)}
                      </span>
                      <p className="text-[10px] mt-2" style={{ color: "var(--tour-caption)" }}>
                        {t("tourInstance.pricingNote", "Price per person. Group discounts may apply.")}
                      </p>
                    </div>

                    {/* Dynamic Pricing Tiers */}
                    {pricingTiers.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--tour-heading)" }}>
                          <Icon icon="heroicons:chart-bar" className="size-4 text-[#fa8b02]" />
                          {t("tourInstance.pricingTiers", "Group pricing")}
                        </h3>
                        <div className="flex flex-col gap-2">
                          {pricingTiers.map((tier, idx) => (
                            <PricingTierCard key={idx} tier={tier} base={data.basePrice} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing breakdown info */}
                    <div className="rounded-xl p-4" style={{ background: "#E1F3FE", border: "1px solid #B8D8F0" }}>
                      <div className="flex items-start gap-2.5">
                        <Icon icon="heroicons:information-circle" className="size-4 mt-0.5 shrink-0" style={{ color: "#1F6C9F" }} />
                        <p className="text-[11px] leading-relaxed" style={{ color: "#1F6C9F" }}>
                          {t("tourInstance.pricingExplainer", "Pricing is calculated based on the number of participants. Larger groups may qualify for discounted rates. Final price will be confirmed at checkout.")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="flex flex-col gap-4">
                    {data.days && data.days.length > 0 ? (
                      data.days.map((day) => {
                        const activities = day.tourDay?.activities ?? [];
                        const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

                        return (
                          <div
                            key={day.id}
                            className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-warm-md)]"
                            style={{
                              boxShadow: "var(--shadow-warm-sm)",
                              background: "var(--tour-surface)",
                              border: "1px solid var(--tour-divider)",
                            }}>
                            {/* Day Header */}
                            <div
                              className="flex items-center gap-3 px-5 py-4"
                              style={{ background: "var(--tour-surface-raised)" }}>
                              <div className="rounded-full size-10 flex items-center justify-center shrink-0" style={{ background: "#fef3e4" }}>
                                <span className="text-base font-bold" style={{ color: "#fa8b02" }}>
                                  {day.instanceDayNumber}
                                </span>
                              </div>
                              <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: "#E1F3FE", color: "#1F6C9F" }}>
                                    {toDateText(day.actualDate, formatterLocale)}
                                  </span>
                                </div>
                                <span className="text-sm font-bold" style={{ color: "var(--tour-heading)" }}>
                                  {day.title || t("tourInstance.dayLabel", `Day ${day.instanceDayNumber}`)}
                                </span>
                                {day.description && (
                                  <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                                    {day.description}
                                  </span>
                                )}
                              </div>
                              {day.startTime && (
                                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--tour-caption)" }}>
                                  <Icon icon="heroicons:clock" className="size-3.5" />
                                  <span>{day.startTime}{day.endTime ? ` – ${day.endTime}` : ""}</span>
                                </div>
                              )}
                            </div>

                            {/* Activities */}
                            {sortedActivities.length > 0 ? (
                              <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
                                {sortedActivities.map((activity) => {
                                  const activityTypeLabel = ActivityTypeMap[activity.activityType] ?? t("landing.tourDetail.activity", "Activity");

                                  return (
                                    <div
                                      key={activity.id}
                                      className="flex gap-3 pl-3 border-l-2 transition-all duration-200 hover:border-[#fa8b02]"
                                      style={{ borderColor: "#fde8d4" }}>
                                      <div className="flex flex-col gap-2 flex-1">
                                        {/* Activity header */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span
                                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                            style={{ background: "#fef3e4", color: "#c9873a" }}>
                                            {activityTypeLabel}
                                          </span>
                                          {activity.isOptional && (
                                            <span
                                              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                              style={{ background: "#E1F3FE", color: "#1F6C9F" }}>
                                              {t("tourInstance.optional", "Optional")}
                                            </span>
                                          )}
                                          {activity.startTime && (
                                            <span className="text-[10px]" style={{ color: "var(--tour-caption)" }}>
                                              {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ""}
                                            </span>
                                          )}
                                        </div>

                                        {/* Activity title */}
                                        <span className="text-sm font-semibold" style={{ color: "var(--tour-heading)" }}>
                                          {activity.title}
                                        </span>

                                        {/* Description */}
                                        {activity.description && (
                                          <p className="text-[11px] leading-relaxed" style={{ color: "var(--tour-body)" }}>
                                            {activity.description}
                                          </p>
                                        )}

                                        {/* Routes */}
                                        {activity.routes && activity.routes.length > 0 && (
                                          <div className="flex flex-col gap-2">
                                            {[...activity.routes].sort((a, b) => a.order - b.order).map((route) => {
                                              const transLabel = TransportationTypeMap[route.transportationType] ?? t("landing.tourDetail.transport", "Transport");
                                              return (
                                                <div
                                                  key={route.id}
                                                  className="rounded-lg px-3 py-2.5 text-[11px]"
                                                  style={{ background: "var(--tour-surface-muted)", color: "var(--tour-body)" }}>
                                                  <div className="flex flex-wrap items-center gap-1.5">
                                                    <Icon icon="heroicons:arrow-right" className="size-3 shrink-0" style={{ color: "var(--tour-caption)" }} />
                                                    <span className="font-semibold">{transLabel}</span>
                                                    {route.fromLocation?.locationName && route.toLocation?.locationName && (
                                                      <span>
                                                        {route.fromLocation.locationName} → {route.toLocation.locationName}
                                                      </span>
                                                    )}
                                                    {route.durationMinutes != null && (
                                                      <span style={{ color: "var(--tour-caption)" }}>
                                                        ({route.durationMinutes} {t("tourInstance.minutes", "min")})
                                                      </span>
                                                    )}
                                                  </div>
                                                  {route.estimatedDepartureTime && route.estimatedArrivalTime && (
                                                    <div className="mt-1" style={{ color: "var(--tour-caption)" }}>
                                                      {t("tourInstance.routeTime", "Time")}: {route.estimatedDepartureTime} → {route.estimatedArrivalTime}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}

                                        {/* Accommodation */}
                                        {activity.accommodation && (
                                          <div
                                            className="rounded-lg border px-3 py-2.5 text-[11px]"
                                            style={{ background: "#E1F3FE", borderColor: "#B8D8F0", color: "var(--tour-body)" }}>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <Icon icon="heroicons:building-office" className="size-3 shrink-0" style={{ color: "var(--tour-caption)" }} />
                                              <span className="font-semibold">{activity.accommodation.accommodationName}</span>
                                              <span>({RoomTypeMap[activity.accommodation.roomType] ?? t("landing.tourDetail.room", "Room")})</span>
                                              {activity.accommodation.mealsIncluded > 0 && (
                                                <span style={{ color: "#fa8b02" }}>
                                                  • {MealTypeMap[activity.accommodation.mealsIncluded] ?? t("landing.tourDetail.meal", "Meal")}
                                                </span>
                                              )}
                                            </div>
                                            {(activity.accommodation.checkInTime || activity.accommodation.checkOutTime) && (
                                              <div className="mt-1" style={{ color: "var(--tour-caption)" }}>
                                                {t("tourInstance.checkInOut", "Check-in/out")}: {activity.accommodation.checkInTime}{activity.accommodation.checkOutTime ? ` – ${activity.accommodation.checkOutTime}` : ""}
                                              </div>
                                            )}
                                            {activity.accommodation.address && (
                                              <div className="mt-1 line-clamp-2" style={{ color: "var(--tour-caption)" }}>
                                                {activity.accommodation.address}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Activity note */}
                                        {activity.note && (
                                          <p className="text-[10px] italic" style={{ color: "var(--tour-caption)" }}>
                                            {activity.note}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="px-5 pb-5 pt-1">
                                <p className="text-xs" style={{ color: "var(--tour-body)" }}>
                                  {t("tourInstance.emptyActivities", "No activities planned for this day.")}
                                </p>
                              </div>
                            )}

                            {/* Day note */}
                            {day.note && (
                              <div className="px-5 pb-4">
                                <p className="text-[10px] italic px-3 py-2 rounded-lg" style={{ background: "var(--tour-surface-muted)", color: "var(--tour-caption)" }}>
                                  {day.note}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 rounded-2xl" style={{ background: "var(--tour-surface-raised)" }}>
                        <Icon icon="heroicons:calendar" className="size-12 mx-auto mb-3" style={{ color: "var(--tour-caption)" }} />
                        <p className="text-sm font-semibold mb-1" style={{ color: "var(--tour-heading)" }}>
                          {t("tourInstance.dailyPlanEmpty", "No itinerary available")}
                        </p>
                        <p className="text-xs" style={{ color: "var(--tour-body)" }}>
                          {t("tourInstance.dailyPlanEmptyDesc", "This tour instance doesn't have a day-by-day schedule yet.")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar (Booking Card) ──────────────────── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5 lg:sticky lg:top-24 self-start">
            <div
              className="rounded-[20px] overflow-hidden animate-reveal-right"
              style={{
                boxShadow: "var(--shadow-warm-lg)",
                background: "var(--tour-surface)",
                border: "1px solid rgba(255,255,255,0.8)",
              }}>
              {/* Gradient accent bar */}
              <div className="h-1.5" style={{ background: "linear-gradient(90deg, #fa8b02, #c9873a, #fa8b02)" }} />

              <div className="p-5 flex flex-col gap-5">
                {/* Instance type badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={isPublicInstance ? "heroicons:globe-alt" : "heroicons:lock-closed"}
                      className="size-4"
                      style={{ color: isPublicInstance ? "#fa8b02" : "#1F6C9F" }}
                    />
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                      background: isPublicInstance ? "#fef3e4" : "#E1F3FE",
                      color: isPublicInstance ? "#c9873a" : "#1F6C9F",
                    }}>
                      {isPublicInstance ? t("tourInstance.public", "Public") : t("tourInstance.private", "Private")}
                    </span>
                  </div>
                  <StatusBadge status={data.status} />
                </div>

                {/* Heading */}
                <div>
                  <h3 className="text-sm font-bold mb-0.5" style={{ color: "var(--tour-heading)" }}>
                    {t("tourInstance.userPricingBreakdown", "Pricing breakdown")}
                  </h3>
                  <span className="text-[11px]" style={{ color: "var(--tour-caption)" }}>
                    {t("tourInstance.selectGuests", "Select number of guests")}
                  </span>
                </div>

                {/* Guest Selector */}
                <div
                  className="rounded-[14px] overflow-hidden"
                  style={{ border: "1px solid var(--tour-divider)", background: "var(--tour-surface-raised)" }}>
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

                {/* Price Breakdown */}
                <div className="flex flex-col gap-2">
                  {adults > 0 && (
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--tour-divider)" }}>
                      <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                        {t("landing.tourDetail.adults")} × {adults}
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--tour-heading)" }}>
                        {formatCurrency(data.basePrice * adults, formatterLocale)}
                      </span>
                    </div>
                  )}
                  {children > 0 && (
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--tour-divider)" }}>
                      <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                        {t("landing.tourDetail.children")} × {children}
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--tour-heading)" }}>
                        {formatCurrency(data.basePrice * children, formatterLocale)}
                      </span>
                    </div>
                  )}
                  {infants > 0 && (
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--tour-divider)" }}>
                      <span className="text-xs" style={{ color: "var(--tour-body)" }}>
                        {t("landing.tourDetail.infants")} × {infants}
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--tour-heading)" }}>
                        {formatCurrency(data.basePrice * infants, formatterLocale)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="rounded-xl p-4" style={{ background: "rgba(250, 139, 2, 0.06)", border: "1px solid rgba(250, 139, 2, 0.15)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "#fa8b02" }}>
                      {t("tourInstance.totalEstimate", "Estimated total")} ({totalGuests} {t("tourInstance.guests", "guests")})
                    </span>
                    <span className="text-[22px] font-black tabular-nums leading-none" style={{ color: "#fa8b02" }}>
                      {formatCurrency(data.basePrice * totalGuests, formatterLocale)}
                    </span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--tour-caption)" }}>
                    {t("tourInstance.priceMayVary", "Price may vary with group discounts")}
                  </span>
                </div>

                {/* CTA Button */}
                <div className="relative group/book mt-2">
                  <Button
                    type="button"
                    disabled={spotsLeft === 0}
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push(`/home?login=true&returnUrl=/tours/instances/${id}`);
                        return;
                      }
                      const params = new URLSearchParams({
                        tourInstanceId: id,
                        tourName: data.tourName,
                        startDate: data.startDate || "",
                        endDate: data.endDate || "",
                        location: data.location || "",
                        basePrice: String(data.basePrice),
                        adults: String(adults),
                        children: String(children),
                        infants: String(infants),
                        bookingType: "InstanceJoin",
                        instanceType: isPublicInstance ? "public" : "private",
                      });
                      router.push(`/checkout?${params.toString()}`);
                    }}
                    className={`relative w-full py-4 rounded-2xl text-[15px] font-extrabold text-white overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ${
                      spotsLeft > 0 ? "hover:-translate-y-0.5 active:scale-[0.98]" : "cursor-not-allowed"
                    }`}
                    style={
                      spotsLeft > 0
                        ? {
                            background: isPublicInstance
                              ? "linear-gradient(135deg, #fa8b02 0%, #c9873a 100%)"
                              : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                            boxShadow: isPublicInstance
                              ? "0 8px 24px rgba(250, 139, 2, 0.3)"
                              : "0 8px 24px rgba(59, 130, 246, 0.3)",
                          }
                        : {
                            background: "var(--tour-surface-muted)",
                            color: "var(--tour-caption)",
                            border: "1px solid var(--tour-divider)",
                          }
                    }>
                    {spotsLeft > 0 && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/book:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                      </div>
                    )}
                    <Icon
                      icon={spotsLeft === 0 ? "heroicons:x-circle" : isPublicInstance ? "heroicons:check-circle" : "heroicons:clock"}
                      className="size-5 transition-all duration-300 relative z-10"
                    />
                    <span className="relative z-10 tracking-wide">
                      {spotsLeft === 0
                        ? t("tourInstance.soldOut", "Sold Out")
                        : isPublicInstance
                        ? t("landing.tourDetail.bookNow", "Book Now — Instant Confirmation")
                        : t("landing.tourDetail.requestToJoin", "Request to Join")}
                    </span>
                  </Button>
                </div>

                {/* No payment notice */}
                <p className="text-[10px] text-center leading-[15px]" style={{ color: "var(--tour-caption)" }}>
                  {t("landing.tourDetail.noPaymentNotice", "No payment required now. You'll be redirected to complete your booking.")}
                </p>
              </div>
            </div>

            {/* Need Help Card */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-[var(--shadow-warm-md)]"
              style={{
                boxShadow: "var(--shadow-warm-sm)",
                background: "var(--tour-surface)",
                border: "1px solid rgba(255,255,255,0.8)",
              }}>
              <div className="flex items-center gap-3">
                <div className="rounded-[14px] size-10 flex items-center justify-center shrink-0" style={{ background: "#fef3e4" }}>
                  <Icon icon="heroicons:phone" className="size-5 text-[#fa8b02]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold" style={{ color: "var(--tour-heading)" }}>
                    {t("landing.tourDetail.needHelp", "Need help booking?")}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--tour-caption)" }}>
                    {t("landing.tourDetail.hereForYou", "We're here for you")}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                className="w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
                style={{
                  border: "2px solid var(--tour-divider)",
                  color: "var(--tour-heading)",
                  background: "var(--tour-surface)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "#fa8b02";
                  el.style.color = "#c9873a";
                  el.style.background = "#fef3e4";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "var(--tour-divider)";
                  el.style.color = "var(--tour-heading)";
                  el.style.background = "var(--tour-surface)";
                }}>
                {t("landing.tourDetail.contactUs", "Contact us")}
                <Icon icon="heroicons:arrow-small-right" className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Social Buttons ─────────────────────────── */}
      <div className="fixed right-5 bottom-28 z-50 flex flex-col gap-3">
        <a
          href="#"
          className="rounded-full size-11 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95"
          style={{ background: "#1877f2", boxShadow: "0 4px 16px rgba(24, 119, 242, 0.3)" }}>
          <Icon icon="ri:facebook-fill" className="size-5 text-white" />
        </a>
        <Button
          type="button"
          className="rounded-full size-11 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95"
          style={{ background: "#fa8b02", boxShadow: "0 4px 16px rgba(250, 139, 2, 0.3)" }}>
          <Icon icon="heroicons:chat-bubble-oval-left" className="size-5 text-white" />
        </Button>
      </div>

      <LandingFooter />
    </div>
  );
}
