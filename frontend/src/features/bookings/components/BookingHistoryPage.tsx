"use client";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

/* ── Types ─────────────────────────────────────────────────── */
type BookingStatus =
  | "confirmed"
  | "completed"
  | "pending"
  | "pending_approval"
  | "approved"
  | "cancelled"
  | "rejected";

type TourTier = "standard" | "luxury" | "premium";

type PaymentStatus = "paid" | "partial" | "unpaid";
type PaymentMethod = "qr_code" | "cash";

interface Booking {
  id: string;
  tourName: string;
  reference: string;
  tier: TourTier;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  location: string;
  duration: string;
  departure: string;
  guests: number;
  totalAmount: number;
  remainingAmount?: number;
  image: string;
}

/* ── Sample Data ───────────────────────────────────────────── */
const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    tourName: "Bali Island Hopping Adventure",
    reference: "PATH-2026-001",
    tier: "standard",
    status: "confirmed",
    paymentStatus: "partial",
    paymentMethod: "qr_code",
    location: "Bali, Indonesia",
    duration: "5 Days",
    departure: "Mar 12",
    guests: 3,
    totalAmount: 2850,
    remainingAmount: 1425,
    image: "/assets/images/tours/bali.jpg",
  },
  {
    id: "2",
    tourName: "Singapore Urban Experience",
    reference: "PATH-2026-002",
    tier: "luxury",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "cash",
    location: "Singapore",
    duration: "4 Days",
    departure: "Feb 8",
    guests: 2,
    totalAmount: 3200,
    image: "/assets/images/tours/singapore.jpg",
  },
  {
    id: "3",
    tourName: "Phuket Beach Paradise",
    reference: "PATH-2026-003",
    tier: "standard",
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "qr_code",
    location: "Phuket, Thailand",
    duration: "5 Days",
    departure: "Apr 15",
    guests: 7,
    totalAmount: 4200,
    image: "/assets/images/tours/phuket.jpg",
  },
  {
    id: "4",
    tourName: "Tokyo Cultural Discovery",
    reference: "PATH-2026-004",
    tier: "premium",
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "qr_code",
    location: "Tokyo, Japan",
    duration: "7 Days",
    departure: "Mar 20",
    guests: 2,
    totalAmount: 5600,
    image: "/assets/images/tours/tokyo.jpg",
  },
  {
    id: "5",
    tourName: "Hanoi Heritage Tour",
    reference: "PATH-2025-045",
    tier: "standard",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "cash",
    location: "Hanoi, Vietnam",
    duration: "4 Days",
    departure: "Jan 5",
    guests: 1,
    totalAmount: 890,
    image: "/assets/images/tours/hanoi.jpg",
  },
  {
    id: "6",
    tourName: "Seoul Modern Culture",
    reference: "PATH-2026-005",
    tier: "premium",
    status: "cancelled",
    paymentStatus: "paid",
    paymentMethod: "qr_code",
    location: "Seoul, South Korea",
    duration: "6 Days",
    departure: "Feb 28",
    guests: 4,
    totalAmount: 4800,
    image: "/assets/images/tours/seoul.jpg",
  },
];

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  BookingStatus,
  { bg: string; text: string; icon: string; iconColor: string }
> = {
  confirmed: {
    bg: "bg-green-500/90",
    text: "text-white",
    icon: "heroicons:check-circle",
    iconColor: "text-white",
  },
  completed: {
    bg: "bg-blue-500/90",
    text: "text-white",
    icon: "heroicons:check-circle",
    iconColor: "text-white",
  },
  pending: {
    bg: "bg-amber-500/90",
    text: "text-white",
    icon: "heroicons:clock",
    iconColor: "text-white",
  },
  pending_approval: {
    bg: "bg-orange-500/90",
    text: "text-white",
    icon: "heroicons:clock",
    iconColor: "text-white",
  },
  approved: {
    bg: "bg-emerald-500/90",
    text: "text-white",
    icon: "heroicons:check-circle",
    iconColor: "text-white",
  },
  cancelled: {
    bg: "bg-red-500/90",
    text: "text-white",
    icon: "heroicons:x-circle",
    iconColor: "text-white",
  },
  rejected: {
    bg: "bg-red-600/90",
    text: "text-white",
    icon: "heroicons:x-circle",
    iconColor: "text-white",
  },
};

const TIER_CONFIG: Record<TourTier, { bg: string; text: string }> = {
  standard: { bg: "bg-gray-100", text: "text-gray-700" },
  luxury: { bg: "bg-amber-50", text: "text-amber-700" },
  premium: { bg: "bg-purple-50", text: "text-purple-700" },
};

type FilterKey = "all" | BookingStatus;

/* ── StatusBadge (overlays tour image) ─────────────────────── */
function StatusOverlay({
  status,
  label,
}: {
  status: BookingStatus;
  label: string;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
      <Icon icon={cfg.icon} className={`size-4 ${cfg.iconColor}`} />
      {label}
    </span>
  );
}

