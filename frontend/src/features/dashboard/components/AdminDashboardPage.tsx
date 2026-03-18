"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { AdminLogoutButton } from "./AdminLogoutButton";

// Design tokens from globals.css --primary, --success, --warning, --info, --destructive
const COLORS = {
  primary: "#2563eb",
  secondary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#0ea5e9",
  purple: "#8b5cf6",
  slate: "#64748b",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.slate,
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: "heroicons:squares-2x2", href: "/dashboard" },
  { label: "Tours", icon: "heroicons:globe-alt", href: "/tour-management" },
  { label: "Tour Instances", icon: "heroicons:calendar-days", href: "/tour-instances" },
  {
    label: "Tour Requests",
    icon: "heroicons:clipboard-document-list",
    href: "/dashboard/tour-requests",
  },
  {
    label: "Bookings",
    icon: "heroicons:ticket",
    href: "/dashboard/bookings",
  },
  { label: "Payments", icon: "heroicons:credit-card", href: "/dashboard/payments" },
  { label: "Customers", icon: "heroicons:user-group", href: "/dashboard/customers" },
  { label: "Insurance", icon: "heroicons:shield-check", href: "/dashboard/insurance" },
  { label: "Visa Applications", icon: "heroicons:document-check", href: "/dashboard/visa" },
  { label: "Policies", icon: "heroicons:clipboard-document-list", href: "/dashboard/policies" },
  { label: "Site Content", icon: "heroicons:document-text", href: "/dashboard/site-content" },
  { label: "Settings", icon: "heroicons:cog-6-tooth", href: "/dashboard/settings" },
];

const QUICK_ACTIONS = [
  { label: "Create Tour", icon: "heroicons:plus", href: "/tour-management/create" },
  { label: "Schedule Tour", icon: "heroicons:calendar", href: "/tour-instances/create" },
  {
    label: "View Bookings",
    icon: "heroicons:eye",
    href: "/dashboard/bookings",
  },
  { label: "Edit Site Content", icon: "heroicons:document-text", href: "/dashboard/site-content" },
  { label: "Manage Visa", icon: "heroicons:shield-check", href: "/dashboard/visa" },
];

type SeverityStyle = {
  icon: string;
  textClass: string;
  bgClass: string;
};

const SEVERITY_STYLES: Record<string, SeverityStyle> = {
  info: {
    icon: "heroicons:information-circle",
    textClass: "text-blue-700",
    bgClass: "bg-blue-50 border-blue-200",
  },
  warning: {
    icon: "heroicons:exclamation-triangle",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50 border-amber-200",
  },
  danger: {
    icon: "heroicons:exclamation-circle",
    textClass: "text-red-700",
    bgClass: "bg-red-50 border-red-200",
  },
  success: {
    icon: "heroicons:check-circle",
    textClass: "text-green-700",
    bgClass: "bg-green-50 border-green-200",
  },
};

function normalizeCategoryData(items: AdminDashboardCategoryMetric[]): AdminDashboardCategoryMetric[] {
  if (items.length > 0) {
    return items;
  }

  return [{ label: "No Data", value: 0 }];
}

function normalizePointData(items: AdminDashboardMetricPoint[]): AdminDashboardMetricPoint[] {
  if (items.length > 0) {
    return items;
  }

  return [{ label: "No Data", value: 0 }];
}

function createLineOptions(categories: string[], yFormatter: (value: number) => string): ApexOptions {
  return {
    chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit" },
    stroke: { curve: "smooth", width: 3 },
    colors: [COLORS.primary],
    xaxis: {
      categories,
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: yFormatter,
        style: { colors: "#94a3b8", fontSize: "12px" },
      },
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    markers: {
      size: 4,
      colors: [COLORS.primary],
      strokeWidth: 2,
      strokeColors: "#fff",
    },
    tooltip: { y: { formatter: yFormatter } },
  };
}

function createAreaOptions(categories: string[]): ApexOptions {
  return {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit" },
    stroke: { curve: "smooth", width: 2 },
    colors: [COLORS.secondary],
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    tooltip: { shared: true },
    legend: { show: false },
  };
}

function createBarOptions(categories: string[], color: string): ApexOptions {
  return {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    colors: [color],
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "60%" },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    dataLabels: { enabled: false },
  };
}

function createDonutOptions(labels: string[], colors: string[]): ApexOptions {
  return {
    chart: { type: "donut", fontFamily: "inherit" },
    colors,
    labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "65%" } } },
    stroke: { width: 2, colors: ["#fff"] },
  };
}

