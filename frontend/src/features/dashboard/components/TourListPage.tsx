"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";
import { tourService } from "@/api/services/tourService";
import { handleApiError } from "@/utils/apiResponse";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchTourVm } from "@/types/tour";
import { AdminSidebar, TopBar } from "./AdminSidebar";

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
  const normalizedStatus = status?.trim() || "Unknown";
  const lower = normalizedStatus.toLowerCase();
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
  } else if (lower === "rejected") {
    bgColor = "bg-rose-100";
    textColor = "text-rose-700";
    dotColor = "bg-rose-500";
  } else if (lower === "draft") {
    bgColor = "bg-slate-100";
    textColor = "text-slate-600";
    dotColor = "bg-slate-400";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {normalizedStatus}
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
  const [tours, setTours] = useState<SearchTourVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [failedThumbnailIds, setFailedThumbnailIds] = useState<Set<string>>(new Set());

  /* ── Reset to first page when search updates ──────────────── */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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
        setFailedThumbnailIds(new Set());
      }
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error("Failed to fetch tours:", handledError.message);
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
  // Public API returns only active tours, so all are active
  const statCounts = {
    total: totalItems,
    active: totalItems,
    inactive: 0,
    draft: 0,
  };

  /* ── Filtered tours ───────────────────────────────────────── */
  // All tours from public API are active
  const filteredTours = tours;

  /* ── Pagination ───────────────────────────────────────────── */
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-default"
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
                              {!failedThumbnailIds.has(tour.id) &&
                              tour.thumbnail ? (
                                <img
                                  src={tour.thumbnail}
                                  alt={tour.tourName || "Tour thumbnail"}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  onError={() =>
                                    setFailedThumbnailIds((prev) => {
                                      const next = new Set(prev);
                                      next.add(tour.id);
                                      return next;
                                    })
                                  }
                                />
                              ) : (
                                <Icon
                                  icon="heroicons:photo"
                                  className="size-6 text-slate-400"
                                />
                              )}
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
                              aria-label={`View ${tour.tourName}`}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <Icon icon="heroicons:eye" className="size-4" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/tour-management/${tour.id}/edit`)
                              }
                              aria-label={`Edit ${tour.tourName}`}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
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