/* ── TierBadge ─────────────────────────────────────────────── */
function TierBadge({ tier, label }: { tier: TourTier; label: string }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {label}
    </span>
  );
}

/* ── InfoItem ──────────────────────────────────────────────── */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon icon={icon} className="size-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ██  BookingHistoryPage
   ══════════════════════════════════════════════════════════════ */
export function BookingHistoryPage() {
  const { t } = useTranslation();

  /* ── State ──────────────────────────────────────────── */
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  /* ── Filter definitions ──────────────────────────────── */
  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("landing.bookings.filterAll") },
    { key: "confirmed", label: t("landing.bookings.statusConfirmed") },
    { key: "pending", label: t("landing.bookings.statusPending") },
    {
      key: "pending_approval",
      label: t("landing.bookings.statusPendingApproval"),
    },
    { key: "approved", label: t("landing.bookings.statusApproved") },
    { key: "completed", label: t("landing.bookings.statusCompleted") },
    { key: "cancelled", label: t("landing.bookings.statusCancelled") },
    { key: "rejected", label: t("landing.bookings.statusRejected") },
  ];

  /* ── Filtered bookings ───────────────────────────────── */
  const filtered = useMemo(() => {
    let list = SAMPLE_BOOKINGS;
    if (activeFilter !== "all") {
      list = list.filter((b) => b.status === activeFilter);
    }
    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.tourName.toLowerCase().includes(q) ||
          b.reference.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeFilter, debouncedSearchQuery]);

  /* ── Stat counts ─────────────────────────────────────── */
  const totalCount = SAMPLE_BOOKINGS.length;
  const activeCount = SAMPLE_BOOKINGS.filter(
    (b) =>
      b.status === "confirmed" ||
      b.status === "pending" ||
      b.status === "pending_approval" ||
      b.status === "approved",
  ).length;

  /* ── Label helpers ───────────────────────────────────── */
  const getStatusLabel = (s: BookingStatus) => {
    const map: Record<BookingStatus, string> = {
      confirmed: t("landing.bookings.statusConfirmed"),
      completed: t("landing.bookings.statusCompleted"),
      pending: t("landing.bookings.statusPending"),
      pending_approval: t("landing.bookings.statusPendingApproval"),
      approved: t("landing.bookings.statusApproved"),
      cancelled: t("landing.bookings.statusCancelled"),
      rejected: t("landing.bookings.statusRejected"),
    };
    return map[s];
  };

  const getTierLabel = (tier: TourTier) => {
    const map: Record<TourTier, string> = {
      standard: t("landing.bookings.tierStandard"),
      luxury: t("landing.bookings.tierLuxury"),
      premium: t("landing.bookings.tierPremium"),
    };
    return map[tier];
  };

  const getPaymentStatusLabel = (s: PaymentStatus) => {
    const map: Record<PaymentStatus, string> = {
      paid: t("landing.bookings.paymentPaid"),
      partial: t("landing.bookings.paymentPartial"),
      unpaid: t("landing.bookings.paymentUnpaid"),
    };
    return map[s];
  };

  const getPaymentMethodLabel = (m: PaymentMethod) => {
    const map: Record<PaymentMethod, string> = {
      qr_code: t("landing.bookings.methodQRCode"),
      cash: t("landing.bookings.methodCash"),
    };
    return map[m];
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <>
      <LandingHeader />

      <main className="bg-gray-50 min-h-screen">
        {/* ── Hero Section ──────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#05073c] to-[#05073c]/90 pt-24 pb-10">
          <div className="max-w-330 mx-auto px-4 md:px-6">
            {/* Back link */}
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mb-6">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.bookings.backToHome")}
            </Link>

            {/* Title row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {t("landing.bookings.title")}
                </h1>
                <p className="text-sm text-white/70 mt-2">
                  {t("landing.bookings.subtitle")}
                </p>
              </div>

              {/* Stat badges */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center min-w-[76px]">
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                  <p className="text-xs text-white/60">
                    {t("landing.bookings.totalBookings")}
                  </p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center min-w-[76px]">
                  <p className="text-2xl font-bold text-orange-400">
                    {activeCount}
                  </p>
                  <p className="text-xs text-white/60">
                    {t("landing.bookings.active")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-330 mx-auto px-4 md:px-6 py-8">
          {/* ── Search & Filter Bar ──────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search input */}
              <div className="relative flex-1 md:max-w-md">
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                />
                <TextInput
                  type="text"
                  placeholder={t("landing.bookings.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="!pl-10 !pr-4 !py-2.5 !rounded-xl !border-gray-200 !text-sm placeholder:!text-gray-400 focus:!ring-orange-500/20 focus:!border-orange-500"
                />
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 mr-1">
                  <Icon
                    icon="heroicons:funnel"
                    className="size-4 text-gray-400"
                  />
                  <span className="text-xs font-semibold text-gray-400">
                    {t("landing.bookings.filter")}:
                  </span>
                </div>
                {filters.map((f) => (
                  <Button
                    key={f.key}
                    type="button"
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activeFilter === f.key
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Booking Cards ────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                <Icon
                  icon="heroicons:ticket"
                  className="size-12 text-gray-200 mx-auto mb-3"
                />
                <p className="text-sm text-gray-400">
                  {t("landing.bookings.noResults")}
                </p>
              </div>
            ) : (
              filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  statusLabel={getStatusLabel(booking.status)}
                  tierLabel={getTierLabel(booking.tier)}
                  paymentStatusLabel={getPaymentStatusLabel(
                    booking.paymentStatus,
                  )}
                  paymentMethodLabel={getPaymentMethodLabel(
                    booking.paymentMethod,
                  )}
                  formatCurrency={formatCurrency}
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <LandingFooter />

      {/* ── Floating Social Buttons ─────────────────────── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="size-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Icon icon="mdi:facebook" className="size-5 text-blue-600" />
        </a>
        <Button
          type="button"
          aria-label="Chat with us"
          className="size-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Icon
            icon="heroicons:chat-bubble-oval-left-ellipsis"
            className="size-5 text-gray-600"
          />
        </Button>
      </div>
    </>
  );
}

/* ── BookingCard ────────────────────────────────────────────── */
function BookingCard({
  booking,
  statusLabel,
  tierLabel,
  paymentStatusLabel,
  paymentMethodLabel,
  formatCurrency,
  t,
}: {
  booking: Booking;
  statusLabel: string;
  tierLabel: string;
  paymentStatusLabel: string;
  paymentMethodLabel: string;
  formatCurrency: (n: number) => string;
  t: (key: string) => string;
}) {
  const showPayRemaining = booking.paymentStatus === "partial";
  const showAddParticipants = booking.status === "pending";
  const showVisaStatus =
    booking.status !== "completed" &&
    booking.status !== "cancelled" &&
    booking.status !== "rejected";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* ── Image ──────────────────────────── */}
        <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
          <Image
            src={booking.image}
            alt={booking.tourName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
          />
          <div className="absolute top-3 left-3">
            <StatusOverlay status={booking.status} label={statusLabel} />
          </div>
        </div>

        {/* ── Content ────────────────────────── */}
        <div className="flex-1 p-5">
          {/* Header: Title + Tier + Payment badge */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">
                  {booking.tourName}
                </h3>
                <TierBadge tier={booking.tier} label={tierLabel} />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Icon
                  icon="heroicons:document-text"
                  className="size-3.5 text-gray-400"
                />
                <span className="text-xs text-gray-500 font-mono">
                  {booking.reference}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-slate-700">
                {paymentStatusLabel}
              </p>
              <p className="text-[11px] text-gray-400">{paymentMethodLabel}</p>
            </div>
          </div>

          {/* Info row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <InfoItem
              icon="heroicons:map-pin"
              label={t("landing.bookings.location")}
              value={booking.location}
            />
            <InfoItem
              icon="heroicons:clock"
              label={t("landing.bookings.duration")}
              value={booking.duration}
            />
            <InfoItem
              icon="heroicons:calendar"
              label={t("landing.bookings.departure")}
              value={booking.departure}
            />
            <InfoItem
              icon="heroicons:users"
              label={t("landing.bookings.guests")}
              value={`${booking.guests} ${booking.guests === 1 ? t("landing.bookings.guest") : t("landing.bookings.guestsLabel")}`}
            />
          </div>

          {/* Action buttons */}
          {(showPayRemaining || showAddParticipants || showVisaStatus) && (
            <div className="flex items-center gap-2 flex-wrap mt-4">
              {showPayRemaining && (
                <Button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#fa8b02] to-[#eb662b] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Icon icon="heroicons:currency-dollar" className="size-4" />
                  {t("landing.bookings.payRemaining")}
                </Button>
              )}
              {showAddParticipants && (
                <Button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
                  <Icon icon="heroicons:users" className="size-4" />
                  {t("landing.bookings.addParticipants")}
                </Button>
              )}
              {showVisaStatus && (
                <Link
                  href="/visa"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
                  <Icon icon="heroicons:paper-airplane" className="size-4" />
                  {t("landing.bookings.visaStatus")}
                </Link>
              )}
            </div>
          )}

          {/* Footer: Total + Actions */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">
                {t("landing.bookings.totalAmount")}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(booking.totalAmount)}
              </p>
              {booking.remainingAmount && (
                <p className="text-xs text-orange-500 font-medium">
                  {t("landing.bookings.remaining")}:{" "}
                  {formatCurrency(booking.remainingAmount)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-slate-700 hover:bg-gray-50 transition-colors">
                <Icon icon="heroicons:arrow-down-tray" className="size-3.5" />
                {t("landing.bookings.invoice")}
              </Button>
              <Link
                href={`/bookings/${booking.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#05073c] text-white text-xs font-semibold hover:bg-[#05073c]/90 transition-colors">
                <Icon icon="heroicons:eye" className="size-3.5" />
                {t("landing.bookings.viewDetails")}
                <Icon icon="heroicons:chevron-right" className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
