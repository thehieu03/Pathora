"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "./LandingImage";
import { Icon } from "@/components/ui";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";
import { useTranslation } from "react-i18next";

/* ── Image Assets ──────────────────────────────────────────── */
const HERO_BG =
  "https://www.figma.com/api/mcp/asset/6b3bd8ae-6ffb-498d-a62b-9de9ca38cdd4";

const GALLERY_IMAGES = [
  "https://www.figma.com/api/mcp/asset/2f522778-a155-437a-b5a2-6142ef1c1bb2",
  "https://www.figma.com/api/mcp/asset/376def41-3ada-46d6-bc15-15a90d47e877",
  "https://www.figma.com/api/mcp/asset/0b0f78f8-a3d5-455a-8517-d3e9a30ba3ee",
  "https://www.figma.com/api/mcp/asset/b8a1b3ef-885e-4918-a4bd-28cc72158758",
  "https://www.figma.com/api/mcp/asset/f69eee8d-bc64-4c1c-9077-7a16614f5cda",
];

/* ── Sample Tour Data ──────────────────────────────────────── */
interface TourPackage {
  name: string;
  duration: string;
  price: number;
  originalPrice: number;
}

interface DynamicPriceTier {
  range: string;
  pricePerPerson: number;
}

interface RelatedTour {
  id: number;
  image: string;
  location: string;
  title: string;
  duration: string;
  price: number;
  category: string;
}

interface TourDetailData {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  location: string;
  duration: string;
  groupSize: number;
  availability: string;
  heroImage: string;
  galleryImages: string[];
  aboutParagraphs: string[];
  packages: TourPackage[];
  dynamicPricing: DynamicPriceTier[];
  relatedTours: RelatedTour[];
}

const SAMPLE_TOUR: TourDetailData = {
  id: "1",
  code: "PTH-012",
  title: "Statue of Liberty & Ellis Island Ferry Access Tour",
  category: "Cultural Tour",
  description:
    "1-day cultural tour in New York, USA. Led by expert local guides with all transfers, accommodation, and key activities included.",
  location: "New York, USA",
  duration: "1 Days",
  groupSize: 2,
  availability: "Year Round",
  heroImage: HERO_BG,
  galleryImages: GALLERY_IMAGES,
  aboutParagraphs: [
    "Experience the very best of New York on this full-day cultural tour crafted exclusively by Pathora. Every detail has been thoughtfully arranged so you can focus on what matters — the experience itself.",
    "Led by hand-picked local experts with deep knowledge of the region, each day blends iconic highlights with off-the-beaten-path discoveries that most visitors miss. With a maximum group size of just 12, the whole experience feels private and personal from start to finish.",
    "Whether you're a first-time visitor or a seasoned traveller, this tour is designed to deliver New York the way it was meant to be seen — authentic, immersive, and unforgettable.",
  ],
  packages: [
    { name: "Standard", duration: "1 days", price: 35, originalPrice: 41 },
    { name: "Luxury", duration: "1 days", price: 56, originalPrice: 68 },
  ],
  dynamicPricing: [
    { range: "8-10 people", pricePerPerson: 26 },
    { range: "5-7 people", pricePerPerson: 30 },
    { range: "4 people", pricePerPerson: 33 },
    { range: "2-3 people", pricePerPerson: 35 },
  ],
  relatedTours: [
    {
      id: 12,
      image:
        "https://www.figma.com/api/mcp/asset/f5d4fd9b-5ccc-427a-940a-d0f92012d69a",
      location: "London",
      title: "Westminster Walking Tour & Westminster Abbey Entry",
      duration: "6 days",
      price: 943,
      category: "Cultural Tour",
    },
    {
      id: 7,
      image:
        "https://www.figma.com/api/mcp/asset/e0caae3f-56bd-4093-b2ed-66986ad053ae",
      location: "Paris",
      title: "Louvre Museum Skip-the-Line Guided Tour",
      duration: "1 days",
      price: 85,
      category: "Cultural Tour",
    },
    {
      id: 4,
      image:
        "https://www.figma.com/api/mcp/asset/b8a1b3ef-885e-4918-a4bd-28cc72158758",
      location: "Rome",
      title: "Colosseum, Roman Forum & Palatine Hill Guided Tour",
      duration: "2 days",
      price: 65,
      category: "Cultural Tour",
    },
  ],
};

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

