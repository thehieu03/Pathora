"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";

import Card from "@/components/ui/Card";
import Chart from "@/components/ui/Chart";
import { Icon } from "@/components/ui";
import { adminService } from "@/api/services/adminService";
import type {
  AdminDashboard,
  AdminDashboardAlert,
  AdminDashboardCategoryMetric,
  AdminDashboardMetricPoint,
  AdminDashboardVisaStatus,
} from "@/types/admin";
import { AdminSidebar, TopBar } from "./AdminSidebar";

// ─── Design Tokens ───────────────────────────────────────────────
// All colors via CSS variables — no hardcoded values
const CSS = {
  accent:       "var(--accent)",
  accentHover:  "var(--accent-hover)",
  accentMuted:  "var(--accent-muted)",
  border:        "var(--border)",
  borderSub:    "var(--border-subtle)",
  surface:      "var(--surface)",
  surfaceRaise: "var(--surface-raised)",
  textPrimary:  "var(--text-primary)",
  textSecondary:"var(--text-secondary)",
  textMuted:    "var(--text-muted)",
  success:      "var(--success)",
  successMuted: "var(--success-muted)",
  danger:       "var(--danger)",
  dangerMuted:  "var(--danger-muted)",
  warning:      "var(--warning)",
  warningMuted: "var(--warning-muted)",
  info:         "var(--info)",
  infoMuted:    "var(--info-muted)",
  shadowCard:   "var(--shadow-card)",
  shadowCardH:  "var(--shadow-card-hover)",
  shadowCardIn: "var(--shadow-card-inner)",
  liveGreen:    "#22c55e",
} as const;

// Chart color palette — mapped from CSS variables
const PALETTE = [
  CSS.accent,
  CSS.success,
  CSS.danger,
  CSS.info,
  CSS.textMuted,
  CSS.warning,
] as const;

// Spring physics — taste-skill perpetual motion
const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const EASE_BENTO = [0.32, 0.72, 0, 1] as [number, number, number, number];

const QUICK_ACTIONS = [
  { labelKey: "adminDashboard.quickActionCreateTour",    icon: "heroicons:plus",          href: "/tour-management/create" },
  { labelKey: "adminDashboard.quickActionScheduleTour", icon: "heroicons:calendar",       href: "/tour-instances/create" },
  { labelKey: "adminDashboard.quickActionViewBookings", icon: "heroicons:eye",            href: "/dashboard/bookings" },
  { labelKey: "adminDashboard.quickActionEditSiteContent", icon: "heroicons:document-text", href: "/dashboard/site-content" },
  { labelKey: "adminDashboard.quickActionManageVisa",  icon: "heroicons:shield-check",   href: "/dashboard/visa" },
];

type SeverityStyle = {
  icon: string; textColor: string; bgColor: string; borderColor: string;
};

const SEVERITY_STYLES: Record<string, SeverityStyle> = {
  info:    { icon: "heroicons:information-circle",  textColor: CSS.info,    bgColor: CSS.infoMuted,    borderColor: "var(--info-border)" },
  warning: { icon: "heroicons:exclamation-triangle", textColor: CSS.warning, bgColor: CSS.warningMuted, borderColor: "var(--warning-border)" },
  danger:  { icon: "heroicons:exclamation-circle",  textColor: CSS.danger, bgColor: CSS.dangerMuted, borderColor: "var(--danger-border)" },
  success: { icon: "heroicons:check-circle",          textColor: CSS.success, bgColor: CSS.successMuted, borderColor: "var(--success-border)" },
};

function normalizeCategoryData(items: AdminDashboardCategoryMetric[]): AdminDashboardCategoryMetric[] {
  return items.length > 0 ? items : [{ label: "adminDashboard.noDataChart", value: 0 }];
}
function normalizePointData(items: AdminDashboardMetricPoint[]): AdminDashboardMetricPoint[] {
  return items.length > 0 ? items : [{ label: "adminDashboard.noDataChart", value: 0 }];
}
function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

// ═══════════════════════════════════════════════════════════════════
// TASTE-SKILL: Perpetual Motion Components (isolated, memoized)
// ═══════════════════════════════════════════════════════════════════

