"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { tourInstanceService } from "@/services/tourInstanceService";
import {
  TourInstanceVm,
  TourInstanceStats,
  TourInstanceStatusMap,
} from "@/types/tour";

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
   Stat Card
   ══════════════════════════════════════════════════════════════ */
interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon icon={icon} className={`size-5 ${iconColor}`} />
      </div>
    </div>
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   Participants Cell
   ══════════════════════════════════════════════════════════════ */
function ParticipantsCell({
  registered,
  max,
  min,
}: {
  registered: number;
  max: number;
  min: number;
}) {
  const pct = max > 0 ? (registered / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon icon="heroicons:user-group" className="size-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">
          {registered}/{max}
        </span>
      </div>
      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">Min: {min}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TourInstanceListPage – Main Export
   ══════════════════════════════════════════════════════════════ */
export function TourInstanceListPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [instances, setInstances] = useState<TourInstanceVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<TourInstanceStats>({
    totalInstances: 0,
    available: 0,
    confirmed: 0,
    soldOut: 0,
  });
  const pageSize = 10;

  /* ── Fetch instances ──────────────────────────────────────── */
  const fetchInstances = useCallback(async () => {
    try {
      setLoading(true);
      const result = await tourInstanceService.getAllInstances(
        searchText || undefined,
        statusFilter,
        currentPage,
        pageSize,
      );
      if (result) {
        setInstances(result.data ?? []);
        setTotalItems(result.total ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch tour instances:", error);
      toast.error(
        t("tourInstance.fetchError", "Failed to load tour instances"),
      );
      setInstances([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, currentPage, t]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await tourInstanceService.getStats();
      if (result) setStats(result);
    } catch {
      // Fallback — derive from list data
    }
  }, []);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounced search — reset to page 1
  useEffect(() => {
    const timeout = setTimeout(() => setCurrentPage(1), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  /* ── Pagination ───────────────────────────────────────────── */
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " VND";

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

        <main id="main-content" className="p-6 space-y-6">
          {/* ── Page Header ────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Icon
                  icon="heroicons:calendar-days"
                  className="size-6 text-slate-700"
                />
                <h1 className="text-2xl font-bold text-slate-900">
                  Tour Instances
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage scheduled tour instances and track departures
              </p>
            </div>
            <button
              onClick={() => router.push("/tour-instances/create")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
              <Icon icon="heroicons:plus" className="size-4" />
              Create Instance
            </button>
          </div>

          {/* ── Stat Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Instances"
              value={stats.totalInstances}
              icon="heroicons:calendar-days"
              iconBg="bg-slate-100"
              iconColor="text-slate-600"
            />
            <StatCard
              label="Available"
              value={stats.available}
              icon="heroicons:check-circle"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmed}
              icon="heroicons:clipboard-document-check"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              label="Sold Out"
              value={stats.soldOut}
              icon="heroicons:x-circle"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
          </div>

          {/* ── Search & Filter ────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
                />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by title, location, or country..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="heroicons:funnel"
                  className="size-5 text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Icon
                  icon="heroicons:arrow-path"
                  className="size-8 animate-spin text-slate-400"
                />
              </div>
            )}

            {!loading && instances.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon
                  icon="heroicons:calendar"
                  className="size-12 text-slate-300 mb-3"
                />
                <p className="text-sm text-slate-500">
                  {t("tourInstance.noInstances", "No tour instances found")}
                </p>
              </div>
            )}

            {!loading && instances.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Tour Instance
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Departure
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Duration
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Participants
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Price
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {instances.map((inst) => (
                      <tr
                        key={inst.id}
                        className="hover:bg-slate-50 transition-colors">
                        {/* Tour Instance */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-16 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {inst.thumbnail?.publicURL ? (
                                <img
                                  src={inst.thumbnail.publicURL}
                                  alt={inst.tourName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon
                                  icon="heroicons:photo"
                                  className="size-5 text-slate-400"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate max-w-[250px]">
                                {inst.tourName}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Icon
                                  icon="heroicons:map-pin"
                                  className="size-3 text-slate-400"
                                />
                                <span className="text-xs text-slate-500">
                                  {inst.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Departure */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-1">
                              <Icon
                                icon="heroicons:calendar"
                                className="size-3.5 text-slate-400"
                              />
                              <span className="text-sm text-slate-700">
                                {formatDate(inst.startDate)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Return: {formatDate(inst.endDate)}
                            </p>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              icon="heroicons:clock"
                              className="size-4 text-slate-400"
                            />
                            <span className="text-sm text-slate-700">
                              {inst.durationDays} days
                            </span>
                          </div>
                        </td>

                        {/* Participants */}
                        <td className="px-6 py-4">
                          <ParticipantsCell
                            registered={inst.registeredParticipants}
                            max={inst.maxParticipants}
                            min={inst.minParticipants}
                          />
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {formatCurrency(inst.price)}
                          </p>
                          <p className="text-xs text-slate-400">per person</p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={inst.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                router.push(`/tour-instances/${inst.id}`)
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="View Details">
                              <Icon icon="heroicons:eye" className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Pagination ─────────────────────────────────── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-3 py-1 rounded text-sm text-slate-600 disabled:opacity-50 hover:bg-slate-100">
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className="px-3 py-1 rounded text-sm text-slate-600 disabled:opacity-50 hover:bg-slate-100">
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
