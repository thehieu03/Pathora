"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { adminService } from "@/api/services/adminService";
import type { AdminBooking } from "@/api/services/adminService";
import { AdminSidebar, TopBar } from "./AdminSidebar";

// ─── Design Tokens ───────────────────────────────────────────────
const CSS = {
  accent:       "var(--accent)",
  border:        "var(--border)",
  borderSub:    "var(--border-subtle)",
  surface:      "var(--surface)",
  surfaceRaise: "var(--surface-raised)",
  textPrimary:  "var(--text-primary)",
  textSecondary:"var(--text-secondary)",
  textMuted:    "var(--text-muted)",
  success:      "var(--success)",
  successMuted: "var(--success-muted)",
  successBorder:"var(--success-border)",
  danger:       "var(--danger)",
  dangerMuted:  "var(--danger-muted)",
  dangerBorder: "var(--danger-border)",
  warning:      "var(--warning)",
  warningMuted: "var(--warning-muted)",
  warningBorder:"var(--warning-border)",
  shadowCard:   "var(--shadow-card)",
} as const;

const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const EASE_BENTO = [0.32, 0.72, 0, 1] as [number, number, number, number];

// ─── Animation Variants ─────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, ...SPRING },
  }),
};

// ─── Soft-Skill: Double-Bezel Shell ───────────────────────────────
function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[1.5rem] ${className}`}
      style={{
        background: `linear-gradient(145deg, rgba(0,0,0,0.025) 0%, rgba(0,0,0,0.008) 100%)`,
        boxShadow: "0 20px 50px -12px rgba(0,0,0,0.055), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none" style={{ border: "1px solid rgba(0,0,0,0.04)" }} />
      <div className="relative rounded-[1.25rem] h-full overflow-hidden" style={{ backgroundColor: CSS.surface }}>
        {children}
      </div>
    </div>
  );
}

// ─── Soft-Skill: Eyebrow ────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[9px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3"
      style={{ color: CSS.accent, backgroundColor: `${CSS.accent}10`, border: `1px solid ${CSS.accent}18` }}
    >
      {children}
    </span>
  );
}

// ─── Soft-Skill: Scroll Reveal ───────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(6px)", y: 16 }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_BENTO, delay: delay * 0.07 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Soft-Skill: Spring Card ────────────────────────────────────
const SpringCard = React.memo(function SpringCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3, boxShadow: CSS.shadowCard }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
});

// ─── Taste-Skill: Stat Card (bento gallery) ─────────────────────
interface StatCardProps {
  label: string;
  value: string;
  accent: string;
  accentMuted: string;
  accentBorder: string;
  icon: string;
  delay: number;
  liveIndicator?: boolean;
  subIndicator?: React.ReactNode;
}

function StatCard({ label, value, accent, accentMuted, accentBorder, icon, delay, liveIndicator, subIndicator }: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <SpringCard className="h-full">
        <CardShell className="p-[1px] h-full">
          <Card bodyClass="p-7 h-full border-0 shadow-none" className="border-0 shadow-none">
            <div className="flex items-start justify-between mb-3">
              <Eyebrow>{label}</Eyebrow>
              <motion.div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: accentMuted }}
                whileHover={{ scale: 1.08 }}
                transition={SPRING}
              >
                <Icon icon={icon} className="size-5" style={{ color: accent }} />
              </motion.div>
            </div>
            <p className="text-[2rem] font-bold tracking-tight data-value leading-none" style={{ color: CSS.textPrimary, letterSpacing: "-0.03em" }}>
              {value}
            </p>
            {subIndicator && <div className="mt-3">{subIndicator}</div>}
            {liveIndicator && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                <span className="text-xs" style={{ color: CSS.textMuted }}>Live data</span>
              </div>
            )}
          </Card>
        </CardShell>
      </SpringCard>
    </Reveal>
  );
}

// ─── Taste-Skill: Breathing dot ─────────────────────────────────
const BreathingDot = React.memo(function BreathingDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex shrink-0">
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative w-2 h-2 rounded-full block" style={{ backgroundColor: color }} />
    </span>
  );
});

// ─── Taste-Skill: Status Badge ──────────────────────────────────
type BookingStatus = "confirmed" | "pending" | "cancelled";

const STATUS_BADGE: Record<BookingStatus, { bg: string; text: string; dot: string; border: string }> = {
  confirmed: { bg: CSS.successMuted, text: CSS.success, dot: CSS.success, border: "var(--success-border)" },
  pending: { bg: CSS.warningMuted, text: CSS.warning, dot: CSS.warning, border: "var(--warning-border)" },
  cancelled: { bg: CSS.dangerMuted, text: CSS.danger, dot: CSS.danger, border: "var(--danger-border)" },
};

function StatusBadge({ status }: { status: string }) {
  const badge = STATUS_BADGE[status as BookingStatus];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
      style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
      {status}
    </span>
  );
}

// ─── Taste-Skill: Table Row ─────────────────────────────────────
const TableRow = React.memo(function TableRow({
  booking,
  index,
}: {
  booking: AdminBooking;
  index: number;
}) {
  return (
    <motion.tr
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="group cursor-default"
      style={{ borderBottom: `1px solid ${CSS.borderSub}` }}
    >
      <td className="px-6 py-4">
        <span className="font-mono text-xs tracking-tight" style={{ color: CSS.textMuted }}>
          {String(booking.id).slice(0, 12)}...
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-medium" style={{ color: CSS.textPrimary }}>
          {booking.customerName ?? booking.customer ?? "—"}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm" style={{ color: CSS.textSecondary }}>
          {booking.tourName ?? booking.tour ?? "—"}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm" style={{ color: CSS.textMuted }}>
          {booking.departureDate ?? booking.departure ?? "—"}
        </p>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-semibold data-value" style={{ color: CSS.textPrimary }}>
          ${(booking.amount ?? 0).toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={booking.status ?? "pending"} />
      </td>
    </motion.tr>
  );
});

// ─── Data types ──────────────────────────────────────────────────
type BookingsDataState = "loading" | "ready" | "empty" | "error";

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

  const confirmedPercent = bookings.length > 0 ? Math.round((confirmedCount / bookings.length) * 100) : 0;

  // Stats
  const statCards = [
    {
      label: t("bookings.stat.totalBookings", "Total Bookings"),
      value: isEmpty ? "0" : String(bookings.length),
      accent: CSS.textMuted,
      accentMuted: CSS.surfaceRaise,
      accentBorder: CSS.border,
      icon: "heroicons:ticket",
      delay: 0,
      subIndicator: (
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: CSS.surfaceRaise }}>
          <div className="h-full rounded-full" style={{ width: "40%", backgroundColor: CSS.textMuted }} />
        </div>
      ),
    },
    {
      label: t("bookings.stat.confirmed", "Confirmed"),
      value: String(confirmedCount),
      accent: CSS.success,
      accentMuted: CSS.successMuted,
      accentBorder: "var(--success-border)",
      icon: "heroicons:check-badge",
      delay: 1,
      subIndicator: (
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: CSS.surfaceRaise }}>
          <div className="h-full rounded-full" style={{ width: `${confirmedPercent}%`, backgroundColor: CSS.success }} />
        </div>
      ),
    },
    {
      label: t("bookings.stat.totalRevenue", "Total Revenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      accent: CSS.accent,
      accentMuted: "var(--accent-muted)",
      accentBorder: "var(--warning-border)",
      icon: "heroicons:currency-dollar",
      delay: 2,
      liveIndicator: true,
    },
  ];

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <main id="main-content" className="px-6 pb-16 max-w-[1400px] mx-auto w-full">

        {/* Page Header */}
        <Reveal delay={0}>
          <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="max-w-xl">
              <Eyebrow>Booking Management</Eyebrow>
              <h1 className="text-3xl font-bold tracking-tight leading-none" style={{ color: CSS.textPrimary, letterSpacing: "-0.03em" }}>
                {t("bookings.pageTitle", "Bookings")}
              </h1>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: CSS.textMuted }}>
                {t("bookings.pageSubtitle", "Track and manage all booking orders")}
              </p>
            </div>
            <Link
              href="/bookings"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 group shrink-0"
              style={{
                borderColor: CSS.border,
                color: CSS.textSecondary,
                backgroundColor: CSS.surface,
              }}
            >
              <Icon
                icon="heroicons:arrow-top-right-on-square"
                className="size-4 transition-colors"
                style={{ color: CSS.textMuted }}
              />
              <span className="group-hover:text-amber-600 transition-colors">
                {t("bookings.openCustomerPage", "Customer view")}
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Loading State */}
        {isLoading && (
          <Reveal delay={1}>
            <SkeletonTable rows={4} columns={6} />
          </Reveal>
        )}

        {/* Error State */}
        {isError && (
          <Reveal delay={1}>
            <CardShell className="p-[1px]">
              <Card bodyClass="p-6 border-0 shadow-none" className="border-0 shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: CSS.dangerMuted }}>
                      <Icon icon="heroicons:exclamation-circle" className="size-5" style={{ color: CSS.danger }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold" style={{ color: CSS.danger }}>
                        {t("bookings.error.title", "Could not load bookings")}
                      </h2>
                      <p className="text-sm mt-0.5" style={{ color: CSS.textSecondary }}>
                        {errorMessage ?? t("bookings.error.fallback", "Unable to load booking data. Please try again.")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={retryLoading}
                    className="px-4 py-2 rounded-xl text-sm font-semibold shrink-0 transition-all duration-200 active:scale-[0.98]"
                    style={{ backgroundColor: CSS.danger, color: "#fff" }}
                  >
                    {t("common.retry", "Retry")}
                  </button>
                </div>
              </Card>
            </CardShell>
          </Reveal>
        )}

        {/* Data Content */}
        {canShowData && (
          <>
            {/* Stats — 3-col bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {statCards.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Table or Empty State */}
            {isEmpty ? (
              <Reveal delay={2}>
                <CardShell className="p-[1px]">
                  <Card bodyClass="p-16 text-center border-0 shadow-none" className="border-0 shadow-none">
                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: CSS.surfaceRaise }}>
                      <Icon icon="heroicons:clipboard-document" className="size-7" style={{ color: CSS.textMuted }} />
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: CSS.textPrimary }}>
                      {t("bookings.empty.title", "No bookings yet")}
                    </h2>
                    <p className="text-sm mt-1 max-w-xs mx-auto leading-relaxed" style={{ color: CSS.textMuted }}>
                      {t("bookings.empty.description", "There are no booking records to display.")}
                    </p>
                  </Card>
                </CardShell>
              </Reveal>
            ) : (
              <Reveal delay={2}>
                <CardShell className="p-[1px]">
                  <Card bodyClass="p-0 border-0 shadow-none overflow-hidden" className="border-0 shadow-none">
                    {/* Table header label */}
                    <div className="px-6 pt-5 pb-3" style={{ borderBottom: `1px solid ${CSS.borderSub}` }}>
                      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: CSS.textMuted }}>
                        {t("bookings.tableLabel", "All booking records")} &middot; {bookings.length}
                      </p>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${CSS.borderSub}` }}>
                            {[
                              "bookings.column.booking",
                              "bookings.column.customer",
                              "bookings.column.tour",
                              "bookings.column.departure",
                              "bookings.column.amount",
                              "bookings.column.status",
                            ].map((colKey) => (
                              <th
                                key={colKey}
                                className="text-left px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest"
                                style={{ color: CSS.textMuted }}
                              >
                                {t(colKey)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking, i) => (
                            <TableRow key={booking.id} booking={booking} index={i} />
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden divide-y divide-stone-50">
                      {bookings.map((booking, i) => (
                        <motion.div
                          key={booking.id}
                          custom={i}
                          variants={rowVariants}
                          initial="hidden"
                          animate="show"
                          className="p-5 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium" style={{ color: CSS.textPrimary }}>
                                {booking.customerName ?? booking.customer ?? "—"}
                              </p>
                              <p className="text-xs mt-0.5 font-mono" style={{ color: CSS.textMuted }}>
                                {String(booking.id).slice(0, 12)}...
                              </p>
                            </div>
                            <StatusBadge status={booking.status ?? "pending"} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs" style={{ color: CSS.textSecondary }}>
                                {booking.tourName ?? booking.tour ?? "—"}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: CSS.textMuted }}>
                                {booking.departureDate ?? booking.departure ?? "—"}
                              </p>
                            </div>
                            <p className="text-base font-bold data-value" style={{ color: CSS.textPrimary }}>
                              ${(booking.amount ?? 0).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </CardShell>
              </Reveal>
            )}
          </>
        )}
      </main>
    </AdminSidebar>
  );
}