/* ── Info Pill ─────────────────────────────────────────────── */
function InfoPill({
  icon,
  label,
  value,
  hasBorder = true,
}: {
  icon: string;
  label: string;
  value: string;
  hasBorder?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 md:px-4 py-3 md:py-4 flex-1 min-w-0 ${hasBorder ? "md:border-r md:border-gray-100" : ""}`}>
      <div className="bg-orange-50 rounded-[14px] size-8 md:size-9 flex items-center justify-center shrink-0">
        <Icon icon={icon} className="text-orange-500 size-4" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-[0.5px] text-gray-400 leading-[15px]">
          {label}
        </span>
        <span className="text-xs font-semibold text-[#05073c] leading-4">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ── Guest Counter Row ─────────────────────────────────────── */
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
          className="bg-gray-100 rounded-[10px] size-7 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon icon="heroicons:minus" className="size-3.5 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-[#05073c] w-5 text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="bg-gray-100 rounded-[10px] size-7 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon icon="heroicons:plus" className="size-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

/* ── Related Tour Card ─────────────────────────────────────── */
function RelatedTourCard({ tour }: { tour: RelatedTour }) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-36 overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {tour.category}
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <Icon icon="heroicons:map-pin" className="size-3 text-gray-400" />
          <span className="text-[10px] text-gray-400">{tour.location}</span>
        </div>
        <p className="text-xs font-semibold text-[#05073c] leading-4 line-clamp-2">
          {tour.title}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-[10px] text-gray-400">{tour.duration}</span>
          <span className="text-sm font-bold text-[#05073c]">
            ${tour.price}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */
export function TourDetailPage() {
  const { t } = useTranslation();
  const tour = SAMPLE_TOUR;

  /* ── State ───────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary">(
    "overview",
  );
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [departureDate, setDepartureDate] = useState("");

  const selectedPkg = tour.packages[selectedPackage];
  const totalGuests = adults + children;

  /* ── Dynamic price calculation ───────────────────────────── */
  const pricePerPerson = useMemo(() => {
    const tier = tour.dynamicPricing.find((t) => {
      const parts = t.range.split(" ")[0];
      if (parts.includes("-")) {
        const [min, max] = parts.split("-").map(Number);
        return totalGuests >= min && totalGuests <= max;
      }
      return totalGuests === Number(parts);
    });
    return tier ? tier.pricePerPerson : selectedPkg.price;
  }, [totalGuests, selectedPkg.price, tour.dynamicPricing]);

  const adultTotal = adults * pricePerPerson;
  const serviceFee = 0;
  const estimatedTotal = adultTotal + serviceFee;

  const canBook = adults > 0 && departureDate !== "";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ───────────────────────────────────── */}
      <div className="relative h-[460px] overflow-hidden">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,7,60,0.6)] via-transparent to-[rgba(5,7,60,0.85)]" />

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-20">
          <LandingHeader />
        </div>

        {/* Back + Heart/Share buttons */}
        <div className="absolute inset-x-0 top-[81px] z-10 max-w-330 mx-auto px-4 md:px-3.75">
          <div className="flex items-center justify-between px-6">
            <Link
              href="/tours"
              className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/25 transition-colors">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours")}
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="bg-white/15 border border-white/20 rounded-full size-10 flex items-center justify-center hover:bg-white/25 transition-colors">
                <Icon icon="heroicons:heart" className="size-5 text-white" />
              </button>
              <button
                type="button"
                className="bg-white/15 border border-white/20 rounded-full size-10 flex items-center justify-center hover:bg-white/25 transition-colors">
                <Icon icon="heroicons:share" className="size-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-w-330 mx-auto px-4 md:px-3.75 pb-6">
          <div className="px-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Icon icon="heroicons:tag" className="size-3" />
                {tour.code}
              </span>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {tour.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-[1.25] max-w-xl mb-2">
              {tour.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-white/70 max-w-lg leading-relaxed mb-3">
              {tour.description}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5">
              <Icon icon="heroicons:map-pin" className="size-4 text-white/80" />
              <span className="text-sm text-white/80">{tour.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="max-w-330 mx-auto px-4 md:px-3.75">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 py-4 px-6 overflow-x-auto">
          <Link
            href="/"
            className="hover:text-gray-600 transition-colors shrink-0">
            {t("landing.tourDetail.home")}
          </Link>
          <Icon icon="heroicons:chevron-right" className="size-3 shrink-0" />
          <Link
            href="/tours"
            className="hover:text-gray-600 transition-colors shrink-0">
            {t("landing.tourDetail.packageTours")}
          </Link>
          <Icon icon="heroicons:chevron-right" className="size-3 shrink-0" />
          <span className="text-gray-600 font-medium truncate">
            {tour.title}
          </span>
        </nav>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-5 px-6 pb-16">
          {/* ── Left Column ──────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Image Gallery */}
            <div className="flex gap-2 h-[256px] md:h-[260px] rounded-2xl overflow-hidden">
              {/* Large image */}
              <div className="relative flex-1 min-w-0 rounded-2xl overflow-hidden">
                <Image
                  src={tour.galleryImages[0]}
                  alt={tour.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* 2×2 small images */}
              <div className="grid grid-cols-2 gap-2 w-[190px] md:w-[220px] shrink-0">
                {tour.galleryImages.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden">
                    <Image
                      src={img}
                      alt={`Gallery ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Pills */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm grid grid-cols-2 md:flex md:flex-wrap">
              <InfoPill
                icon="heroicons:clock"
                label={t("landing.tourDetail.duration")}
                value={tour.duration}
              />
              <InfoPill
                icon="heroicons:map-pin"
                label={t("landing.tourDetail.locationLabel")}
                value={tour.location.split(",")[0]}
              />
              <InfoPill
                icon="heroicons:users"
                label={t("landing.tourDetail.groupSize")}
                value={`${tour.groupSize} ${t("landing.tourDetail.guests")}`}
              />
              <InfoPill
                icon="heroicons:calendar"
                label={t("landing.tourDetail.availability")}
                value={tour.availability}
                hasBorder={false}
              />
            </div>

            {/* Tabs: Overview / Itinerary */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors border-b-[1.6px] ${
                    activeTab === "overview"
                      ? "bg-orange-50/50 border-orange-500 text-orange-500"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}>
                  <Icon
                    icon="heroicons:information-circle"
                    className="size-4"
                  />
                  {t("landing.tourDetail.overview")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("itinerary")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors border-b-[1.6px] ${
                    activeTab === "itinerary"
                      ? "bg-orange-50/50 border-orange-500 text-orange-500"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}>
                  <Icon icon="heroicons:document-text" className="size-4" />
                  {t("landing.tourDetail.itinerary")}
                </button>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-[#05073c]">
                      {t("landing.tourDetail.aboutThisTour")}
                    </h3>
                    {tour.aboutParagraphs.map((p, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-500 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {activeTab === "itinerary" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-[#05073c]">
                      {t("landing.tourDetail.itinerary")}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {t("landing.tourDetail.itineraryComingSoon")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* You Might Also Like */}
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-[#05073c]">
                {t("landing.tourDetail.youMightAlsoLike")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tour.relatedTours.map((rt) => (
                  <RelatedTourCard key={rt.id} tour={rt} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ────────────────────────────── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 lg:sticky lg:top-4 self-start">
            {/* Booking Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
              {/* Orange gradient top bar */}
              <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

              <div className="p-5 flex flex-col gap-5">
                {/* Select Package */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#05073c]">
                    {t("landing.tourDetail.selectPackage")}
                  </span>
                  <div className="flex flex-col gap-2">
                    {tour.packages.map((pkg, i) => (
                      <button
                        key={pkg.name}
                        type="button"
                        onClick={() => setSelectedPackage(i)}
                        className={`flex items-center justify-between px-3 py-3 rounded-[14px] border transition-colors ${
                          selectedPackage === i
                            ? "bg-orange-50 border-orange-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <div className="flex flex-col items-start">
                          <span
                            className={`text-xs font-bold ${selectedPackage === i ? "text-orange-500" : "text-[#05073c]"}`}>
                            {pkg.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {pkg.duration}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-sm font-bold ${selectedPackage === i ? "text-orange-500" : "text-[#05073c]"}`}>
                            ${pkg.price}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through font-medium">
                            ${pkg.originalPrice}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400">
                    {t("landing.tourDetail.estimatedPrice")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[30px] font-bold text-orange-500 leading-9">
                      from ${selectedPkg.price}
                    </span>
                    <span className="text-sm text-gray-400">/person</span>
                    <span className="text-sm text-gray-400 line-through">
                      ${selectedPkg.originalPrice}
                    </span>
                  </div>
                  {/* Blue info notice */}
                  <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-3">
                    <p className="text-[10px] text-gray-500 leading-[15px]">
                      <span>
                        ℹ️ {t("landing.tourDetail.packageNoticeStart")}{" "}
                      </span>
                      <span className="font-bold">
                        {t("landing.tourDetail.packageTour")}
                      </span>
                      <span>. {t("landing.tourDetail.packageNoticeEnd")}</span>
                    </p>
                  </div>
                </div>

                {/* Preferred Departure Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#05073c]">
                    {t("landing.tourDetail.preferredDepartureDate")}
                  </label>
                  <div className="relative">
                    <Icon
                      icon="heroicons:calendar"
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                    />
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-[14px] pl-9 pr-3 py-2.5 text-sm text-[#05073c] focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {t("landing.tourDetail.flexibleDates")}
                  </p>
                </div>

                {/* Guests */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#05073c]">
                    {t("landing.tourDetail.guestsLabel")}
                  </label>
                  <div className="border border-gray-200 rounded-[14px] overflow-hidden">
                    <GuestRow
                      label={t("landing.tourDetail.adults")}
                      value={adults}
                      onDecrement={() => setAdults(Math.max(1, adults - 1))}
                      onIncrement={() => setAdults(adults + 1)}
                    />
                    <GuestRow
                      label={t("landing.tourDetail.children")}
                      subtitle="< 12 years"
                      value={children}
                      onDecrement={() => setChildren(Math.max(0, children - 1))}
                      onIncrement={() => setChildren(children + 1)}
                    />
                    <GuestRow
                      label={t("landing.tourDetail.infants")}
                      subtitle="< 2 years"
                      value={infants}
                      onDecrement={() => setInfants(Math.max(0, infants - 1))}
                      onIncrement={() => setInfants(infants + 1)}
                      showBorder={false}
                    />
                  </div>
                </div>

                {/* Dynamic Pricing */}
                <div
                  className="border border-blue-100 rounded-[14px] p-4 flex flex-col gap-3"
                  style={{
                    backgroundImage:
                      "linear-gradient(152deg, rgb(239, 246, 255) 0%, rgb(250, 245, 255) 100%)",
                  }}>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="heroicons:tag"
                      className="size-3.5 text-[#05073c]"
                    />
                    <span className="text-xs font-bold text-[#05073c]">
                      {t("landing.tourDetail.dynamicPricing")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {tour.dynamicPricing.map((tier) => (
                      <div
                        key={tier.range}
                        className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {tier.range}
                        </span>
                        <span className="text-xs text-[#05073c]">
                          ${tier.pricePerPerson}/person
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-[14px] p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {t("landing.tourDetail.adults")} × {adults}
                    </span>
                    <span className="text-xs text-gray-500">${adultTotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {t("landing.tourDetail.serviceFee")}
                    </span>
                    <span className="text-xs text-gray-500">${serviceFee}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-bold text-[#05073c]">
                      {t("landing.tourDetail.estimatedTotal")}
                    </span>
                    <span className="text-sm font-bold text-orange-500">
                      ${estimatedTotal}
                    </span>
                  </div>
                </div>

                {/* Request Booking Button */}
                <button
                  type="button"
                  disabled={!canBook}
                  className={`w-full py-3 rounded-[14px] text-sm font-bold text-white transition-all ${
                    canBook
                      ? "bg-orange-500 shadow-[0px_4px_6px_0px_#ffd6a8,0px_2px_4px_0px_#ffd6a8] hover:bg-orange-600"
                      : "bg-orange-500/50 shadow-[0px_4px_6px_0px_#ffd6a8,0px_2px_4px_0px_#ffd6a8] cursor-not-allowed"
                  }`}>
                  {t("landing.tourDetail.requestBooking")}
                </button>

                {/* No payment notice */}
                <p className="text-[10px] text-gray-400 text-center leading-[15px]">
                  💡 {t("landing.tourDetail.noPaymentNotice")}
                </p>
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
                    {t("landing.tourDetail.needHelp")}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {t("landing.tourDetail.hereForYou")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="w-full border border-gray-200 rounded-[14px] py-2.5 text-sm font-semibold text-[#05073c] hover:bg-gray-50 transition-colors">
                {t("landing.tourDetail.contactUs")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Social Buttons ────────────────────────── */}
      <div className="fixed right-5 bottom-28 z-50 flex flex-col gap-3">
        <a
          href="#"
          className="bg-[#1877f2] rounded-full size-11 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
          <Icon icon="ri:facebook-fill" className="size-5 text-white" />
        </a>
        <button
          type="button"
          className="bg-orange-500 rounded-full size-11 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
          <Icon
            icon="heroicons:chat-bubble-oval-left"
            className="size-5 text-white"
          />
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
