"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
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
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

type TourListDataState = "loading" | "ready" | "empty" | "error";

/* ══════════════════════════════════════════════════════════════
   Stat Card
   ══════════════════════════════════════════════════════════════ */
interface StatCardProps {
  label: string;
  value: number;
  accent: "stone" | "green" | "red" | "amber";
  icon: string;
}

function StatCard({ label, value, accent, icon }: StatCardProps) {
  const configs = {
    stone: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-300" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-400" },
    red: { bg: "bg-red-50", text: "text-red-500", border: "border-red-400" },
    amber: { bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-400" },
  };
  const c = configs[accent];

  return (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden bg-white rounded-[2.5rem] border border-stone-200/50 p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 group`}>
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-60 ${c.bg}`}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-stone-900 mt-1 data-value">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${c.bg} border-l-2 ${c.border}`}>
          <Icon icon={icon} className={`size-5 ${c.text}`} />
        </div>
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
  let bgColor = "bg-stone-100";
  let textColor = "text-stone-600";
  let dotColor = "bg-stone-400";

  if (lower === "active") {
    bgColor = "bg-emerald-50";
    textColor = "text-emerald-700";
    dotColor = "bg-emerald-500";
  } else if (lower === "inactive") {
    bgColor = "bg-red-50";
    textColor = "text-red-700";
    dotColor = "bg-red-500";
  } else if (lower === "pending") {
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
    dotColor = "bg-amber-500";
  } else if (lower === "rejected") {
    bgColor = "bg-rose-50";
    textColor = "text-rose-700";
    dotColor = "bg-rose-500";
  } else if (lower === "draft") {
    bgColor = "bg-stone-100";
    textColor = "text-stone-600";
    dotColor = "bg-stone-400";
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
  const [dataState, setDataState] = useState<TourListDataState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [failedThumbnailIds, setFailedThumbnailIds] = useState<Set<string>>(new Set());
  const [reloadToken, setReloadToken] = useState(0);

  /* ── Fetch tours (always uses page 1, resets on search/filter change) ── */
  useEffect(() => {
    let active = true;
    const doFetch = async () => {
      try {
        setDataState("loading");
        setErrorMessage(null);
        setCurrentPage(1);
        const result = await tourService.getAllTours(
          debouncedSearch || undefined,
          1,
          pageSize,
        );
        if (!active) return;
        if (result) {
          setTours(result.data ?? []);
          setTotalItems(result.total ?? 0);
          setFailedThumbnailIds(new Set());
          if (!result.data || result.data.length === 0) {
            setDataState("empty");
          } else {
            setDataState("ready");
          }
        }
      } catch (error: unknown) {
        if (!active) return;
        const handledError = handleApiError(error);
        console.error("Failed to fetch tours:", handledError.message);
        setTours([]);
        setDataState("error");
        setErrorMessage(handledError.message);
      }
    };
    void doFetch();
    return () => { active = false; };
  }, [debouncedSearch, pageSize, reloadToken]);

  /* ── Derived stat counts ──────────────────────────────────── */
  const statCounts = {
    total: totalItems,
    active: totalItems,
    inactive: 0,
    draft: 0,
  };

  /* ── Filtered tours ───────────────────────────────────────── */
  const filteredTours = tours;

  /* ── Pagination ───────────────────────────────────────────── */
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <main id="main-content" className="p-6 space-y-8 max-w-[1400px] mx-auto">
        {/* ── Page Header ────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900">
              {t("tourList.pageTitle", "Tours")}
            </h1>
            <p className="text-sm text-stone-500">
              {t("tourList.pageSubtitle", "Manage your tour packages and itineraries")}
            </p>
          </div>
          <button
            onClick={() => router.push("/tour-management/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-sm font-semibold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 shrink-0">
            <Icon icon="heroicons:plus" className="size-4" />
            {t("tourList.addNewTour", "Add New Tour")}
          </button>
        </motion.div>

        {/* ── Stat Cards (asymmetric: 3+1) ─────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t("tourList.stat.totalTours", "Total Tours")}
            value={statCounts.total}
            accent="stone"
            icon="heroicons:globe-alt"
          />
          <StatCard
            label={t("tourList.stat.active", "Active")}
            value={statCounts.active}
            accent="green"
            icon="heroicons:check-circle"
          />
          <StatCard
            label={t("tourList.stat.inactive", "Inactive")}
            value={statCounts.inactive}
            accent="red"
            icon="heroicons:x-circle"
          />
          <StatCard
            label={t("tourList.stat.draft", "Draft")}
            value={statCounts.draft}
            accent="amber"
            icon="heroicons:document"
          />
        </motion.div>

        {/* ── Search & Filter ────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Icon
              icon="heroicons:magnifying-glass"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t("tourList.searchPlaceholder", "Search by name or code...")}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-stone-200/80 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                <Icon icon="heroicons:x-mark" className="size-4" />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-2xl border border-stone-200/80 bg-white text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 cursor-pointer">
            <option value="all">{t("tourList.statusFilter.all", "All Status")}</option>
            <option value="active">{t("tourList.statusFilter.active", "Active")}</option>
            <option value="inactive">{t("tourList.statusFilter.inactive", "Inactive")}</option>
            <option value="draft">{t("tourList.statusFilter.draft", "Draft")}</option>
            <option value="pending">{t("tourList.statusFilter.pending", "Pending")}</option>
          </select>
        </motion.div>

        {/* ── Tour Table ─────────────────────────────────── */}
        <div className="bg-white border border-stone-200/50 rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          {/* Error State */}
          {dataState === "error" && (
            <motion.div
              className="m-6 p-6 bg-white border border-red-200/50 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
              variants={itemVariants}
              initial="hidden"
              animate="show">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-red-800">
                    {t("tourList.error.title", "Could not load tours")}
                  </h2>
                  <p className="text-sm text-red-700 mt-1">
                    {errorMessage ?? t("tourList.error.fallback", "Unable to load tour data. Please try again.")}
                  </p>
                </div>
                <button
                  onClick={() => setReloadToken((v) => v + 1)}
                  className="px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-colors">
                  {t("common.retry", "Retry")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {dataState === "loading" && (
            <div className="p-6">
              <SkeletonTable rows={4} columns={5} />
            </div>
          )}

          {/* Empty state */}
          {(dataState === "empty") && filteredTours.length === 0 && (
            <motion.div
              className="m-6 p-12 text-center"
              variants={itemVariants}
              initial="hidden"
              animate="show">
              <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon="heroicons:map"
                  className="size-7 text-stone-300"
                />
              </div>
              <h2 className="text-lg font-bold text-stone-800">
                {t("tourList.empty.title", "No tours found")}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {t("tourList.empty.description", "There are no tours to display yet. Create your first tour to get started.")}
              </p>
            </motion.div>
          )}

          {/* Table */}
          {dataState === "ready" && filteredTours.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left px-8 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {t("tourList.column.tour", "Tour")}
                    </th>
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {t("tourList.column.code", "Code")}
                    </th>
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {t("tourList.column.status", "Status")}
                    </th>
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {t("tourList.column.updated", "Updated")}
                    </th>
                    <th className="text-center px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {t("tourList.column.actions", "Actions")}
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-stone-100">
                  <AnimatePresence>
                    {filteredTours.map((tour) => (
                      <motion.tr
                        variants={itemVariants}
                        layout
                        key={tour.id}
                        className="hover:bg-amber-50/30 transition-colors duration-150 group">
                        {/* Tour Name */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl border border-stone-200/80 bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-amber-300 transition-colors duration-200">
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
                                  className="size-5 text-stone-400"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-stone-900 truncate tracking-tight">
                                {tour.tourName}
                              </p>
                              <p className="text-xs text-stone-500 mt-0.5 truncate max-w-[200px]">
                                {tour.shortDescription || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Code */}
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm text-stone-600 tracking-tight">
                            {tour.tourCode}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <StatusBadge status={tour.status} />
                        </td>

                        {/* Updated */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-stone-500 tracking-tight">
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
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                router.push(`/tour-management/${tour.id}/edit`)
                              }
                              aria-label={`View ${tour.tourName}`}
                              className="p-2.5 rounded-xl text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset">
                              <Icon icon="heroicons:eye" className="size-4" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/tour-management/${tour.id}/edit`)
                              }
                              aria-label={`Edit ${tour.tourName}`}
                              className="p-2.5 rounded-xl text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset">
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
        {(dataState === "ready" || dataState === "empty") && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-stone-500">
                Showing {showingFrom}–{showingTo} of {totalItems}
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200/80 bg-white text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 cursor-pointer">
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
                  className="p-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Icon icon="heroicons:chevron-double-left" className="size-4" />
                </button>
                {/* Previous */}
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
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
                        <span className="text-sm text-stone-400 px-1.5">…</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                          p === currentPage
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-stone-600 hover:bg-stone-100 active:scale-[0.95]"
                        }`}>
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                {/* Next */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Icon icon="heroicons:chevron-right" className="size-4" />
                </button>
                {/* Last Page */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Icon icon="heroicons:chevron-double-right" className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </AdminSidebar>
  );
}
