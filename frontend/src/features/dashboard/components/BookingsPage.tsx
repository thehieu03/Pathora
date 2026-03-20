"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { adminService } from "@/api/services/adminService";
import type { AdminBooking } from "@/api/services/adminService";
import { AdminSidebar } from "./AdminSidebar";

type BookingStatus = "confirmed" | "pending" | "cancelled";

const STATUS_BADGE: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  confirmed: { bg: "bg-emerald-50/80", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50/80", text: "text-amber-700", dot: "bg-amber-500" },
  cancelled: { bg: "bg-rose-50/80", text: "text-rose-700", dot: "bg-rose-500" },
};

type BookingsDataState = "loading" | "ready" | "empty" | "error";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, type: "spring" as const, stiffness: 100, damping: 20 },
  }),
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/60 h-16 flex items-center px-6 gap-4">
      <button
        onClick={onMenuClick}
        aria-label={t("common.menu", "Menu")}
        className="lg:hidden text-stone-500 hover:text-stone-700 transition-colors"
      >
        <Icon icon="heroicons:bars-3" className="size-5" />
      </button>
      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label={t("notifications.aria", "Notifications")}
          className="relative p-2 text-stone-500 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-all duration-200 active:scale-[0.97]"
        >
          <Icon icon="heroicons:bell" className="size-5" />
        </button>
      </div>
    </header>
  );
}

