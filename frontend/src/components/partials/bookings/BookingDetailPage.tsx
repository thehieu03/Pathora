"use client";
import Button from "@/components/ui/Button";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import { LandingHeader } from "../shared/LandingHeader";
import { LandingFooter } from "../shared/LandingFooter";

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

interface BookingDetail {
  id: string;
  tourName: string;
  reference: string;
  tier: TourTier;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  location: string;
  duration: string;
  bookingDate: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  pricePerPerson: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  image: string;
  description: string;
  highlights: string[];
  importantInfo: string[];
}

/* ── Sample Data ───────────────────────────────────────────── */
const SAMPLE_BOOKINGS: Record<string, BookingDetail> = {
  "1": {
    id: "1",
    tourName: "Bali Island Hopping Adventure",
    reference: "PATH-2026-001",
    tier: "standard",
    status: "confirmed",
    paymentStatus: "partial",
    paymentMethod: "qr_code",
    location: "Bali, Indonesia",
    duration: "5 Days",
    bookingDate: "February 15, 2026",
    departureDate: "March 12, 2026",
    returnDate: "March 16, 2026",
    adults: 2,
    children: 1,
    pricePerPerson: 1425,
    totalAmount: 2850,
    paidAmount: 1425,
    remainingBalance: 1425,
    image: "/assets/images/tours/bali.jpg",
    description:
      "Experience the magic of Bali, Indonesia with our carefully curated standard package. This 5 days journey takes you through the most iconic landmarks and hidden gems, providing an unforgettable adventure with professional guides and comfortable accommodations.",
    highlights: [
      "Visit iconic landmarks and attractions",
      "Experience local culture and traditions",
      "Enjoy authentic local cuisine",
      "Professional English-speaking guide",
      "Comfortable accommodation included",
      "All entrance fees covered",
    ],
    importantInfo: [
      "Please arrive at meeting point 15 minutes before departure",
      "Bring valid ID/passport for verification",
      "Cancellation must be made 48 hours in advance for full refund",
      "Contact us immediately if you need to reschedule",
    ],
  },
};

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  BookingStatus,
  { bg: string; text: string; icon: string }
> = {
  confirmed: {
    bg: "bg-green-500",
    text: "text-white",
    icon: "heroicons:check-circle",
  },
  completed: {
    bg: "bg-blue-500",
    text: "text-white",
    icon: "heroicons:check-circle",
  },
  pending: {
    bg: "bg-amber-500",
    text: "text-white",
    icon: "heroicons:clock",
  },
  pending_approval: {
    bg: "bg-orange-500",
    text: "text-white",
    icon: "heroicons:clock",
  },
  approved: {
    bg: "bg-emerald-500",
    text: "text-white",
    icon: "heroicons:check-circle",
  },
  cancelled: {
    bg: "bg-red-500",
    text: "text-white",
    icon: "heroicons:x-circle",
  },
  rejected: {
    bg: "bg-red-600",
    text: "text-white",
    icon: "heroicons:x-circle",
  },
};

const TIER_CONFIG: Record<TourTier, { bg: string; text: string }> = {
  standard: { bg: "bg-orange-50", text: "text-[#fa8b02]" },
  luxury: { bg: "bg-amber-50", text: "text-amber-700" },
  premium: { bg: "bg-purple-50", text: "text-purple-700" },
};

const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  paid: "text-green-600",
  partial: "text-[#f54900]",
  unpaid: "text-red-600",
};

/* ══════════════════════════════════════════════════════════════
   ██  BookingDetailPage
   ══════════════════════════════════════════════════════════════ */