// 1. Breathing status dot — infinite pulse on live indicators
const BreathingDot = React.memo(function BreathingDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex shrink-0">
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: color }} />
    </span>
  );
});

// 2. Shimmer skeleton — replaces generic spinner
const ShimmerSkeleton = React.memo(function ShimmerSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ height }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          background: `linear-gradient(90deg, ${CSS.surfaceRaise} 25%, ${CSS.surface} 50%, ${CSS.surfaceRaise} 75%)`,
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
});

// 3. Float animation — gentle continuous float on key icons
const FloatIcon = React.memo(function FloatIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
});

// 4. Spring table row — spring physics on hover
const SpringTableRow = React.memo(function SpringTableRow({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.tr
      className="border-t cursor-default"
      style={{ borderColor: CSS.borderSub }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay: delay * 0.04 }}
      whileHover={{ x: 3 }}
    >
      {children}
    </motion.tr>
  );
});

// 5. Card float-on-hover — subtle lift with spring physics
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
      whileHover={{ y: -3, boxShadow: CSS.shadowCardH }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
});

// ═══════════════════════════════════════════════════════════════════
// SOFT-SKILL: Double-Bezel Shell
// ═══════════════════════════════════════════════════════════════════

// Bento 2.0 — very large radius per taste-skill + diffusion shadow
function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[1.5rem] ${className}`}
      style={{
        background: `linear-gradient(145deg, rgba(0,0,0,0.025) 0%, rgba(0,0,0,0.008) 100%)`,
        boxShadow: "0 20px 50px -12px rgba(0,0,0,0.055), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      {/* Outer hairline ring */}
      <div
        className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
        style={{ border: "1px solid rgba(0,0,0,0.04)" }}
      />
      {/* Inner core */}
      <div
        className="relative rounded-[1.25rem] h-full overflow-hidden"
        style={{ backgroundColor: CSS.surface, boxShadow: CSS.shadowCardIn }}
      >
        {children}
      </div>
    </div>
  );
}

// Eyebrow tag — pill micro-badge above section headers
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

// Scroll-driven reveal — blur-fade with stagger
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

// ═══════════════════════════════════════════════════════════════════
// CHART FACTORIES
// ═══════════════════════════════════════════════════════════════════

function createLineOptions(categories: string[], yFormatter: (v: number) => string): ApexOptions {
  return {
    chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit", background: "transparent" },
    stroke: { curve: "smooth", width: 2.5 },
    colors: [CSS.accent],
    xaxis: { categories, labels: { style: { colors: CSS.textMuted, fontSize: "12px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: yFormatter, style: { colors: CSS.textMuted, fontSize: "12px" } } },
    grid: { borderColor: CSS.borderSub, strokeDashArray: 5 },
    markers: { size: 4, colors: [CSS.accent], strokeWidth: 2, strokeColors: CSS.surface },
    tooltip: { y: { formatter: yFormatter } },
    theme: { mode: "light" },
  };
}
function createAreaOptions(categories: string[]): ApexOptions {
  return {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit", background: "transparent" },
    stroke: { curve: "smooth", width: 2 },
    colors: [CSS.accent],
    fill: { type: "gradient", gradient: { opacityFrom: 0.1, opacityTo: 0.008, stops: [0, 100] } },
    xaxis: { categories, labels: { style: { colors: CSS.textMuted, fontSize: "12px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: CSS.textMuted, fontSize: "12px" } } },
    grid: { borderColor: CSS.borderSub, strokeDashArray: 5 },
    tooltip: { shared: true }, legend: { show: false },
    theme: { mode: "light" },
  };
}
function createBarOptions(categories: string[], color: string): ApexOptions {
  return {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit", background: "transparent" },
    colors: [color],
    plotOptions: { bar: { borderRadius: 8, columnWidth: "50%" } },
    xaxis: { categories, labels: { style: { colors: CSS.textMuted, fontSize: "12px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: CSS.textMuted, fontSize: "12px" } } },
    grid: { borderColor: CSS.borderSub, strokeDashArray: 5 },
    dataLabels: { enabled: false },
    theme: { mode: "light" },
  };
}
function createDonutOptions(labels: string[], colors: string[]): ApexOptions {
  return {
    chart: { type: "donut", fontFamily: "inherit", background: "transparent" },
    colors, labels, legend: { show: false }, dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "68%" } } },
    stroke: { width: 2, colors: [CSS.surface] },
    theme: { mode: "light" },
  };
}

// ═══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function MetricLegend({ items, colors }: { items: AdminDashboardCategoryMetric[]; colors: readonly string[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
            <span style={{ color: CSS.textSecondary }}>{item.label}</span>
          </div>
          <span className="font-medium data-value" style={{ color: CSS.textPrimary }}>
            {Math.round(item.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function VisaStatusBadge({ status }: { status: AdminDashboardVisaStatus }) {
  const n = status.label.toLowerCase();
  const isA = n === "approved", isR = n === "rejected", isV = n === "under review";
  const bg = isA ? CSS.successMuted : isR ? CSS.dangerMuted : isV ? CSS.infoMuted : CSS.warningMuted;
  const text = isA ? CSS.success : isR ? CSS.danger : isV ? CSS.info : CSS.warning;
  const border = isA ? "var(--success-border)" : isR ? "var(--danger-border)" : isV ? "var(--info-border)" : "var(--warning-border)";

  return (
    <div className="rounded-2xl p-4 text-center border" style={{ backgroundColor: bg, borderColor: border }}>
      <p className="text-2xl font-bold tracking-tight data-value" style={{ color: CSS.textPrimary }}>
        {status.count.toLocaleString()}
      </p>
      <span className="inline-block mt-2 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: text, backgroundColor: "rgba(255,255,255,0.55)" }}>
        {status.label}
      </span>
    </div>
  );
}

function AlertItem({ alert }: { alert: AdminDashboardAlert }) {
  const s = SEVERITY_STYLES[alert.severity.toLowerCase()] ?? SEVERITY_STYLES.info;
  return (
    <motion.div
      className="flex items-center gap-3 p-3.5 rounded-2xl border"
      style={{ backgroundColor: s.bgColor, borderColor: s.borderColor }}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={SPRING}
    >
      <Icon icon={s.icon} className="size-4 shrink-0" style={{ color: s.textColor }} />
      <p className="text-sm" style={{ color: s.textColor }}>{alert.text}</p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BENTO 2.0: Stat Card (gallery-style, label outside)
// ═══════════════════════════════════════════════════════════════════

interface StatCardProps {
  labelKey: string; value: string; icon: string; accent: string;
  eyebrow?: string; subtext?: string; delay?: number;
}

function StatCard({ labelKey, value, icon, accent, eyebrow, subtext, delay = 0 }: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <SpringCard className="h-full">
        <CardShell className="p-[1px] h-full">
          <Card bodyClass="p-7 h-full border-0 shadow-none" className="border-0 shadow-none">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0">
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                {/* Bento 2.0: label BELOW the card — gallery style */}
                <p className="text-sm font-medium" style={{ color: CSS.textMuted }}>{labelKey}</p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ml-3"
                style={{ backgroundColor: `${accent}12` }}
                whileHover={{ scale: 1.08 }}
                transition={SPRING}
              >
                <Icon icon={icon} className="size-5" style={{ color: accent }} />
              </motion.div>
            </div>
            <p className="text-[2rem] font-bold tracking-tight data-value leading-none" style={{ color: CSS.textPrimary, letterSpacing: "-0.03em" }}>
              {value}
            </p>
            {subtext && <p className="text-xs mt-3" style={{ color: CSS.textMuted }}>{subtext}</p>}
          </Card>
        </CardShell>
      </SpringCard>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHART CARD (gallery-style label)
// ═══════════════════════════════════════════════════════════════════

interface ChartCardProps {
  title: string; eyebrow?: string; period?: string;
  children: React.ReactNode; delay?: number; className?: string;
}

function ChartCard({ title, eyebrow, period, children, delay = 0, className = "" }: ChartCardProps) {
  return (
    <Reveal delay={delay}>
      <SpringCard className={className}>
        <CardShell className={`p-[1px] ${className}`}>
          <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 min-w-0">
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                {/* Bento 2.0: title BELOW the eyebrow, above chart */}
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: CSS.textPrimary }}>{title}</h3>
              </div>
              {period && (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ml-3" style={{ color: CSS.textMuted, backgroundColor: CSS.surfaceRaise }}>
                  {period}
                </span>
              )}
            </div>
            {children}
          </Card>
        </CardShell>
      </SpringCard>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUICK ACTION (spring physics + magnetic hover)
// ═══════════════════════════════════════════════════════════════════

function QuickActionLink({ icon, labelKey, href }: { icon: string; labelKey: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 py-3.5 px-4 rounded-2xl border transition-all duration-700"
      style={{
        borderColor: CSS.border,
        color: CSS.textSecondary,
        backgroundColor: CSS.surface,
        transform: "translateX(0)",
        transitionProperty: "border-color, background-color, transform, box-shadow",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${CSS.accent}35`;
        el.style.backgroundColor = `${CSS.accent}05`;
        el.style.transform = "translateX(3px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = CSS.border;
        el.style.backgroundColor = CSS.surface;
        el.style.transform = "translateX(0)";
      }}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundColor: CSS.surfaceRaise }}
      >
        <Icon icon={icon} className="size-4" style={{ color: CSS.textMuted }} />
      </span>
      <span className="text-xs font-medium leading-tight">{labelKey}</span>
      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: CSS.textMuted }}>
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await adminService.getDashboard();
      setDashboard(result);
    } catch {
      setDashboard(null);
      setErrorMessage("error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const revenueOverTime         = normalizePointData(dashboard?.revenueOverTime ?? []);
  const revenueByTourType       = normalizeCategoryData(dashboard?.revenueByTourType ?? []);
  const revenueByRegion         = normalizeCategoryData(dashboard?.revenueByRegion ?? []);
  const bookingStatusDist       = normalizeCategoryData(dashboard?.bookingStatusDistribution ?? []);
  const bookingTrend            = normalizePointData(dashboard?.bookingTrend ?? []);
  const topDestinations         = normalizeCategoryData(dashboard?.topDestinations ?? []);
  const customerGrowth          = normalizePointData(dashboard?.customerGrowth ?? []);
  const customerNationalities   = normalizeCategoryData(dashboard?.customerNationalities ?? []);

  // Memoized chart options
  const revenueOverTimeOptions    = useMemo(() => createLineOptions(revenueOverTime.map(i => i.label), formatMoney), [revenueOverTime]);
  const revenueOverTimeSeries    = useMemo(() => [{ name: "Revenue", data: revenueOverTime.map(i => Number(i.value)) }], [revenueOverTime]);
  const revenueByTourTypeOptions  = useMemo(() => createDonutOptions(revenueByTourType.map(i => i.label), [...PALETTE]), [revenueByTourType]);
  const revenueByTourTypeSeries  = useMemo(() => revenueByTourType.map(i => Number(i.value)), [revenueByTourType]);
  const revenueByRegionOptions    = useMemo(() => createDonutOptions(revenueByRegion.map(i => i.label), [...PALETTE]), [revenueByRegion]);
  const revenueByRegionSeries    = useMemo(() => revenueByRegion.map(i => Number(i.value)), [revenueByRegion]);
  const bookingStatusOptions     = useMemo(() => createDonutOptions(bookingStatusDist.map(i => i.label), [...PALETTE]), [bookingStatusDist]);
  const bookingStatusSeries      = useMemo(() => bookingStatusDist.map(i => Number(i.value)), [bookingStatusDist]);
  const bookingTrendOptions      = useMemo(() => createAreaOptions(bookingTrend.map(i => i.label)), [bookingTrend]);
  const bookingTrendSeries       = useMemo(() => [{ name: "Bookings", data: bookingTrend.map(i => Number(i.value)) }], [bookingTrend]);
  const topDestinationsOptions   = useMemo(() => createBarOptions(topDestinations.map(i => i.label), CSS.accent), [topDestinations]);
  const topDestinationsSeries    = useMemo(() => [{ name: "Bookings", data: topDestinations.map(i => Number(i.value)) }], [topDestinations]);
  const customerGrowthOptions    = useMemo(() => createBarOptions(customerGrowth.map(i => i.label), CSS.success), [customerGrowth]);
  const customerGrowthSeries     = useMemo(() => [{ name: "New Customers", data: customerGrowth.map(i => Number(i.value)) }], [customerGrowth]);

  const statCards = useMemo(() => [
    { labelKey: "adminDashboard.statTotalRevenue",      value: formatMoney(dashboard?.stats.totalRevenue ?? 0),      icon: "heroicons:currency-dollar",      accent: CSS.accent, eyebrow: "Overview",     subtext: t("adminDashboard.statRevenueSubtext"), delay: 0 },
    { labelKey: "adminDashboard.statTotalBookings",      value: (dashboard?.stats.totalBookings ?? 0).toLocaleString(), icon: "heroicons:clipboard-document", accent: CSS.success, eyebrow: "Bookings",     delay: 1 },
    { labelKey: "adminDashboard.statActiveTours",       value: (dashboard?.stats.activeTours ?? 0).toLocaleString(),  icon: "heroicons:globe-alt",          accent: CSS.info,    eyebrow: "Tours",        delay: 2 },
    { labelKey: "adminDashboard.statTotalCustomers",     value: (dashboard?.stats.totalCustomers ?? 0).toLocaleString(), icon: "heroicons:user-group",          accent: CSS.textMuted, eyebrow: "Customers",    delay: 3 },
    { labelKey: "adminDashboard.statCancellationRate",   value: `${(dashboard?.stats.cancellationRate ?? 0).toFixed(1)}%`, icon: "heroicons:x-circle",         accent: CSS.danger, eyebrow: "Cancellation", delay: 4 },
    { labelKey: "adminDashboard.statVisaApproval",       value: `${(dashboard?.stats.visaApprovalRate ?? 0).toFixed(1)}%`, icon: "heroicons:shield-check",    accent: CSS.accent, eyebrow: "Visa",         delay: 5 },
  ], [dashboard, t]);

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <main id="main-content" className="p-6 lg:py-8 lg:pr-8 lg:pl-6">

        {/* ── Page Header ─────────────────────────────────────── */}
        <Reveal delay={0}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <Eyebrow>Analytics Dashboard</Eyebrow>
              <h1 style={{ color: CSS.textPrimary, fontSize: "2.125rem", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
                {t("adminDashboard.pageTitle")}
              </h1>
              <p className="text-sm mt-2.5" style={{ color: CSS.textMuted }}>
                {t("adminDashboard.pageSubtitle")}
              </p>
            </div>
            <motion.button
              onClick={() => void loadDashboard()}
              disabled={isLoading}
              className="self-start sm:self-auto flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-700 active:scale-[0.97]"
              style={{ borderColor: CSS.border, color: CSS.textSecondary, backgroundColor: CSS.surface }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
            >
              <Icon icon="heroicons:arrow-path" className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{t("adminDashboard.refresh")}</span>
            </motion.button>
          </div>
        </Reveal>

        {/* ── Loading State (shimmer skeleton) ──────────────── */}
        {isLoading && (
          <Reveal>
            <CardShell className="p-[1px]">
              <Card bodyClass="p-12 border-0 shadow-none flex items-center justify-center" className="border-0 shadow-none">
                <ShimmerSkeleton height={320} />
              </Card>
            </CardShell>
          </Reveal>
        )}

        {/* ── Error State ─────────────────────────────────────── */}
        {!isLoading && errorMessage && (
          <Reveal>
            <CardShell className="p-[1px]">
              <Card bodyClass="p-12 border-0 shadow-none" className="border-0 shadow-none">
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: CSS.dangerMuted }}>
                    <Icon icon="heroicons:exclamation-triangle" className="size-6" style={{ color: CSS.danger }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: CSS.textPrimary }}>{t("adminDashboard.noData")}</p>
                    <p className="text-xs mt-1" style={{ color: CSS.textMuted }}>Connection failed. Please try again.</p>
                  </div>
                  <motion.button
                    onClick={() => void loadDashboard()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium"
                    style={{ backgroundColor: CSS.textPrimary, color: CSS.surface }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={SPRING}
                  >
                    <Icon icon="heroicons:arrow-path" className="size-4" />
                    {t("adminDashboard.refresh")}
                  </motion.button>
                </div>
              </Card>
            </CardShell>
          </Reveal>
        )}

        {/* ── Empty State ─────────────────────────────────────── */}
        {!isLoading && !errorMessage && !dashboard && (
          <Reveal>
            <CardShell className="p-[1px]">
              <Card bodyClass="p-12 flex items-center justify-center border-0 shadow-none" className="border-0 shadow-none">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: CSS.surfaceRaise }}>
                    <Icon icon="heroicons:chart-bar" className="size-6" style={{ color: CSS.textMuted }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: CSS.textPrimary }}>{t("adminDashboard.noData")}</p>
                </div>
              </Card>
            </CardShell>
          </Reveal>
        )}

        {/* ── Dashboard Content ─────────────────────────────── */}
        {!isLoading && !errorMessage && dashboard && (
          <>
            {/* ── Stat Cards: 3-col bento ─────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {statCards.map((stat) => (
                <StatCard key={stat.labelKey} {...stat} />
              ))}
            </div>

            {/* ── Revenue + Tour Type: 7/5 ─────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
              <ChartCard title={t("adminDashboard.chartRevenueOverTime")} period={t("adminDashboard.chartPeriodMonthly")} delay={0} className="lg:col-span-7">
                <Chart options={revenueOverTimeOptions} series={revenueOverTimeSeries} type="line" height={260} />
              </ChartCard>
              <ChartCard title={t("adminDashboard.chartByTourType")} delay={1} className="lg:col-span-5">
                <div className="flex justify-center mt-2">
                  <Chart options={revenueByTourTypeOptions} series={revenueByTourTypeSeries} type="donut" height={180} width={180} />
                </div>
                <div className="mt-6">
                  <MetricLegend items={revenueByTourType} colors={PALETTE} />
                </div>
              </ChartCard>
            </div>

            {/* ── Region + Booking Status: 3/2 ───────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10">
              <ChartCard title={t("adminDashboard.chartByRegion")} delay={2} className="lg:col-span-3">
                <div className="flex items-center gap-8 mt-4">
                  <div className="shrink-0">
                    <Chart options={revenueByRegionOptions} series={revenueByRegionSeries} type="donut" height={180} width={180} />
                  </div>
                  <MetricLegend items={revenueByRegion} colors={PALETTE} />
                </div>
              </ChartCard>
              <ChartCard title={t("adminDashboard.chartBookingStatus")} delay={3} className="lg:col-span-2">
                <div className="flex items-center gap-5 mt-4">
                  <div className="shrink-0">
                    <Chart options={bookingStatusOptions} series={bookingStatusSeries} type="donut" height={160} width={160} />
                  </div>
                  <MetricLegend items={bookingStatusDist} colors={PALETTE} />
                </div>
              </ChartCard>
            </div>

            {/* ── Booking Trend + Top Tours: 7/5 ─────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
              <ChartCard title={t("adminDashboard.chartBookingTrend")} period={t("adminDashboard.chartPeriodMonthly")} delay={4} className="lg:col-span-7">
                <Chart options={bookingTrendOptions} series={bookingTrendSeries} type="area" height={220} />
              </ChartCard>
              <ChartCard title={t("adminDashboard.chartTopSellingTours")} delay={5} className="lg:col-span-5">
                <div className="mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2.5 font-semibold text-[9px] uppercase tracking-widest" style={{ color: CSS.textMuted }}>{t("adminDashboard.tableTour")}</th>
                        <th className="text-right py-2.5 font-semibold text-[9px] uppercase tracking-widest" style={{ color: CSS.textMuted }}>{t("adminDashboard.tableBookings")}</th>
                        <th className="text-right py-2.5 font-semibold text-[9px] uppercase tracking-widest" style={{ color: CSS.textMuted }}>{t("adminDashboard.tableRevenue")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.topTours.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-10 text-center text-sm" style={{ color: CSS.textMuted }}>
                            {t("adminDashboard.noTopTourData")}
                          </td>
                        </tr>
                      ) : (
                        dashboard.topTours.map((tour, index) => (
                          <SpringTableRow key={`${tour.name}-${index}`} delay={index}>
                            <td className="py-3.5 text-sm" style={{ color: CSS.textSecondary }}>{tour.name}</td>
                            <td className="py-3.5 text-right text-sm data-value" style={{ color: CSS.textMuted }}>{tour.bookings.toLocaleString()}</td>
                            <td className="py-3.5 text-right text-sm font-semibold data-value" style={{ color: CSS.success }}>{formatMoney(tour.revenue)}</td>
                          </SpringTableRow>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </div>

            {/* ── Destinations + Customer Growth: 2/3 ───────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10">
              <ChartCard title={t("adminDashboard.chartTopDestinations")} delay={6} className="lg:col-span-2">
                <Chart options={topDestinationsOptions} series={topDestinationsSeries} type="bar" height={200} />
              </ChartCard>
              <ChartCard title={t("adminDashboard.chartCustomerGrowth")} period={t("adminDashboard.chartPeriodMonthly")} delay={7} className="lg:col-span-3">
                <Chart options={customerGrowthOptions} series={customerGrowthSeries} type="bar" height={200} />
              </ChartCard>
            </div>

            {/* ── Visa Processing + Side Panel: 7/5 ────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
              {/* Visa Processing */}
              <Reveal delay={8} className="lg:col-span-7">
                <SpringCard className="lg:col-span-7">
                  <CardShell className="p-[1px]">
                    <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
                      <Eyebrow>Visa Processing</Eyebrow>
                      <h3 className="text-sm font-semibold tracking-tight mb-1" style={{ color: CSS.textPrimary }}>
                        {t("adminDashboard.chartVisaProcessing")}
                      </h3>
                      {/* Status row with live breathing dot */}
                      <div className="flex items-center gap-2 mt-1 mb-6">
                        <BreathingDot color={CSS.accent} />
                        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Live</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {dashboard.visaStatuses.map((status, index) => (
                          <VisaStatusBadge key={`${status.label}-${index}`} status={status} />
                        ))}
                      </div>
                      <h4 className="text-[9px] font-semibold uppercase tracking-widest mt-8 mb-4" style={{ color: CSS.textMuted }}>
                        {t("adminDashboard.upcomingDeadlines")}
                      </h4>
                      <div className="space-y-1">
                        {dashboard.upcomingVisaDeadlines.length === 0 ? (
                          <div className="py-5 px-4 rounded-2xl text-xs text-center border" style={{ color: CSS.textMuted, borderColor: CSS.border, backgroundColor: CSS.surfaceRaise }}>
                            {t("adminDashboard.noUpcomingDeadlines")}
                          </div>
                        ) : (
                          dashboard.upcomingVisaDeadlines.map((deadline) => (
                            <motion.div
                              key={`${deadline.tour}-${deadline.date}`}
                              className="flex items-center justify-between py-3.5 px-4 rounded-2xl transition-colors duration-150 cursor-default"
                              style={{ backgroundColor: CSS.surfaceRaise }}
                              whileHover={{ x: 2 }}
                              transition={SPRING}
                            >
                              <span className="text-sm truncate mr-4" style={{ color: CSS.textSecondary }}>{deadline.tour}</span>
                              <span className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0" style={{ color: CSS.warning, backgroundColor: CSS.warningMuted }}>
                                {deadline.date}
                              </span>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </Card>
                  </CardShell>
                </SpringCard>
              </Reveal>

              {/* Side Panel */}
              <div className="lg:col-span-5 space-y-5">
                {/* visa Summary */}
                <Reveal delay={9}>
                  <SpringCard>
                    <CardShell className="p-[1px]">
                      <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
                        <div className="flex items-center gap-4 mb-5">
                          <motion.div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${CSS.accent}12` }}
                            whileHover={{ scale: 1.06 }}
                            transition={SPRING}
                          >
                            <FloatIcon>
                              <Icon icon="heroicons:shield-check" className="size-6" style={{ color: CSS.accent }} />
                            </FloatIcon>
                          </motion.div>
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                              {t("adminDashboard.visaSuccessRate")}
                            </p>
                            <p className="text-[2rem] font-bold tracking-tight data-value leading-none" style={{ color: CSS.textPrimary, letterSpacing: "-0.03em" }}>
                              {dashboard.visaSummary.approvalRate.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="space-y-0">
                          {[
                            { label: t("adminDashboard.visaTotal"),    value: dashboard.visaSummary.totalApplications.toLocaleString(), color: CSS.textSecondary },
                            { label: t("adminDashboard.visaApproved"), value: dashboard.visaSummary.approved.toLocaleString(),          color: CSS.success },
                            { label: t("adminDashboard.visaRejected"), value: dashboard.visaSummary.rejected.toLocaleString(),            color: CSS.danger },
                          ].map((row) => (
                            <motion.div
                              key={row.label}
                              className="flex items-center justify-between py-3 border-t"
                              style={{ borderColor: CSS.borderSub }}
                              whileHover={{ x: 2 }}
                              transition={SPRING}
                            >
                              <span className="text-sm" style={{ color: CSS.textMuted }}>{row.label}</span>
                              <span className="font-semibold data-value" style={{ color: row.color }}>{row.value}</span>
                            </motion.div>
                          ))}
                        </div>
                      </Card>
                    </CardShell>
                  </SpringCard>
                </Reveal>

                {/* Customer Nationalities */}
                <Reveal delay={10}>
                  <SpringCard>
                    <CardShell className="p-[1px]">
                      <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
                        <h3 className="text-[9px] font-semibold uppercase tracking-widest mb-5" style={{ color: CSS.textMuted }}>
                          {t("adminDashboard.customerNationality")}
                        </h3>
                        <MetricLegend items={customerNationalities} colors={PALETTE} />
                      </Card>
                    </CardShell>
                  </SpringCard>
                </Reveal>

                {/* Quick Actions */}
                <Reveal delay={11}>
                  <SpringCard>
                    <CardShell className="p-[1px]">
                      <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
                        <h3 className="text-[9px] font-semibold uppercase tracking-widest mb-4" style={{ color: CSS.textMuted }}>
                          {t("adminDashboard.quickActions")}
                        </h3>
                        <div className="space-y-1.5">
                          {QUICK_ACTIONS.map((action) => (
                            <QuickActionLink key={action.labelKey} icon={action.icon} labelKey={t(action.labelKey)} href={action.href} />
                          ))}
                        </div>
                      </Card>
                    </CardShell>
                  </SpringCard>
                </Reveal>
              </div>
            </div>

            {/* ── Operational Alerts ────────────────────────────── */}
            <Reveal delay={12}>
              <SpringCard>
                <CardShell className="p-[1px]">
                  <Card bodyClass="p-7 border-0 shadow-none" className="border-0 shadow-none">
                    <div className="flex items-center gap-3 mb-1">
                      <Eyebrow>Live Feed</Eyebrow>
                      <span className="flex items-center gap-1.5 mb-3">
                        <BreathingDot color={CSS.liveGreen} />
                        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: CSS.liveGreen }}>Active</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ color: CSS.textPrimary }}>
                      {t("adminDashboard.operationalAlerts")}
                    </h3>
                    <div className="space-y-2">
                      {dashboard.alerts.length === 0 ? (
                        <div className="py-5 text-center text-sm" style={{ color: CSS.textMuted }}>
                          {t("adminDashboard.noAlerts")}
                        </div>
                      ) : (
                        dashboard.alerts.map((alert, index) => (
                          <AlertItem key={`${alert.text}-${index}`} alert={alert} />
                        ))
                      )}
                    </div>
                  </Card>
                </CardShell>
              </SpringCard>
            </Reveal>
          </>
        )}
      </main>
    </AdminSidebar>
  );
}

export default AdminDashboardPage;