export default function BookingsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataState, setDataState] = useState<BookingsDataState>("loading");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setDataState("loading");
      setErrorMessage(null);

      try {
        const result = await adminService.getBookings();
        if (!active) return;
        if (!result || result.length === 0) {
          setBookings([]);
          setDataState("empty");
        } else {
          setBookings(result);
          setDataState("ready");
        }
      } catch (err) {
        if (!active) return;
        setBookings([]);
        setDataState("error");
        setErrorMessage(
          err instanceof Error ? err.message : t("bookings.error.loadFailed", "Failed to load bookings"),
        );
      }
    };

    void loadBookings();

    return () => {
      active = false;
    };
  }, [reloadToken, t]);

  const isLoading = dataState === "loading";
  const isError = dataState === "error";
  const isEmpty = dataState === "empty";
  const canShowData = dataState === "ready" || isEmpty;

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + (booking.amount ?? 0), 0),
    [bookings],
  );

  const confirmedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "confirmed").length,
    [bookings],
  );

  const retryLoading = () => {
    setReloadToken((value) => value + 1);
  };

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <main id="main-content" className="px-6 pb-10">
        {/* Page Header — asymmetric left-aligned */}
        <motion.div
          className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          variants={itemVariants}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 leading-none">
              {t("bookings.pageTitle", "Booking Management")}
            </h1>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              {t("bookings.pageSubtitle", "Track and manage all booking orders")}
            </p>
          </div>
          <Link
            href="/bookings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:border-stone-300 active:scale-[0.98] transition-all duration-200 group shrink-0"
          >
            <Icon icon="heroicons:arrow-top-right-on-square" className="size-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
            {t("bookings.openCustomerPage", "Customer view")}
          </Link>
        </motion.div>

        {isLoading ? (
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <SkeletonTable rows={4} columns={6} />
          </motion.div>
        ) : null}

        {isError ? (
          <motion.div
            className="rounded-[2.5rem] bg-white border border-red-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6"
            variants={itemVariants}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="heroicons:exclamation-circle" className="size-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-red-800">
                    {t("bookings.error.title", "Could not load bookings")}
                  </h2>
                  <p className="text-sm text-red-700/80 mt-0.5">
                    {errorMessage ?? t("bookings.error.fallback", "Unable to load booking data. Please try again.")}
                  </p>
                </div>
              </div>
              <button
                onClick={retryLoading}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-200 shrink-0"
              >
                {t("common.retry", "Retry")}
              </button>
            </div>
          </motion.div>
        ) : null}

        {canShowData ? (
          <>
            {/* Stats — asymmetric 2+1 grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Total — spans 1 col, full height card */}
              <motion.div variants={itemVariants}>
                <Card className="rounded-[2.5rem] border border-stone-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] !p-0 overflow-hidden" bodyClass="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                        {t("bookings.stat.totalBookings", "Total Bookings")}
                      </p>
                      <p className="text-3xl font-bold text-stone-900 mt-2 tracking-tight data-value">
                        {isEmpty ? 0 : bookings.length}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center">
                      <Icon icon="heroicons:ticket" className="size-5 text-stone-400" />
                    </div>
                  </div>
                  <div className="mt-3 h-1 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full rounded-full bg-stone-300" style={{ width: "40%" }} />
                  </div>
                </Card>
              </motion.div>

              {/* Confirmed — accent-tinted */}
              <motion.div variants={itemVariants}>
                <Card className="rounded-[2.5rem] border border-emerald-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] !p-0 overflow-hidden" bodyClass="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                        {t("bookings.stat.confirmed", "Confirmed")}
                      </p>
                      <p className="text-3xl font-bold text-emerald-700 mt-2 tracking-tight data-value">
                        {confirmedCount}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Icon icon="heroicons:check-badge" className="size-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-3 h-1 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${confirmedCount > 0 ? Math.round((confirmedCount / (isEmpty ? 1 : bookings.length)) * 100) : 0}%` }} />
                  </div>
                </Card>
              </motion.div>

              {/* Revenue — accent amber */}
              <motion.div variants={itemVariants} className="lg:col-start-3">
                <Card className="rounded-[2.5rem] border border-amber-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] !p-0 overflow-hidden" bodyClass="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                        {t("bookings.stat.totalRevenue", "Total Revenue")}
                      </p>
                      <p className="text-3xl font-bold text-amber-600 mt-2 tracking-tight data-value">
                        ${totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <Icon icon="heroicons:currency-dollar" className="size-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-stone-400">Live data</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Table Section */}
            {isEmpty ? (
              <motion.div
                className="rounded-[2.5rem] bg-white border border-stone-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-16 text-center"
                variants={itemVariants}
                initial="hidden"
                animate="show"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="heroicons:clipboard-document"
                    className="size-7 text-stone-300"
                  />
                </div>
                <h2 className="text-lg font-semibold text-stone-700">
                  {t("bookings.empty.title", "No bookings yet")}
                </h2>
                <p className="text-sm text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  {t("bookings.empty.description", "There are no booking records to display.")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
              >
                <div className="rounded-[2.5rem] bg-white border border-stone-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                  {/* Table header label */}
                  <div className="px-6 pt-5 pb-3 border-b border-stone-100">
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                      {t("bookings.tableLabel", "All booking records")} &middot; {bookings.length}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-stone-100">
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.booking", "Booking ID")}
                          </th>
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.customer", "Customer")}
                          </th>
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.tour", "Tour")}
                          </th>
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.departure", "Departure")}
                          </th>
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.amount", "Amount")}
                          </th>
                          <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            {t("bookings.column.status", "Status")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {bookings.map((booking, i) => {
                          const badge = STATUS_BADGE[booking.status as BookingStatus] ?? { bg: "bg-stone-100", text: "text-stone-600", dot: "bg-stone-400" };
                          return (
                            <motion.tr
                              key={booking.id}
                              custom={i}
                              variants={rowVariants}
                              initial="hidden"
                              animate="show"
                              className="group hover:bg-stone-50/60 transition-colors duration-150"
                            >
                              <td className="px-6 py-4">
                                <span className="font-mono text-xs text-stone-500 tracking-tight">{String(booking.id).slice(0, 12)}...</span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-medium text-stone-800">
                                  {booking.customerName ?? booking.customer ?? "-"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-stone-600 leading-relaxed">
                                  {booking.tourName ?? booking.tour ?? "-"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-stone-500">
                                  {booking.departureDate ?? booking.departure ?? "-"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-stone-800 data-value">
                                  ${(booking.amount ?? 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                  {booking.status}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : null}
      </main>
    </AdminSidebar>
  );
}