export function BookingDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const bookingId = params?.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary">(
    "overview",
  );

  // In production, fetch from API using bookingId
  const booking = SAMPLE_BOOKINGS[bookingId] ?? SAMPLE_BOOKINGS["1"];

  const totalGuests = booking.adults + booking.children;
  const statusCfg = STATUS_CONFIG[booking.status];
  const tierCfg = TIER_CONFIG[booking.tier];

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusLabel = (s: BookingStatus) => {
    const map: Record<BookingStatus, string> = {
      confirmed: t("landing.bookingDetail.statusConfirmed"),
      completed: t("landing.bookingDetail.statusCompleted"),
      pending: t("landing.bookingDetail.statusPending"),
      pending_approval: t("landing.bookingDetail.statusPendingApproval"),
      approved: t("landing.bookingDetail.statusApproved"),
      cancelled: t("landing.bookingDetail.statusCancelled"),
      rejected: t("landing.bookingDetail.statusRejected"),
    };
    return map[s];
  };

  const getPaymentStatusLabel = (s: PaymentStatus) => {
    const map: Record<PaymentStatus, string> = {
      paid: t("landing.bookingDetail.paymentPaid"),
      partial: t("landing.bookingDetail.paymentPartiallyPaid"),
      unpaid: t("landing.bookingDetail.paymentUnpaid"),
    };
    return map[s];
  };

  const getPaymentMethodLabel = (m: PaymentMethod) => {
    const map: Record<PaymentMethod, string> = {
      qr_code: t("landing.bookingDetail.methodQRCode"),
      cash: t("landing.bookingDetail.methodCash"),
    };
    return map[m];
  };

  const getTierLabel = (tier: TourTier) => {
    const map: Record<TourTier, string> = {
      standard: t("landing.bookingDetail.tierStandard"),
      luxury: t("landing.bookingDetail.tierLuxury"),
      premium: t("landing.bookingDetail.tierPremium"),
    };
    return map[tier];
  };

  const showPayRemaining = booking.paymentStatus === "partial";
  const showVisaStatus =
    booking.status !== "completed" &&
    booking.status !== "cancelled" &&
    booking.status !== "rejected";
  const showCancelBooking =
    booking.status !== "completed" &&
    booking.status !== "cancelled" &&
    booking.status !== "rejected";

  return (
    <>
      <LandingHeader />

      <main className="bg-gray-50 min-h-screen">
        {/* ── Hero Section ──────────────────────────────── */}
        <section className="relative h-[400px] sm:h-[448px]">
          <Image
            src={booking.image}
            alt={booking.tourName}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-between">
            {/* Back link */}
            <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 pt-20 sm:pt-24">
              <Link
                href="/bookings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                <Icon icon="heroicons:arrow-left" className="size-4" />
                {t("landing.bookingDetail.backToBookings")}
              </Link>
            </div>

            {/* Tour info */}
            <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 pb-8 sm:pb-10">
              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-4 ${statusCfg.bg} ${statusCfg.text}`}>
                <Icon icon={statusCfg.icon} className="size-4" />
                {getStatusLabel(booking.status)}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                {booking.tourName}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Icon icon="heroicons:map-pin" className="size-4" />
                  {booking.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon icon="heroicons:clock" className="size-4" />
                  {booking.duration}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ───────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left Column ──────────────────────────── */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Booking Information Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    icon="heroicons:document-text"
                    className="size-5 text-[#05073c]"
                  />
                  <h2 className="text-xl font-bold text-[#05073c]">
                    {t("landing.bookingDetail.bookingInformation")}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoField
                    label={t("landing.bookingDetail.bookingReference")}
                    value={booking.reference}
                    mono
                  />
                  <InfoField
                    label={t("landing.bookingDetail.bookingDate")}
                    value={booking.bookingDate}
                  />
                  <InfoField
                    label={t("landing.bookingDetail.departureDate")}
                    value={booking.departureDate}
                  />
                  <InfoField
                    label={t("landing.bookingDetail.returnDate")}
                    value={booking.returnDate}
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("landing.bookingDetail.classification")}
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${tierCfg.bg} ${tierCfg.text}`}>
                      {getTierLabel(booking.tier)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("landing.bookingDetail.paymentMethod")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="heroicons:credit-card"
                        className="size-4 text-gray-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {getPaymentMethodLabel(booking.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    icon="heroicons:users"
                    className="size-5 text-[#05073c]"
                  />
                  <h2 className="text-xl font-bold text-[#05073c]">
                    {t("landing.bookingDetail.guestDetails")}
                  </h2>
                </div>
                <div className="flex flex-col gap-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {t("landing.bookingDetail.adults")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("landing.bookingDetail.adultsAge")}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#05073c]">
                      {booking.adults}
                    </p>
                  </div>
                  {/* Children */}
                  <div className="flex items-center justify-between pb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {t("landing.bookingDetail.children")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("landing.bookingDetail.childrenAge")}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#05073c]">
                      {booking.children}
                    </p>
                  </div>
                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                    <p className="text-base font-bold text-gray-700">
                      {t("landing.bookingDetail.totalGuests")}
                    </p>
                    <p className="text-xl font-bold text-[#fa8b02]">
                      {totalGuests}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview / Itinerary Tabs Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab header */}
                <div className="flex border-b border-gray-100">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === "overview"
                        ? "text-[#fa8b02] border-b-2 border-[#fa8b02] bg-orange-50/50"
                        : "text-gray-400 border-b-2 border-transparent hover:text-gray-600"
                    }`}>
                    <Icon
                      icon="heroicons:information-circle"
                      className="size-4"
                    />
                    {t("landing.bookingDetail.overview")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("itinerary")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === "itinerary"
                        ? "text-[#fa8b02] border-b-2 border-[#fa8b02] bg-orange-50/50"
                        : "text-gray-400 border-b-2 border-transparent hover:text-gray-600"
                    }`}>
                    <Icon icon="heroicons:document-text" className="size-4" />
                    {t("landing.bookingDetail.itinerary")}
                  </Button>
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {activeTab === "overview" ? (
                    <div className="flex flex-col gap-6">
                      {/* Quick info strip */}
                      <div className="bg-gray-50 rounded-2xl p-5">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <QuickInfoItem
                            icon="heroicons:clock"
                            label={t("landing.bookingDetail.duration")}
                            value={booking.duration}
                          />
                          <QuickInfoItem
                            icon="heroicons:tag"
                            label={t("landing.bookingDetail.package")}
                            value={getTierLabel(booking.tier)}
                          />
                          <QuickInfoItem
                            icon="heroicons:map-pin"
                            label={t("landing.bookingDetail.locationLabel")}
                            value={booking.location}
                          />
                          <QuickInfoItem
                            icon="heroicons:users"
                            label={t("landing.bookingDetail.guestsLabel")}
                            value={`${totalGuests} pax`}
                          />
                        </div>
                      </div>

                      {/* About This Tour */}
                      <div>
                        <h3 className="text-base font-bold text-[#05073c] mb-3">
                          {t("landing.bookingDetail.aboutThisTour")}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {booking.description}
                        </p>
                      </div>

                      {/* Tour Highlights */}
                      <div>
                        <h3 className="text-base font-bold text-[#05073c] mb-3">
                          {t("landing.bookingDetail.tourHighlights")}
                        </h3>
                        <div className="flex flex-col gap-2">
                          {booking.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex items-start gap-2">
                              <Icon
                                icon="heroicons:check-circle"
                                className="size-4 text-green-500 mt-0.5 shrink-0"
                              />
                              <span className="text-sm text-gray-600">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon
                        icon="heroicons:document-text"
                        className="size-12 text-gray-200 mx-auto mb-3"
                      />
                      <p className="text-sm text-gray-400">
                        {t("landing.bookingDetail.itineraryComingSoon")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="heroicons:information-circle"
                    className="size-5 text-blue-700 mt-0.5 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 mb-2">
                      {t("landing.bookingDetail.importantInformation")}
                    </h3>
                    <ul className="flex flex-col gap-1">
                      {booking.importantInfo.map((info) => (
                        <li
                          key={info}
                          className="text-xs text-blue-700 leading-relaxed">
                          • {info}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Sidebar ─────────────────────────── */}
            <div className="w-full lg:w-[390px] shrink-0 flex flex-col gap-6">
              {/* Payment Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <h3 className="text-lg font-bold text-[#05073c] mb-4">
                  {t("landing.bookingDetail.paymentSummary")}
                </h3>

                <div className="flex flex-col gap-3">
                  {/* Price per person */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t("landing.bookingDetail.pricePerPerson")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.pricePerPerson)}
                    </span>
                  </div>

                  {/* Number of guests */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t("landing.bookingDetail.numberOfGuests")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      &times;{totalGuests}
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-700">
                      {t("landing.bookingDetail.totalAmount")}
                    </span>
                    <span className="text-2xl font-bold text-[#fa8b02]">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>

                  {/* Paid (Deposit) */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t("landing.bookingDetail.paidDeposit")}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      -{formatCurrency(booking.paidAmount)}
                    </span>
                  </div>

                  {/* Remaining Balance */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-700">
                      {t("landing.bookingDetail.remainingBalance")}
                    </span>
                    <span className="text-xl font-bold text-[#f54900]">
                      {formatCurrency(booking.remainingBalance)}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-orange-50 rounded-xl px-4 py-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">
                      {t("landing.bookingDetail.paymentStatus")}
                    </span>
                    <span
                      className={`text-sm font-bold ${PAYMENT_STATUS_COLOR[booking.paymentStatus]}`}>
                      {getPaymentStatusLabel(booking.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  {showPayRemaining && (
                    <Button
                      type="button"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#00c950] text-white text-sm font-bold shadow-sm hover:bg-[#00b347] transition-colors">
                      <Icon
                        icon="heroicons:currency-dollar"
                        className="size-4"
                      />
                      {t("landing.bookingDetail.payRemainingBalance")}
                    </Button>
                  )}

                  {showVisaStatus && (
                    <Button
                      type="button"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors">
                      <Icon
                        icon="heroicons:paper-airplane"
                        className="size-4"
                      />
                      {t("landing.bookingDetail.visaStatus")}
                    </Button>
                  )}

                  {showCancelBooking && (
                    <Button
                      type="button"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors">
                      <Icon icon="heroicons:x-circle" className="size-4" />
                      {t("landing.bookingDetail.cancelBooking")}
                    </Button>
                  )}
                </div>
              </div>

              {/* Need Help? Card */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background:
                    "linear-gradient(147deg, #05073c 0%, rgba(5, 7, 60, 0.8) 100%)",
                }}>
                <h3 className="text-lg font-bold text-white mb-1">
                  {t("landing.bookingDetail.needHelp")}
                </h3>
                <p className="text-sm text-white/80 mb-5">
                  {t("landing.bookingDetail.needHelpDesc")}
                </p>

                <div className="flex flex-col gap-2">
                  {/* Phone */}
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-3 hover:bg-white/15 transition-colors">
                    <Icon
                      icon="heroicons:phone"
                      className="size-4 text-white/70"
                    />
                    <div>
                      <p className="text-xs text-white/60">
                        {t("landing.bookingDetail.phone")}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        +1 (234) 567-890
                      </p>
                    </div>
                  </a>
                  {/* Email */}
                  <a
                    href="mailto:support@pathora.com"
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-3 hover:bg-white/15 transition-colors">
                    <Icon
                      icon="heroicons:envelope"
                      className="size-4 text-white/70"
                    />
                    <div>
                      <p className="text-xs text-white/60">
                        {t("landing.bookingDetail.email")}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        support@pathora.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
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
          className="size-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Icon icon="mdi:facebook" className="size-5 text-blue-600" />
        </a>
        <Button
          type="button"
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

/* ── Sub-components ────────────────────────────────────────── */

function InfoField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-sm font-semibold text-gray-700 ${mono ? "font-mono text-[#05073c]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function QuickInfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
        <Icon icon={icon} className="size-4 text-[#fa8b02]" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-[#05073c]">{value}</p>
      </div>
    </div>
  );
}