function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

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
          aria-label="Close sidebar"
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
              item.label === "Dashboard"
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

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button onClick={onMenuClick} aria-label="Open menu" className="lg:hidden text-slate-500">
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      <div className="relative flex-1 max-w-xl">
        <Icon
          icon="heroicons:magnifying-glass"
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
        />
        <label htmlFor="dashboard-search" className="sr-only">
          {t("common.search", "Search")}
        </label>
        <input
          id="dashboard-search"
          type="text"
          placeholder={t("placeholder.searchAnything", "Search anything...")}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>
    </header>
  );
}

function MetricLegend({ items }: { items: AdminDashboardCategoryMetric[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-slate-600">{item.label}</span>
          </div>
          <span className="font-medium text-slate-700">{Math.round(item.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function VisaStatusBadge({ status }: { status: AdminDashboardVisaStatus }) {
  const normalized = status.label.toLowerCase();
  const style =
    normalized === "approved"
      ? "bg-green-100 text-green-700"
      : normalized === "rejected"
        ? "bg-red-100 text-red-700"
        : normalized === "under review"
          ? "bg-blue-100 text-blue-700"
          : "bg-amber-100 text-amber-700";

  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-slate-900">{status.count.toLocaleString()}</p>
      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${style}`}>
        {status.label}
      </span>
    </div>
  );
}

function AlertItem({ alert }: { alert: AdminDashboardAlert }) {
  const style = SEVERITY_STYLES[alert.severity.toLowerCase()] ?? SEVERITY_STYLES.info;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${style.bgClass}`}>
      <Icon icon={style.icon} className={`size-5 shrink-0 ${style.textClass}`} />
      <p className={`text-sm ${style.textClass}`}>{alert.text}</p>
    </div>
  );
}

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
      setErrorMessage("Unable to load dashboard data from backend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const revenueOverTime = normalizePointData(dashboard?.revenueOverTime ?? []);
  const revenueByTourType = normalizeCategoryData(dashboard?.revenueByTourType ?? []);
  const revenueByRegion = normalizeCategoryData(dashboard?.revenueByRegion ?? []);
  const bookingStatusDistribution = normalizeCategoryData(dashboard?.bookingStatusDistribution ?? []);
  const bookingTrend = normalizePointData(dashboard?.bookingTrend ?? []);
  const topDestinations = normalizeCategoryData(dashboard?.topDestinations ?? []);
  const customerGrowth = normalizePointData(dashboard?.customerGrowth ?? []);
  const customerNationalities = normalizeCategoryData(dashboard?.customerNationalities ?? []);

  const revenueOverTimeOptions = useMemo(
    () => createLineOptions(revenueOverTime.map((item) => item.label), (value) => formatMoney(value)),
    [revenueOverTime],
  );

  const revenueOverTimeSeries = useMemo(
    () => [{ name: "Revenue", data: revenueOverTime.map((item) => Number(item.value)) }],
    [revenueOverTime],
  );

  const revenueByTourTypeOptions = useMemo(
    () =>
      createDonutOptions(
        revenueByTourType.map((item) => item.label),
        CHART_COLORS,
      ),
    [revenueByTourType],
  );

  const revenueByTourTypeSeries = useMemo(
    () => revenueByTourType.map((item) => Number(item.value)),
    [revenueByTourType],
  );

  const revenueByRegionOptions = useMemo(
    () =>
      createDonutOptions(
        revenueByRegion.map((item) => item.label),
        CHART_COLORS,
      ),
    [revenueByRegion],
  );

  const revenueByRegionSeries = useMemo(
    () => revenueByRegion.map((item) => Number(item.value)),
    [revenueByRegion],
  );

  const bookingStatusOptions = useMemo(
    () =>
      createDonutOptions(
        bookingStatusDistribution.map((item) => item.label),
        CHART_COLORS,
      ),
    [bookingStatusDistribution],
  );

  const bookingStatusSeries = useMemo(
    () => bookingStatusDistribution.map((item) => Number(item.value)),
    [bookingStatusDistribution],
  );

  const bookingTrendOptions = useMemo(
    () => createAreaOptions(bookingTrend.map((item) => item.label)),
    [bookingTrend],
  );

  const bookingTrendSeries = useMemo(
    () => [{ name: "Bookings", data: bookingTrend.map((item) => Number(item.value)) }],
    [bookingTrend],
  );

  const topDestinationsOptions = useMemo(
    () => createBarOptions(topDestinations.map((item) => item.label), COLORS.primary),
    [topDestinations],
  );

  const topDestinationsSeries = useMemo(
    () => [{ name: "Bookings", data: topDestinations.map((item) => Number(item.value)) }],
    [topDestinations],
  );

  const customerGrowthOptions = useMemo(
    () => createBarOptions(customerGrowth.map((item) => item.label), COLORS.secondary),
    [customerGrowth],
  );

  const customerGrowthSeries = useMemo(
    () => [{ name: "New Customers", data: customerGrowth.map((item) => Number(item.value)) }],
    [customerGrowth],
  );

  const statCards = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: formatMoney(dashboard?.stats.totalRevenue ?? 0),
        icon: "heroicons:banknotes",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        label: "Total Bookings",
        value: (dashboard?.stats.totalBookings ?? 0).toLocaleString(),
        icon: "heroicons:clipboard-document-list",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        label: "Active Tours",
        value: (dashboard?.stats.activeTours ?? 0).toLocaleString(),
        icon: "heroicons:globe-alt",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      {
        label: "Total Customers",
        value: (dashboard?.stats.totalCustomers ?? 0).toLocaleString(),
        icon: "heroicons:user-group",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      {
        label: "Cancellation Rate",
        value: `${(dashboard?.stats.cancellationRate ?? 0).toFixed(1)}%`,
        icon: "heroicons:x-circle",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },
      {
        label: "Visa Approval",
        value: `${(dashboard?.stats.visaApprovalRate ?? 0).toFixed(1)}%`,
        icon: "heroicons:shield-check",
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
      },
    ],
    [dashboard],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main id="main-content" className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon icon="heroicons:chart-bar" className="size-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Backend-synced analytics for admin operations</p>
              </div>
            </div>
            <button
              onClick={() => void loadDashboard()}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 transition-colors">
              <Icon icon="heroicons:arrow-path" className="size-4 text-slate-500" />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading && (
            <Card bodyClass="p-8">
              <div className="flex items-center gap-3 text-slate-600">
                <Icon icon="heroicons:arrow-path" className="size-5 animate-spin" />
                <span>{t("common.loadingDashboard", "Loading dashboard data from backend...")}</span>
              </div>
            </Card>
          )}

          {!isLoading && errorMessage && (
            <Card bodyClass="p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-red-700">
                  <Icon icon="heroicons:exclamation-triangle" className="size-5" />
                  <span>{errorMessage}</span>
                </div>
                <div>
                  <button
                    onClick={() => void loadDashboard()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors">
                    <Icon icon="heroicons:arrow-path" className="size-4" />
                    Retry
                  </button>
                </div>
              </div>
            </Card>
          )}

          {!isLoading && !errorMessage && !dashboard && (
            <Card bodyClass="p-8">
              <div className="flex items-center gap-3 text-slate-600">
                <Icon icon="heroicons:information-circle" className="size-5" />
                <span>No dashboard data is available.</span>
              </div>
            </Card>
          )}

          {!isLoading && !errorMessage && dashboard && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat) => (
                  <Card key={stat.label} className="!p-0" bodyClass="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                        <Icon icon={stat.icon} className={`size-5 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3" bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Revenue Over Time</h3>
                  <p className="text-sm text-slate-500 mb-4">Monthly revenue trend</p>
                  <Chart options={revenueOverTimeOptions} series={revenueOverTimeSeries} type="line" height={300} />
                </Card>
                <Card className="lg:col-span-2" bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Revenue By Tour Type</h3>
                  <p className="text-sm text-slate-500 mb-4">Distribution by instance type</p>
                  <div className="flex justify-center">
                    <Chart
                      options={revenueByTourTypeOptions}
                      series={revenueByTourTypeSeries}
                      type="donut"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div className="mt-6">
                    <MetricLegend items={revenueByTourType} />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Revenue By Region</h3>
                  <p className="text-sm text-slate-500 mb-4">Regional revenue split</p>
                  <div className="flex items-center gap-8">
                    <div className="shrink-0">
                      <Chart
                        options={revenueByRegionOptions}
                        series={revenueByRegionSeries}
                        type="donut"
                        height={200}
                        width={200}
                      />
                    </div>
                    <MetricLegend items={revenueByRegion} />
                  </div>
                </Card>

                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Booking Status Distribution</h3>
                  <p className="text-sm text-slate-500 mb-4">Current booking state mix</p>
                  <div className="flex items-center gap-8">
                    <div className="shrink-0">
                      <Chart
                        options={bookingStatusOptions}
                        series={bookingStatusSeries}
                        type="donut"
                        height={200}
                        width={200}
                      />
                    </div>
                    <MetricLegend items={bookingStatusDistribution} />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Booking Trend</h3>
                  <p className="text-sm text-slate-500 mb-4">Bookings per month</p>
                  <Chart options={bookingTrendOptions} series={bookingTrendSeries} type="area" height={240} />
                </Card>

                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Top Selling Tours</h3>
                  <p className="text-sm text-slate-500 mb-4">Ranked by revenue</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-0 font-medium text-slate-500">Tour</th>
                          <th className="text-right py-3 px-0 font-medium text-slate-500">Bookings</th>
                          <th className="text-right py-3 px-0 font-medium text-slate-500">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.topTours.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-slate-500">
                              No top tour data available.
                            </td>
                          </tr>
                        ) : (
                          dashboard.topTours.map((tour, index) => (
                            <tr key={`${tour.name}-${index}`} className="border-b border-slate-100 last:border-0">
                              <td className="py-3 text-slate-700">{tour.name}</td>
                              <td className="py-3 text-right text-slate-600">{tour.bookings.toLocaleString()}</td>
                              <td className="py-3 text-right font-medium text-green-600">
                                {formatMoney(tour.revenue)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Top Destinations</h3>
                  <p className="text-sm text-slate-500 mb-4">Most booked destinations</p>
                  <Chart options={topDestinationsOptions} series={topDestinationsSeries} type="bar" height={240} />
                </Card>

                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Customer Growth</h3>
                  <p className="text-sm text-slate-500 mb-4">New customers by month</p>
                  <Chart options={customerGrowthOptions} series={customerGrowthSeries} type="bar" height={240} />
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3" bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Visa Processing Status</h3>
                  <p className="text-sm text-slate-500 mb-6">Current visa application pipeline</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {dashboard.visaStatuses.map((status, index) => (
                      <VisaStatusBadge key={`${status.label}-${index}`} status={status} />
                    ))}
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 mb-3">Upcoming Visa Deadlines</h4>
                  <div className="space-y-2">
                    {dashboard.upcomingVisaDeadlines.length === 0 ? (
                      <div className="py-3 px-3 bg-slate-50 rounded-lg text-sm text-slate-500">
                        No upcoming visa deadlines.
                      </div>
                    ) : (
                      dashboard.upcomingVisaDeadlines.map((deadline) => (
                        <div
                          key={`${deadline.tour}-${deadline.date}`}
                          className="flex items-center justify-between py-3 px-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">{deadline.tour}</span>
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                            {deadline.date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-orange-500 !text-white border-none" bodyClass="p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon icon="heroicons:shield-check" className="size-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-100">Visa Success Rate</p>
                        <p className="text-3xl font-bold">{dashboard.visaSummary.approvalRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    <p className="text-sm text-orange-100 mb-6">Approval rate across finalized applications</p>

                    <div className="bg-white/10 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-100">Total Applications</span>
                        <span className="font-medium">{dashboard.visaSummary.totalApplications.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-100">Approved</span>
                        <span className="font-medium">{dashboard.visaSummary.approved.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-100">Rejected</span>
                        <span className="font-medium">{dashboard.visaSummary.rejected.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>

                  <Card bodyClass="p-5">
                    <h3 className="text-base font-semibold text-slate-900 mb-4">Customer Nationality</h3>
                    <MetricLegend items={customerNationalities} />
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Operational Alerts</h3>
                  <p className="text-sm text-slate-500 mb-4">Backend-generated operational signals</p>
                  <div className="space-y-3">
                    {dashboard.alerts.length === 0 ? (
                      <div className="text-sm text-slate-500">No alerts returned by backend.</div>
                    ) : (
                      dashboard.alerts.map((alert, index) => (
                        <AlertItem key={`${alert.text}-${index}`} alert={alert} />
                      ))
                    )}
                  </div>
                </Card>

                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                  <p className="text-sm text-slate-500 mb-4">Frequently used actions</p>
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-orange-200 transition-colors group">
                        <Icon
                          icon={action.icon}
                          className="size-5 text-slate-400 group-hover:text-orange-500 transition-colors"
                        />
                        <p className="text-sm font-medium text-slate-700">{action.label}</p>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
