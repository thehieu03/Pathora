"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";
import { tourService } from "@/services/tourService";
import { TourVm } from "@/types/tour";

/* ── Animation Variants ───────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

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
      {/* Logo */}
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

      {/* Nav */}
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

      {/* User */}
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
  borderColor: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  label,
  value,
  borderColor,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-xl border-l-4 p-5 flex items-center gap-4 shadow-sm ${borderColor}`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon icon={icon} className={`size-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Status Badge
   ══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let bgColor = "bg-slate-100";
  let textColor = "text-slate-600";
  let dotColor = "bg-slate-400";

  if (lower === "active") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    dotColor = "bg-green-500";
  } else if (lower === "inactive") {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
    dotColor = "bg-red-500";
  } else if (lower === "pending") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
    dotColor = "bg-yellow-500";
  } else if (lower === "draft") {
    bgColor = "bg-slate-100";
    textColor = "text-slate-600";
    dotColor = "bg-slate-400";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   TourListPage - Main Export
   ══════════════════════════════════════════════════════════════ */
export function TourListPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tours, setTours] = useState<TourVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isFirstRender = useRef(true);

  /* ── Debounce search text (400ms) ─────────────────────────── */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchText);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchText]);

  /* ── Fetch tours ──────────────────────────────────────────── */
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      const result = await tourService.getAllTours(
        debouncedSearch || undefined,
        currentPage,
        pageSize,
      );
      if (result) {
        setTours(result.data ?? []);
        setTotalItems(result.total ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      toast.error(t("tourAdmin.fetchError", "Failed to load tours"));
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage, pageSize, t]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  /* ── Derived stat counts ──────────────────────────────────── */
  const statCounts = {
    total: totalItems,
    active: tours.filter((t) => t.status?.toLowerCase() === "active").length,
    inactive: tours.filter((t) => t.status?.toLowerCase() === "inactive")
      .length,
    draft: tours.filter((t) => t.status?.toLowerCase() === "draft").length,
  };

  /* ── Filtered tours ───────────────────────────────────────── */
  const filteredTours =
    statusFilter === "all"
      ? tours
      : tours.filter((t) => t.status?.toLowerCase() === statusFilter);

  /* ── Pagination ───────────────────────────────────────────── */
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop */}
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
              <h1 className="text-2xl font-bold text-slate-900">Tours</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage your tour packages and itineraries
              </p>
            </div>
            <button
              onClick={() => router.push("/tour-management/create")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
              <Icon icon="heroicons:plus" className="size-4" />
              Add New Tour
            </button>
          </div>

          {/* ── Search & Filter ────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Icon
                icon="heroicons:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("tourAdmin.searchPlaceholder", "Search by name or code...")}
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <Icon icon="heroicons:x-mark" className="size-4" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* ── Stat Cards ─────────────────────────────────── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Total Tours"
              value={statCounts.total}
              borderColor="border-slate-300"
              icon="heroicons:globe-alt"
              iconBg="bg-slate-100"
              iconColor="text-slate-600"
            />
            <StatCard
              label="Active"
              value={statCounts.active}
              borderColor="border-green-400"
              icon="heroicons:check-circle"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              label="Inactive"
              value={statCounts.inactive}
              borderColor="border-red-400"
              icon="heroicons:x-circle"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
            <StatCard
              label="Draft"
              value={statCounts.draft}
              borderColor="border-slate-300"
              icon="heroicons:document"
              iconBg="bg-slate-100"
              iconColor="text-slate-500"
            />
          </motion.div>

          {/* ── Tour Table ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Icon
                  icon="heroicons:arrow-path"
                  className="size-8 animate-spin text-slate-400"
                />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredTours.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon
                  icon="heroicons:map"
                  className="size-12 text-slate-300 mb-3"
                />
                <p className="text-sm text-slate-500">
                  {t("tourAdmin.noTours", "No tours found")}
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && filteredTours.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Tour
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Code
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Updated
                      </th>
                      <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-100"
                  >
                    <AnimatePresence>
                      {filteredTours.map((tour) => (
                        <motion.tr
                          variants={itemVariants}
                          layout
                          key={tour.id}
                          className="hover:bg-slate-50 transition-colors">
                          {/* Tour Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                              <Icon
                                icon="heroicons:photo"
                                className="size-6 text-slate-400"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {tour.tourName}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {tour.shortDescription || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Code */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-slate-600">
                            {tour.tourCode}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={tour.status} />
                        </td>

                        {/* Updated */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">
                            {tour.createdOnUtc
                              ? new Date(tour.createdOnUtc).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                router.push(`/tour-management/${tour.id}/edit`)
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="View / Edit">
                              <Icon icon="heroicons:eye" className="size-4" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/tour-management/${tour.id}/edit`)
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Edit">
                              <Icon
                                icon="heroicons:pencil-square"
                                className="size-4"
                              />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Pagination ─────────────────────────────────── */}
          {!loading && totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  Showing {showingFrom}–{showingTo} of {totalItems}
                </p>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(1)}
                    className="p-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="First page">
                    <Icon icon="heroicons:chevron-double-left" className="size-4" />
                  </button>
                  {/* Previous */}
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous page">
                    <Icon icon="heroicons:chevron-left" className="size-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 1,
                    )
                    .map((p, i, arr) => (
                      <React.Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="text-sm text-slate-400 px-1">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            p === currentPage
                              ? "bg-orange-500 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}>
                          {p}
                        </button>
                      </React.Fragment>
                    ))}

                  {/* Next */}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Next page">
                    <Icon icon="heroicons:chevron-right" className="size-4" />
                  </button>
                  {/* Last Page */}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="p-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Last page">
                    <Icon icon="heroicons:chevron-double-right" className="size-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
