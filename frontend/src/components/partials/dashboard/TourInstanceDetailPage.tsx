"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { PricingTierEditor } from "@/components/partials/dashboard/PricingTierEditor";
import { tourInstanceService } from "@/services/tourInstanceService";
import { handleApiError } from "@/utils/apiResponse";
import {
  DynamicPricingDto,
  DynamicPricingResolutionDto,
  TourInstanceDto,
  TourInstanceStatusMap,
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
        open ? "translate-x-0" : "max-lg:-translate-x-full"
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
  const lower = status.toLowerCase().replace(/\s+/g, "_");
  const config = TourInstanceStatusMap[lower] ?? {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   Tab definitions
   ══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "overview", label: "Overview", icon: "heroicons:eye" },
  { id: "itinerary", label: "Itinerary", icon: "heroicons:map" },
  { id: "policy", label: "Policy", icon: "heroicons:document-text" },
  { id: "insurance", label: "Insurance", icon: "heroicons:shield-check" },
  { id: "bookings", label: "Bookings", icon: "heroicons:ticket", badge: true },
  {
    id: "participants",
    label: "Participants",
    icon: "heroicons:user-group",
    badge: true,
  },
];

/* ══════════════════════════════════════════════════════════════
   Overview Tab
   ══════════════════════════════════════════════════════════════ */
