"use client";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "@/features/shared/components/LandingImage";
import { Icon } from "@/components/ui";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { tourService } from "@/api/services/tourService";
import { homeService } from "@/api/services/homeService";
import { normalizeLanguageForApi } from "@/api/languageHeader";
import { TopReview } from "@/types/home";
import { formatCurrency } from "@/utils/format";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";
import {
  TourDto,
  TourDayDto,
  TourDayActivityDto,
  ActivityTypeMap,
  TransportationTypeMap,
  RoomTypeMap,
  MealTypeMap,
  InsuranceTypeMap,
  NormalizedTourInstanceVm,
  TourInstanceStatusMap,
} from "@/types/tour";

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

/* ── Info Pill ─────────────────────────────────────────────── */
function InfoPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
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
        <span className="text-sm font-bold text-[#05073c]">{value}</span>
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

/* ── Loading Skeleton ──────────────────────────────────────── */
function TourDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[460px] bg-gray-200 animate-pulse">
        <div className="absolute inset-x-0 top-0 z-20">
          <LandingHeader />
        </div>
      </div>
      <div className="max-w-330 mx-auto px-4 md:px-3.75">
        <div className="py-4 px-6">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 px-6 pb-16">
          <div className="flex-1 flex flex-col gap-5">
            <div className="h-[260px] bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}