function OverviewTab({ data }: { data: TourInstanceDto }) {
  const participantPercent =
    data.maxParticipants > 0
      ? Math.round((data.registeredParticipants / data.maxParticipants) * 100)
      : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + " VND";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Participants */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
              <Icon icon="heroicons:users" className="size-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data.registeredParticipants}/{data.maxParticipants}
          </p>
          <p className="text-sm text-slate-500 mt-1">Participants</p>
          <div className="mt-3">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${participantPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {participantPercent}% occupied
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center">
              <Icon
                icon="heroicons:currency-dollar"
                className="size-6 text-green-600"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(data.revenue)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Revenue</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-[10px] flex items-center justify-center">
              <Icon
                icon="heroicons:calendar"
                className="size-6 text-orange-600"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data.totalBookings}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Bookings</p>
        </div>

        {/* Confirmation Deadline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-[10px] flex items-center justify-center">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="size-6 text-yellow-600"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatDate(data.confirmationDeadline)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Confirmation Deadline</p>
        </div>
      </div>

      {/* ── Tour Information + Tour Guide ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tour Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Icon icon="heroicons:cube" className="size-5 text-slate-700" />
            Tour Information
          </h2>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">Category</span>
              <span className="text-sm font-semibold text-slate-900">
                {data.category || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">Classification</span>
              <span className="text-sm font-semibold text-slate-900">
                {data.classificationName}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">Duration</span>
              <span className="text-sm font-semibold text-slate-900">
                {data.durationDays} days
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">Rating</span>
              <span className="flex items-center gap-1">
                <Icon
                  icon="heroicons:star-solid"
                  className="size-4 text-amber-400"
                />
                <span className="text-sm font-semibold text-slate-900">
                  {data.rating}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-500">Base Price</span>
              <span className="text-sm font-bold text-orange-500">
                {formatCurrency(data.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Tour Guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Icon icon="heroicons:user" className="size-5 text-slate-700" />
            Tour Guide
          </h2>
          {data.guide ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {data.guide.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {data.guide.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Professional Tour Guide
                  </p>
                </div>
              </div>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Languages</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {data.guide.languages.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-500">Experience</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {data.guide.experience}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Icon icon="heroicons:user-circle" className="size-12 mb-2" />
              <p className="text-sm">No guide assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Included Services ── */}
      {data.includedServices.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Icon
              icon="heroicons:check-circle"
              className="size-5 text-green-600"
            />
            Included Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.includedServices.map((service) => (
              <div
                key={service}
                className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-[10px]">
                <Icon
                  icon="heroicons:check-circle-solid"
                  className="size-4 text-green-500 shrink-0"
                />
                <span className="text-sm text-slate-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Dynamic Pricing ── */}
      {data.dynamicPricing.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Icon
              icon="heroicons:currency-dollar"
              className="size-5 text-orange-500"
            />
            Dynamic Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.dynamicPricing.map((tier, idx) => (
              <div
                key={idx}
                className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  {tier.minParticipants === tier.maxParticipants
                    ? `${tier.minParticipants} participants`
                    : `${tier.minParticipants}-${tier.maxParticipants} participants`}
                </p>
                <p className="text-2xl font-bold text-orange-500 mt-1">
                  {formatCurrency(tier.pricePerPerson)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">per person</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Placeholder tab content
   ══════════════════════════════════════════════════════════════ */
function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <Icon
        icon="heroicons:document-text"
        className="size-12 mx-auto text-slate-300 mb-3"
      />
      <p className="text-lg font-semibold text-slate-400">
        {label} content coming soon
      </p>
      <p className="text-sm text-slate-400 mt-1">
        This section is under development.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Tour Instance Detail Page
   ══════════════════════════════════════════════════════════════ */
export default function TourInstanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<TourInstanceDto | null>(null);
  const [overrideTiers, setOverrideTiers] = useState<DynamicPricingDto[]>([]);
  const [savingOverrideTiers, setSavingOverrideTiers] = useState(false);
  const [clearingOverrideTiers, setClearingOverrideTiers] = useState(false);
  const [resolutionParticipants, setResolutionParticipants] = useState("4");
  const [resolutionResult, setResolutionResult] =
    useState<DynamicPricingResolutionDto | null>(null);
  const [resolvingPricing, setResolvingPricing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [detail, tiers] = await Promise.all([
        tourInstanceService.getInstanceDetail(id),
        tourInstanceService.getPricingTiers(id),
      ]);

      if (detail) {
        setData({ ...detail, dynamicPricing: tiers });
      } else {
        setData(null);
      }

      setOverrideTiers(tiers);
      setResolutionResult(null);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to load tour instance details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSaveOverrideTiers = useCallback(async () => {
    try {
      setSavingOverrideTiers(true);
      await tourInstanceService.upsertPricingTiers(id, overrideTiers);
      toast.success("Instance pricing overrides saved.");

      setData((current) =>
        current
          ? {
              ...current,
              dynamicPricing: overrideTiers,
            }
          : current,
      );
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to save instance override tiers.");
    } finally {
      setSavingOverrideTiers(false);
    }
  }, [id, overrideTiers]);

  const handleClearOverrideTiers = useCallback(async () => {
    try {
      setClearingOverrideTiers(true);
      await tourInstanceService.clearPricingTiers(id);
      setOverrideTiers([]);
      setData((current) =>
        current
          ? {
              ...current,
              dynamicPricing: [],
            }
          : current,
      );
      setResolutionResult(null);
      toast.success("Instance override tiers cleared.");
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to clear instance override tiers.");
    } finally {
      setClearingOverrideTiers(false);
    }
  }, [id]);

  const handleResolvePricing = useCallback(async () => {
    const participants = Number(resolutionParticipants);
    if (!Number.isFinite(participants) || participants <= 0) {
      toast.error("Participants must be greater than 0.");
      return;
    }

    try {
      setResolvingPricing(true);
      const result = await tourInstanceService.resolvePricing(id, participants);
      setResolutionResult(result ?? null);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to resolve pricing preview.");
    } finally {
      setResolvingPricing(false);
    }
  }, [id, resolutionParticipants]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) =>
    `${new Intl.NumberFormat("vi-VN").format(value)} VND`;

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main id="main-content" className="flex-1 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded w-48" />
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main id="main-content" className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="heroicons:exclamation-circle"
                className="size-12 mx-auto text-slate-300 mb-3"
              />
              <p className="text-lg font-semibold text-slate-500">
                Tour instance not found
              </p>
              <Link
                href="/tour-instances"
                className="mt-4 inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium">
                <Icon icon="heroicons:arrow-left" className="size-4" />
                Back to Tour Instances
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* ── Instance Header ── */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-8 pt-5 space-y-4">
            {/* Back + status + edit */}
            <div className="flex items-center justify-between">
              <Link
                href="/tour-instances"
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                <Icon icon="heroicons:arrow-left" className="size-5" />
                <span className="text-base font-semibold">
                  Back to Tour Instances
                </span>
              </Link>
              <div className="flex items-center gap-3">
                <StatusBadge status={data.status} />
                <button
                  onClick={() => router.push(`/tour-instances/${data.id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-[10px] text-sm font-medium transition-colors">
                  <Icon icon="heroicons:pencil-square" className="size-4" />
                  Edit Instance
                </button>
              </div>
            </div>

            {/* Tour info row */}
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-32 h-32 rounded-xl border-2 border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                {data.thumbnail?.publicURL ? (
                  <img
                    src={data.thumbnail.publicURL}
                    alt={data.tourName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="heroicons:photo"
                      className="size-10 text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 truncate">
                    {data.tourName}
                  </h1>
                  <span className="shrink-0 px-3 py-1 bg-orange-100 rounded-full text-xs font-bold text-orange-500">
                    ID: {data.tourCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <Icon icon="heroicons:map-pin" className="size-4" />
                  <span>{data.location}</span>
                  <span className="text-slate-300">•</span>
                  <span>{data.classificationName}</span>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Icon icon="heroicons:calendar" className="size-3.5" />
                    Departure: {formatDate(data.startDate)}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Icon icon="heroicons:clock" className="size-3.5" />
                    {data.durationDays} days
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Icon icon="heroicons:users" className="size-3.5" />
                    {data.registeredParticipants}/{data.maxParticipants}{" "}
                    participants
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tab Bar ── */}
          <div className="px-8 mt-4 flex gap-1 border-t border-slate-200 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}>
                  <Icon icon={tab.icon} className="size-4" />
                  {tab.label}
                  {tab.badge &&
                    tab.id === "bookings" &&
                    data.totalBookings > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white">
                        {data.totalBookings}
                      </span>
                    )}
                  {tab.badge &&
                    tab.id === "participants" &&
                    data.registeredParticipants > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500 text-white">
                        {data.registeredParticipants}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <main id="main-content" className="flex-1 overflow-y-auto p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <OverviewTab data={data} />

              <PricingTierEditor
                title="Instance Override Pricing"
                subtitle="Configure participant-tier overrides for this specific departure."
                tiers={overrideTiers}
                saving={savingOverrideTiers}
                saveLabel="Save override tiers"
                allowClear
                clearing={clearingOverrideTiers}
                clearLabel="Clear overrides"
                infoMessage="Instance tiers take precedence over classification default tiers. Clear overrides to fall back to classification pricing."
                onChange={setOverrideTiers}
                onSave={handleSaveOverrideTiers}
                onClear={handleClearOverrideTiers}
              />

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Effective Price Preview
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Preview resolved price source for a participant count.
                </p>

                <div className="flex flex-wrap items-end gap-3">
                  <label>
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Participants
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={resolutionParticipants}
                      onChange={(event) => setResolutionParticipants(event.target.value)}
                      className="mt-1 w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleResolvePricing}
                    disabled={resolvingPricing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors">
                    {resolvingPricing && (
                      <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />
                    )}
                    Resolve price
                  </button>
                </div>

                {resolutionResult && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      Source: <span className="font-semibold">{resolutionResult.pricingSource}</span>
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Price: <span className="font-semibold">{formatCurrency(resolutionResult.resolvedPricePerPerson)}</span>
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Matched range: {resolutionResult.minParticipants ?? "-"} - {resolutionResult.maxParticipants ?? "-"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "itinerary" && <PlaceholderTab label="Itinerary" />}
          {activeTab === "policy" && <PlaceholderTab label="Policy" />}
          {activeTab === "insurance" && <PlaceholderTab label="Insurance" />}
          {activeTab === "bookings" && <PlaceholderTab label="Bookings" />}
          {activeTab === "participants" && (
            <PlaceholderTab label="Participants" />
          )}
        </main>
      </div>
    </div>
  );
}