/* ── Itinerary Day Card ────────────────────────────────────── */
function ItineraryDayCard({ day }: { day: TourDayDto }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <Button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 rounded-full size-9 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-orange-500">
              {day.dayNumber}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-[#05073c]">
              {day.title}
            </span>
            {day.description && (
              <span className="text-xs text-gray-400">{day.description}</span>
            )}
          </div>
        </div>
        <Icon
          icon={expanded ? "heroicons:chevron-up" : "heroicons:chevron-down"}
          className="size-4 text-gray-400"
        />
      </Button>

      {expanded && day.activities.length > 0 && (
        <div className="px-5 pb-5 flex flex-col gap-3">
          {day.activities
            .sort((a, b) => a.order - b.order)
            .map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
        </div>
      )}
    </div>
  );
}

/* ── Activity Item ─────────────────────────────────────────── */
function ActivityItem({ activity }: { activity: TourDayActivityDto }) {
  const timeStr = [activity.startTime, activity.endTime]
    .filter(Boolean)
    .join(" – ");

  return (
    <div className="flex gap-3 pl-3 border-l-2 border-orange-200">
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {ActivityTypeMap[activity.activityType] ?? "Activity"}
          </span>
          {activity.isOptional && (
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
          {timeStr && (
            <span className="text-[10px] text-gray-400">{timeStr}</span>
          )}
        </div>
        <span className="text-xs font-semibold text-[#05073c]">
          {activity.title}
        </span>
        {activity.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {activity.description}
          </p>
        )}

        {/* Routes */}
        {activity.routes.length > 0 && (
          <div className="mt-1 flex flex-col gap-1">
            {activity.routes
              .sort((a, b) => a.order - b.order)
              .map((route) => (
                <div
                  key={route.id}
                  className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Icon
                    icon="heroicons:arrow-right"
                    className="size-3 text-gray-400"
                  />
                  <span className="font-medium">
                    {TransportationTypeMap[route.transportationType] ??
                      "Transport"}
                  </span>
                  {route.fromLocation && route.toLocation && (
                    <span>
                      {route.fromLocation.locationName} →{" "}
                      {route.toLocation.locationName}
                    </span>
                  )}
                  {route.durationMinutes && (
                    <span className="text-gray-400">
                      ({route.durationMinutes} min)
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Accommodation */}
        {activity.accommodation && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500">
            <Icon
              icon="heroicons:building-office"
              className="size-3 text-gray-400"
            />
            <span className="font-medium">
              {activity.accommodation.accommodationName}
            </span>
            <span>
              ({RoomTypeMap[activity.accommodation.roomType] ?? "Room"})
            </span>
            {activity.accommodation.mealsIncluded > 0 && (
              <span className="text-orange-500">
                • {MealTypeMap[activity.accommodation.mealsIncluded] ?? ""}
              </span>
            )}
          </div>
        )}

        {activity.note && (
          <p className="text-[10px] text-gray-400 italic mt-0.5">
            {activity.note}
          </p>
        )}
        {activity.estimatedCost != null && activity.estimatedCost > 0 && (
          <span className="text-[10px] text-orange-500 font-medium">
            ~{formatCurrency(activity.estimatedCost)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Reviews Section ──────────────────────────────────────── */
function ReviewsSection() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<TopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        const data = await homeService.getTopReviews(6);
        if (!cancelled) {
          setReviews(data ?? []);
        }
      } catch {
        // Ignore errors - component will show empty state
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-base font-bold text-[#05073c] mb-4 flex items-center gap-2">
          <Icon icon="heroicons:star" className="size-5 text-orange-500" />
          {t("landing.tourDetail.reviewsTitle")}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              icon="heroicons:chat-bubble-bottom-center-text"
              className="size-10 text-gray-300 mx-auto mb-3"
            />
            <p className="text-sm text-gray-500">
              {t("landing.tourDetail.noReviews")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t("landing.tourDetail.noReviewsCta")}
            </p>
          </div>
        ) : (
          <>
            {/* Average rating header */}
            <div className="flex items-center gap-3 mb-5 bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-orange-500">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon="heroicons:star-solid"
                      className={`size-3.5 ${i < Math.round(averageRating) ? "text-orange-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#05073c]">
                  {t("landing.tourDetail.averageRating")}
                </span>
                <span className="text-[10px] text-gray-400">
                  {t("landing.tourDetail.totalReviews", {
                    count: reviews.length,
                  })}
                </span>
              </div>
            </div>

            {/* Review cards */}
            <div className="flex flex-col gap-4">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {review.userAvatar ? (
                      <Image
                        src={review.userAvatar}
                        alt={review.userName}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-500">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-[#05073c] block truncate">
                        {review.userName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon="heroicons:star-solid"
                          className={`size-3 ${i < review.rating ? "text-orange-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Scheduled Departures Section ─────────────────────────── */
function ScheduledDeparturesSection({
  tourId,
  apiLanguage,
}: {
  tourId: string;
  apiLanguage: string;
}) {
  const { t } = useTranslation();
  const [instances, setInstances] = useState<NormalizedTourInstanceVm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const data = await homeService.getAvailablePublicInstances(
          undefined,
          1,
          50,
          apiLanguage,
        );
        if (!cancelled) {
          const filtered = (data?.data ?? []).filter(
            (inst: NormalizedTourInstanceVm) => inst.tourId === tourId,
          );
          setInstances(filtered);
        }
      } catch {
        // Ignore errors - component will show empty state
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [tourId, apiLanguage]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-5 w-56 bg-gray-200 rounded mb-4" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-base font-bold text-[#05073c] mb-4 flex items-center gap-2">
          <Icon
            icon="heroicons:calendar-days"
            className="size-5 text-orange-500"
          />
          {t("tourInstance.scheduledDepartures")}
        </h3>

        {instances.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              icon="heroicons:calendar"
              className="size-10 text-gray-300 mx-auto mb-3"
            />
            <p className="text-sm text-gray-500">
              {t("tourInstance.noScheduledDepartures")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {instances.map((instance) => {
              const statusKey = instance.status
                .trim()
                .toLowerCase()
                .replace(/[\s_]+/g, "");
              const statusInfo = TourInstanceStatusMap[statusKey] ?? {
                label: instance.status,
                bg: "bg-gray-100",
                text: "text-gray-600",
                dot: "bg-gray-400",
              };
              const spotsLeft =
                (instance.maxParticipation ?? 0) -
                (instance.currentParticipation ?? 0);
              const startDateStr = new Date(
                instance.startDate,
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const endDateStr = new Date(instance.endDate).toLocaleDateString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              );

              return (
                <div
                  key={instance.id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                  {/* Header: dates + status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-50 rounded-lg p-2">
                        <Icon
                          icon="heroicons:calendar"
                          className="size-4 text-orange-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#05073c] line-clamp-1">
                          {instance.title || instance.tourName}
                        </span>
                        <span className="text-xs font-bold text-[#05073c]">
                          {startDateStr} — {endDateStr}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {instance.tourInstanceCode} • {instance.durationDays}{" "}
                          {t("tourInstance.days")} &bull;{" "}
                          {instance.classificationName}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                      <span
                        className={`size-1.5 rounded-full ${statusInfo.dot}`}
                      />
                      {t(
                        `tourInstance.statusLabels.${statusKey}`,
                        statusInfo.label,
                      )}
                    </span>
                  </div>

                  {/* Info row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Price */}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-orange-500">
                          {formatCurrency(instance.price)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {t("tourInstance.perPersonShort")}
                        </span>
                      </div>
                      {/* Spots */}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#05073c]">
                          {spotsLeft}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {t("tourInstance.spotsAvailable")}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/tours/instances/${instance.id}`}
                      className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                      {spotsLeft > 0 && statusKey === "available"
                        ? t("tourInstance.bookNow")
                        : t("tourInstance.viewDetails", "View details")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */
export function TourDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const tourId = params?.id as string;
  const [apiLanguage, setApiLanguage] = useState(() =>
    normalizeLanguageForApi(i18n.resolvedLanguage || i18n.language),
  );

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

  /* ── API State ───────────────────────────────────────────── */
  const [tour, setTour] = useState<TourDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!tourId) return;
    let cancelled = false;

    const initFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tourService.getPublicTourDetail(tourId, apiLanguage);
        if (!cancelled) {
          setTour(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status;
          setError(status === 404 ? "not_found" : "error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initFetch();

    return () => {
      cancelled = true;
    };
  }, [tourId, apiLanguage]);

  /* ── UI State ────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary">(
    "overview",
  );
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [departureDate, setDepartureDate] = useState("");

  /* ── Derived values ──────────────────────────────────────── */
  const classifications = tour?.classifications ?? [];
  const selectedClassification = classifications[selectedPackage] ?? null;
  const totalGuests = adults + children;

  const pricePerPerson =
    selectedClassification?.salePrice ?? selectedClassification?.price ?? 0;
  const originalPrice = selectedClassification?.price ?? 0;

  const adultTotal = adults * pricePerPerson;
  const serviceFee = 0;
  const estimatedTotal = adultTotal + serviceFee;
  const canBook = adults > 0 && departureDate !== "";

  const heroImage = tour?.thumbnail?.publicURL ?? "";
  const galleryImages = useMemo(
    () =>
      (tour?.images?.map((img) => img.publicURL).filter(Boolean) as string[]) ??
      [],
    [tour?.images],
  );

  const duration = selectedClassification
    ? `${selectedClassification.durationDays} Days`
    : "";

  const aboutParagraphs = useMemo(
    () => tour?.longDescription?.split("\n").filter(Boolean) ?? [],
    [tour?.longDescription],
  );

  const insurances = selectedClassification?.insurances ?? [];
  const itineraryDays = selectedClassification?.plans ?? [];

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) return <TourDetailSkeleton />;

  /* ── Not Found ───────────────────────────────────────────── */
  if (error === "not_found" || !tour) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LandingHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Icon
              icon="heroicons:map"
              className="size-16 text-gray-300 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-[#05073c] mb-2">
              {t("landing.tourDetail.notFound", "Tour not found")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t(
                "landing.tourDetail.notFoundDesc",
                "The tour you're looking for doesn't exist or has been removed.",
              )}
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours")}
            </Link>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LandingHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="size-16 text-red-300 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-[#05073c] mb-2">
              {t("landing.tourDetail.error", "Something went wrong")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t(
                "landing.tourDetail.errorDesc",
                "Failed to load tour details. Please try again.",
              )}
            </p>
            <Button
              type="button"
              onClick={() => {
                setLoading(true);
                setError(null);
                setRefetchTrigger((k) => k + 1);
              }}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
              <Icon icon="heroicons:arrow-path" className="size-4" />
              {t("landing.tourDetail.retry", "Try Again")}
            </Button>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ───────────────────────────────────── */}
      <div className="relative h-[60vh] max-h-[600px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={tour.tourName}
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

        {/* Back button */}
        <div className="absolute inset-x-0 top-[81px] z-10 max-w-330 mx-auto px-4 md:px-3.75">
          <div className="px-6">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/25 transition-colors backdrop-blur-md">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours")}
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-w-330 mx-auto px-4 md:px-3.75 pb-10">
          <div className="px-6 flex flex-col items-start gap-4">
            {/* Breadcrumb Floating Pill */}
            <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] text-white/90">
              <Link href="/home" className="hover:text-white transition-colors">
                {t("landing.tourDetail.home")}
              </Link>
              <Icon
                icon="heroicons:chevron-right"
                className="size-2.5 opacity-50"
              />
              <Link
                href="/tours"
                className="hover:text-white transition-colors">
                {t("landing.tourDetail.packageTours")}
              </Link>
              <Icon
                icon="heroicons:chevron-right"
                className="size-2.5 opacity-50"
              />
              <span className="font-semibold text-white truncate max-w-[150px] md:max-w-none">
                {tour.tourName}
              </span>
            </nav>

            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Icon icon="heroicons:tag" className="size-3" />
                  {tour.tourCode}
                </span>
                {tour.classifications?.[0] && (
                  <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {tour.classifications[0].name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl mb-4 drop-shadow-lg">
                {tour.tourName}
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base text-white/80 max-w-xl leading-relaxed font-medium">
                {tour.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="max-w-330 mx-auto px-4 md:px-3.75 mt-8">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-5 px-6 pb-16">
          {/* ── Left Column ──────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <div
                className={`flex gap-3 h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-sm`}>
                {/* Large image - full width when only 1 image */}
                <div
                  className={`relative min-w-0 rounded-l-3xl overflow-hidden group ${galleryImages.length === 1 ? "w-full rounded-r-3xl" : "flex-1"}`}>
                  <Image
                    src={galleryImages[0]}
                    alt={tour.tourName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Small images grid - only show slots that have images */}
                {galleryImages.length > 1 && (
                  <div
                    className={`grid gap-3 w-[220px] md:w-[260px] shrink-0 ${
                      galleryImages.length === 2 ? "grid-cols-1" : "grid-cols-2"
                    }`}>
                    {galleryImages.slice(1, 5).map((img, i) => {
                      const isTopRight =
                        i === 1 || (galleryImages.length === 2 && i === 0);
                      const isBottomRight =
                        i === 3 ||
                        (galleryImages.length === 2 && i === 0) ||
                        (galleryImages.length === 3 && i === 2);
                      const isLastImage =
                        i === Math.min(galleryImages.length - 2, 3);

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
                          {/* "+X photos" floating button on last visible image */}
                          {isLastImage && galleryImages.length > 5 && (
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center">
                              <Button
                                type="button"
                                className="bg-white text-[#05073c] px-4 py-2 rounded-full shadow-md font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform">
                                <Icon
                                  icon="heroicons:photo"
                                  className="size-4"
                                />
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

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              {duration && (
                <InfoPill
                  icon="heroicons:clock"
                  label={t("landing.tourDetail.duration")}
                  value={duration}
                />
              )}
              <InfoPill
                icon="heroicons:tag"
                label={t("landing.tourDetail.package", "Package")}
                value={selectedClassification?.name ?? "—"}
              />
              <InfoPill
                icon="heroicons:document-text"
                label={t("landing.tourDetail.plans", "Day Plans")}
                value={`${itineraryDays.length} ${t("landing.tourDetail.days", "days")}`}
              />
              <InfoPill
                icon="heroicons:shield-check"
                label={t("landing.tourDetail.insurance", "Insurance")}
                value={
                  insurances.length > 0
                    ? `${insurances.length} ${t("landing.tourDetail.included", "included")}`
                    : t("landing.tourDetail.none", "None")
                }
              />
            </div>

            {/* Tabs: Overview / Itinerary */}
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
                    {t("landing.tourDetail.overview")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("itinerary")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all rounded-xl ${
                      activeTab === "itinerary"
                        ? "bg-white shadow-sm text-orange-500"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}>
                    <Icon icon="heroicons:document-text" className="size-4" />
                    {t("landing.tourDetail.itinerary")}
                  </Button>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-[#05073c]">
                      {t("landing.tourDetail.aboutThisTour")}
                    </h3>
                    {aboutParagraphs.length > 0 ? (
                      aboutParagraphs.map((p, i) => (
                        <p
                          key={i}
                          className="text-sm text-gray-500 leading-relaxed">
                          {p}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {tour.shortDescription}
                      </p>
                    )}

                    {/* Insurance Section */}
                    {insurances.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-bold text-[#05073c] mb-3 flex items-center gap-2">
                          <Icon
                            icon="heroicons:shield-check"
                            className="size-4 text-orange-500"
                          />
                          {t(
                            "landing.tourDetail.insuranceCoverage",
                            "Insurance Coverage",
                          )}
                        </h4>
                        <div className="flex flex-col gap-2">
                          {insurances.map((ins) => (
                            <div
                              key={ins.id}
                              className="flex items-start gap-3 bg-green-50/50 border border-green-100 rounded-xl p-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="size-4 text-green-500 mt-0.5 shrink-0"
                              />
                              <div className="flex flex-col gap-0.5 flex-1">
                                <span className="text-xs font-semibold text-[#05073c]">
                                  {ins.insuranceName}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {ins.insuranceProvider} •{" "}
                                  {InsuranceTypeMap[ins.insuranceType] ??
                                    "Insurance"}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {ins.coverageDescription}
                                </span>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-orange-500 font-medium">
                                    {t(
                                      "landing.tourDetail.coverage",
                                      "Coverage",
                                    )}
                                    : {formatCurrency(ins.coverageAmount)}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {t("landing.tourDetail.fee", "Fee")}:{" "}
                                    {formatCurrency(ins.coverageFee)}
                                  </span>
                                  {ins.isOptional && (
                                    <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                      {t(
                                        "landing.tourDetail.optional",
                                        "Optional",
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-[#05073c]">
                      {t("landing.tourDetail.itinerary")}
                    </h3>
                    {itineraryDays.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {itineraryDays
                          .sort((a, b) => a.dayNumber - b.dayNumber)
                          .map((day) => (
                            <ItineraryDayCard key={day.id} day={day} />
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t(
                          "landing.tourDetail.noItinerary",
                          "No itinerary available for this package yet.",
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Scheduled Departures */}
            {tourId && (
              <ScheduledDeparturesSection
                tourId={tourId}
                apiLanguage={apiLanguage}
              />
            )}
          </div>

          {/* ── Right Sidebar ────────────────────────────── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
            {/* Booking Card */}
            <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
              {/* Orange gradient top bar */}
              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400" />

              <div className="p-5 flex flex-col gap-5">
                {/* Select Package */}
                {classifications.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                      {t("landing.tourDetail.selectPackage")}
                    </span>
                    <div className="flex flex-col gap-3 mt-1">
                      {classifications.map((cls, i) => (
                        <Button
                          key={cls.id}
                          type="button"
                          onClick={() => setSelectedPackage(i)}
                          className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden text-left ${
                            selectedPackage === i
                              ? "bg-orange-50/40 border-orange-500 shadow-[0_8px_20px_rgba(249,115,22,0.12)] scale-[1.02] z-10"
                              : "bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 hover:shadow-md hover:scale-[1.01]"
                          }`}>
                          {/* Selected Glow */}
                          {selectedPackage === i && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />
                          )}
                          <div className="flex items-center gap-3.5 relative z-10">
                            {/* Check Circle */}
                            <div
                              className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                                selectedPackage === i
                                  ? "border-orange-500 bg-orange-500 shadow-sm shadow-orange-500/40"
                                  : "border-gray-300 bg-gray-50 group-hover:border-orange-300"
                              }`}>
                              {selectedPackage === i && (
                                <Icon
                                  icon="heroicons:check"
                                  className="size-3 text-white stroke-[3]"
                                />
                              )}
                            </div>
                            <div className="flex flex-col items-start gap-0.5">
                              <span
                                className={`text-sm font-extrabold transition-colors ${selectedPackage === i ? "text-orange-600" : "text-[#05073c]"}`}>
                                {cls.name}
                              </span>
                              <span
                                className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${selectedPackage === i ? "text-orange-500/80" : "text-gray-400"}`}>
                                <Icon
                                  icon="heroicons:clock"
                                  className="size-3 shrink-0"
                                />
                                {cls.durationDays}{" "}
                                {t("landing.tourDetail.days", "days")}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 relative z-10">
                            <span
                              className={`text-[15px] font-extrabold tabular-nums tracking-tight transition-colors ${selectedPackage === i ? "text-orange-600" : "text-[#05073c]"}`}>
                              {formatCurrency(cls.salePrice)}
                            </span>
                            {cls.price !== cls.salePrice && (
                              <span className="text-[11px] text-gray-400/80 line-through font-semibold tabular-nums">
                                {formatCurrency(cls.price)}
                              </span>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estimated Price */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400">
                    {t("landing.tourDetail.estimatedPrice")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[30px] font-bold text-orange-500 leading-9">
                      {formatCurrency(pricePerPerson)}
                    </span>
                    <span className="text-sm text-gray-400">
                      {t("landing.tourDetail.perPerson", "/person")}
                    </span>
                    {originalPrice !== pricePerPerson && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
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
                    <TextInput
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="!border-gray-200 !rounded-[14px] !pl-9 !pr-3 !py-2.5 !text-sm !text-[#05073c] focus:!border-orange-500 transition-colors"
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

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-[14px] p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {t("landing.tourDetail.adults")} × {adults}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(adultTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {t("landing.tourDetail.serviceFee")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(serviceFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-bold text-[#05073c]">
                      {t("landing.tourDetail.estimatedTotal")}
                    </span>
                    <span className="text-sm font-bold text-orange-500">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {/* Request Booking Button */}
                <div className="relative group/book mt-2">
                  <Button
                    type="button"
                    disabled={!canBook}
                    onClick={() => {
                      if (tourId && canBook) {
                        // Navigate to tour instances page to select departure date
                        router.push(`/tours/instances/${tourId}`);
                      }
                    }}
                    className={`relative w-full py-4 rounded-2xl text-[15px] tracking-wide font-extrabold text-white overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ${
                      canBook
                        ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_auto] hover:bg-[center_right_1rem] shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_24px_rgba(249,115,22,0.4)] hover:-translate-y-1 active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 border border-gray-200 shadow-inner cursor-not-allowed"
                    }`}>
                    {/* Glass Shine Effect */}
                    {canBook && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover/book:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                      </div>
                    )}
                    <Icon
                      icon="heroicons:paper-airplane"
                      className={`size-5 transition-transform ${canBook ? "group-hover/book:-translate-y-0.5 group-hover/book:translate-x-0.5 group-hover/book:rotate-[-10deg]" : ""}`}
                    />
                    <span className="relative z-10">
                      {t("landing.tourDetail.requestBooking")}
                    </span>
                  </Button>
                  {!canBook && !departureDate && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/book:opacity-100 transition-opacity pointer-events-none shadow-lg">
                      {t("landing.tourDetail.selectDateFirst")}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>

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
              <Button
                type="button"
                className="w-full border-2 border-gray-100 rounded-xl py-3 text-sm font-extrabold text-[#05073c] hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all duration-300 flex items-center justify-center gap-2 group">
                {t("landing.tourDetail.contactUs")}
                <Icon
                  icon="heroicons:arrow-small-right"
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Button>
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
        <Button
          type="button"
          className="bg-orange-500 rounded-full size-11 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
          <Icon
            icon="heroicons:chat-bubble-oval-left"
            className="size-5 text-white"
          />
        </Button>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
