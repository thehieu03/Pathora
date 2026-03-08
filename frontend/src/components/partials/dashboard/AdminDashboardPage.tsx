"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import Chart from "@/components/ui/Chart";
import type { ApexOptions } from "apexcharts";

/* ══════════════════════════════════════════════════════════════
   Color palette
   ══════════════════════════════════════════════════════════════ */
const COLORS = {
  primary: "#f97316",
  secondary: "#6366f1",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  info: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",
};

/* ══════════════════════════════════════════════════════════════
   Sidebar Navigation
   ══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "heroicons:squares-2x2", href: "/dashboard" },
  {
    label: "Tours",
    icon: "heroicons:globe-alt",
    href: "/dashboard/tour-management",
  },
  {
    label: "Tour Instances",
    icon: "heroicons:calendar-days",
    href: "/dashboard/tour-management",
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
              item.label === "Dashboard"
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
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
   Stat Cards
   ══════════════════════════════════════════════════════════════ */
const STATS = [
  {
    label: "Total Revenue",
    value: "$2,450,000",
    icon: "heroicons:banknotes",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Total Bookings",
    value: "4,321",
    icon: "heroicons:clipboard-document-list",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Active Tours",
    value: "125",
    icon: "heroicons:globe-alt",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Total Customers",
    value: "12,540",
    icon: "heroicons:user-group",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Cancellation Rate",
    value: "3.2%",
    icon: "heroicons:x-circle",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    label: "Visa Approval",
    value: "91%",
    icon: "heroicons:shield-check",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
];

function StatCard({ stat }: { stat: (typeof STATS)[0] }) {
  return (
    <Card className="!p-0" bodyClass="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{stat.label}</p>
        <div
          className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
          <Icon icon={stat.icon} className={`size-5 ${stat.iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════
   Revenue Over Time (Line Chart)
   ══════════════════════════════════════════════════════════════ */
const revenueLineOptions: ApexOptions = {
  chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit" },
  stroke: { curve: "smooth", width: 3 },
  colors: [COLORS.primary],
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `$${val}k`,
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
  tooltip: { y: { formatter: (val: number) => `$${val}k` } },
};

const revenueLineSeries = [
  {
    name: "Revenue",
    data: [130, 180, 160, 230, 260, 280, 340, 300, 270, 320, 380, 420],
  },
];

/* ══════════════════════════════════════════════════════════════
   Revenue By Tour Type (Donut Chart)
   ══════════════════════════════════════════════════════════════ */
const tourTypeDonutOptions: ApexOptions = {
  chart: { type: "donut", fontFamily: "inherit" },
  colors: [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning],
  labels: ["Standard", "Premium", "Luxury", "Custom"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
  stroke: { width: 2, colors: ["#fff"] },
};

const tourTypeDonutSeries = [450, 680, 320, 180];

const TOUR_TYPE_LEGEND = [
  { label: "Standard", value: 450, color: COLORS.primary },
  { label: "Premium", value: 680, color: COLORS.secondary },
  { label: "Luxury", value: 320, color: COLORS.success },
  { label: "Custom", value: 180, color: COLORS.warning },
];

/* ══════════════════════════════════════════════════════════════
   Revenue By Region (Donut Chart)
   ══════════════════════════════════════════════════════════════ */
const regionDonutOptions: ApexOptions = {
  chart: { type: "donut", fontFamily: "inherit" },
  colors: [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning],
  labels: ["Domestic", "Asia", "Europe", "America"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
  stroke: { width: 2, colors: ["#fff"] },
};

const regionDonutSeries = [580, 720, 420, 210];

const REGION_LEGEND = [
  { label: "Domestic", value: 580, color: COLORS.primary },
  { label: "Asia", value: 720, color: COLORS.secondary },
  { label: "Europe", value: 420, color: COLORS.success },
  { label: "America", value: 210, color: COLORS.warning },
];

/* ══════════════════════════════════════════════════════════════
   Booking Status Distribution (Donut Chart)
   ══════════════════════════════════════════════════════════════ */
const bookingStatusDonutOptions: ApexOptions = {
  chart: { type: "donut", fontFamily: "inherit" },
  colors: [COLORS.warning, COLORS.secondary, COLORS.danger, COLORS.success],
  labels: ["Pending", "Confirmed", "Cancelled", "Completed"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
  stroke: { width: 2, colors: ["#fff"] },
};

const bookingStatusDonutSeries = [124, 542, 38, 1205];

const BOOKING_STATUS_LEGEND = [
  { label: "Pending", value: 124, color: COLORS.warning },
  { label: "Confirmed", value: 542, color: COLORS.secondary },
  { label: "Cancelled", value: 38, color: COLORS.danger },
  { label: "Completed", value: 1205, color: COLORS.success },
];

/* ══════════════════════════════════════════════════════════════
   Booking Trend (Area Chart)
   ══════════════════════════════════════════════════════════════ */
const bookingTrendOptions: ApexOptions = {
  chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit" },
  stroke: { curve: "smooth", width: 2 },
  colors: [COLORS.secondary, COLORS.primary],
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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

const bookingTrendSeries = [
  {
    name: "Bookings",
    data: [180, 200, 170, 210, 240, 220, 260, 230, 200, 250, 210, 280],
  },
];

/* ══════════════════════════════════════════════════════════════
   Top Destinations (Bar Chart)
   ══════════════════════════════════════════════════════════════ */
const destinationBarOptions: ApexOptions = {
  chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
  colors: [COLORS.primary],
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: "60%" },
  },
  xaxis: {
    categories: ["Japan", "Korea", "Thailand", "Europe", "Bali"],
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

const destinationBarSeries = [
  { name: "Bookings", data: [520, 450, 380, 310, 240] },
];

/* ══════════════════════════════════════════════════════════════
   Customer Growth (Bar Chart)
   ══════════════════════════════════════════════════════════════ */
const customerGrowthOptions: ApexOptions = {
  chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
  colors: [COLORS.secondary],
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: "55%" },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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

const customerGrowthSeries = [
  { name: "New Customers", data: [850, 920, 1050, 1150, 1300, 1500] },
];

/* ══════════════════════════════════════════════════════════════
   Data Constants
   ══════════════════════════════════════════════════════════════ */
const TOP_TOURS = [
  { name: "Japan Sakura Tour", bookings: 320, revenue: "$320,000" },
  { name: "Korea Autumn Adventure", bookings: 210, revenue: "$210,000" },
  { name: "Thailand Beach Paradise", bookings: 185, revenue: "$185,000" },
  { name: "Europe Grand Tour", bookings: 156, revenue: "$468,000" },
  { name: "Bali Eco Retreat", bookings: 142, revenue: "$142,000" },
];

const CUSTOMER_NATIONALITIES = [
  { label: "Vietnam", value: 5200, color: COLORS.primary },
  { label: "Korea", value: 3100, color: COLORS.secondary },
  { label: "Japan", value: 2400, color: COLORS.danger },
  { label: "USA", value: 1840, color: COLORS.success },
];

const VISA_STATUSES = [
  { label: "Pending", count: 40, color: "bg-orange-100 text-orange-700" },
  { label: "Submitted", count: 32, color: "bg-blue-100 text-blue-700" },
  { label: "Approved", count: 210, color: "bg-green-100 text-green-700" },
  { label: "Rejected", count: 5, color: "bg-red-100 text-red-700" },
];

const VISA_DEADLINES = [
  { tour: "Japan Sakura Tour", date: "12 Mar" },
  { tour: "Korea Spring Festival", date: "15 Mar" },
  { tour: "Europe Summer Tour", date: "18 Mar" },
];

const ALERTS = [
  {
    text: "Tour Japan Sakura nearly full (95% occupied)",
    icon: "heroicons:information-circle",
    color: "text-blue-500",
  },
  {
    text: "3 visa deadlines approaching this week",
    icon: "heroicons:exclamation-triangle",
    color: "text-amber-500",
  },
  {
    text: "High cancellation rate detected (5.2% this week)",
    icon: "heroicons:exclamation-circle",
    color: "text-red-500",
  },
  {
    text: "Monthly revenue target achieved (102%)",
    icon: "heroicons:check-circle",
    color: "text-green-500",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Create Tour",
    desc: "New package tour",
    icon: "heroicons:plus",
    href: "/dashboard/tour-management/create",
  },
  {
    label: "Schedule Tour",
    desc: "Create instance",
    icon: "heroicons:calendar",
    href: "/dashboard/tour-management",
  },
  {
    label: "Create Policy",
    desc: "Visa or cancellation",
    icon: "heroicons:document-text",
    href: "/policies",
  },
  {
    label: "View Bookings",
    desc: "All reservations",
    icon: "heroicons:eye",
    href: "/bookings",
  },
  {
    label: "Manage Visa",
    desc: "Applications",
    icon: "heroicons:shield-check",
    href: "/dashboard/visa",
  },
  {
    label: "Settings",
    desc: "System config",
    icon: "heroicons:cog-6-tooth",
    href: "/dashboard/settings",
  },
];

/* ══════════════════════════════════════════════════════════════
   Legend Component
   ══════════════════════════════════════════════════════════════ */
function ChartLegend({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600">{item.label}</span>
          </div>
          <span className="font-medium text-slate-700">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ██  AdminDashboardPage
   ══════════════════════════════════════════════════════════════ */
export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange] = useState("This Month");
  const [typeFilter] = useState("All Types");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main id="main-content" className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon
                  icon="heroicons:chart-bar"
                  className="size-5 text-orange-600"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">
                  Comprehensive analytics for your travel business
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 transition-colors">
                <span>{timeRange}</span>
                <Icon
                  icon="heroicons:chevron-down"
                  className="size-4 text-slate-400"
                />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 transition-colors">
                <span>{typeFilter}</span>
                <Icon
                  icon="heroicons:chevron-down"
                  className="size-4 text-slate-400"
                />
              </button>
            </div>
          </div>

          {/* ─── Stats Grid ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* ─── Revenue Over Time + Revenue By Tour Type ──────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3" bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Revenue Over Time
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Monthly revenue trend
              </p>
              <Chart
                options={revenueLineOptions}
                series={revenueLineSeries}
                type="line"
                height={300}
              />
            </Card>
            <Card className="lg:col-span-2" bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Revenue By Tour Type
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Distribution by type
              </p>
              <div className="flex justify-center">
                <Chart
                  options={tourTypeDonutOptions}
                  series={tourTypeDonutSeries}
                  type="donut"
                  height={200}
                  width={200}
                />
              </div>
              <div className="mt-6">
                <ChartLegend items={TOUR_TYPE_LEGEND} />
              </div>
            </Card>
          </div>

          {/* ─── Revenue By Region + Booking Status ────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Revenue By Region
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Geographic distribution
              </p>
              <div className="flex items-center gap-8">
                <div className="shrink-0">
                  <Chart
                    options={regionDonutOptions}
                    series={regionDonutSeries}
                    type="donut"
                    height={200}
                    width={200}
                  />
                </div>
                <ChartLegend items={REGION_LEGEND} />
              </div>
            </Card>
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Booking Status Distribution
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Current booking states
              </p>
              <div className="flex items-center gap-8">
                <div className="shrink-0">
                  <Chart
                    options={bookingStatusDonutOptions}
                    series={bookingStatusDonutSeries}
                    type="donut"
                    height={200}
                    width={200}
                  />
                </div>
                <ChartLegend items={BOOKING_STATUS_LEGEND} />
              </div>
            </Card>
          </div>

          {/* ─── Booking Trend + KPI Cards ─────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3" bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Booking Trend
              </h3>
              <p className="text-sm text-slate-500 mb-4">Bookings per month</p>
              <Chart
                options={bookingTrendOptions}
                series={bookingTrendSeries}
                type="area"
                height={240}
              />
            </Card>
            <div className="lg:col-span-2 space-y-6">
              {/* Avg Booking Lead Time */}
              <Card
                bodyClass="p-6"
                className="bg-orange-500 !text-white border-none">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="heroicons:clock"
                      className="size-6 text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">
                      Avg Booking Lead Time
                    </p>
                    <p className="text-2xl font-bold">24 days</p>
                  </div>
                </div>
                <p className="text-sm text-orange-100">
                  Average booking before departure
                </p>
              </Card>
              {/* Tour Occupancy Rate */}
              <Card
                bodyClass="p-6"
                className="bg-purple-600 !text-white border-none">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="heroicons:chart-bar"
                      className="size-6 text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-purple-200">
                      Tour Occupancy Rate
                    </p>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                </div>
                <p className="text-sm text-purple-200">
                  Average seat fill rate
                </p>
              </Card>
            </div>
          </div>

          {/* ─── Top Selling Tours + Top Destinations ──────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Selling Tours
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Best performing tours
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-0 font-medium text-slate-500">
                        Tour
                      </th>
                      <th className="text-right py-3 px-0 font-medium text-slate-500">
                        Bookings
                      </th>
                      <th className="text-right py-3 px-0 font-medium text-slate-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_TOURS.map((tour) => (
                      <tr
                        key={tour.name}
                        className="border-b border-slate-100 last:border-0">
                        <td className="py-3 text-slate-700">{tour.name}</td>
                        <td className="py-3 text-right text-slate-600">
                          {tour.bookings}
                        </td>
                        <td className="py-3 text-right font-medium text-green-600">
                          {tour.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Destinations
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Most popular locations
              </p>
              <Chart
                options={destinationBarOptions}
                series={destinationBarSeries}
                type="bar"
                height={240}
              />
            </Card>
          </div>

          {/* ─── Customer Growth + Customer Nationality ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3" bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Customer Growth
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                New customers per month
              </p>
              <Chart
                options={customerGrowthOptions}
                series={customerGrowthSeries}
                type="bar"
                height={220}
              />
            </Card>
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Nationality */}
              <Card bodyClass="p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                  Customer Nationality
                </h3>
                <ChartLegend items={CUSTOMER_NATIONALITIES} />
              </Card>
              {/* Repeat Customer Rate */}
              <Card
                bodyClass="p-6"
                className="bg-amber-400 !text-white border-none">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="heroicons:user-group"
                      className="size-6 text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-amber-100">
                      Repeat Customer Rate
                    </p>
                    <p className="text-2xl font-bold">32%</p>
                  </div>
                </div>
                <p className="text-sm text-amber-100">
                  Customers booking multiple tours
                </p>
              </Card>
            </div>
          </div>

          {/* ─── Visa Processing Status + Visa Success Rate ────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3" bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Visa Processing Status
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Current visa applications
              </p>

              {/* Status Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {VISA_STATUSES.map((vs) => (
                  <div
                    key={vs.label}
                    className="bg-slate-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {vs.count}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${vs.color}`}>
                      {vs.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <h4 className="text-base font-semibold text-slate-900 mb-3">
                Upcoming Visa Deadlines
              </h4>
              <div className="space-y-2">
                {VISA_DEADLINES.map((vd) => (
                  <div
                    key={vd.tour}
                    className="flex items-center justify-between py-3 px-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">{vd.tour}</span>
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      {vd.date}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Visa Success Rate */}
            <Card
              className="lg:col-span-2 bg-orange-500 !text-white border-none"
              bodyClass="p-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="heroicons:shield-check"
                    className="size-7 text-white"
                  />
                </div>
                <div>
                  <p className="text-sm text-orange-100">Visa Success Rate</p>
                  <p className="text-3xl font-bold">92%</p>
                </div>
              </div>
              <p className="text-sm text-orange-100 mb-6">
                Approval rate across all applications
              </p>

              <div className="bg-white/10 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-100">Total Applications</span>
                  <span className="font-medium">287</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-100">Approved</span>
                  <span className="font-medium">264</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-100">Rejected</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </Card>
          </div>

          {/* ─── Operational Alerts + Quick Actions ─────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Operational Alerts
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Important notifications
              </p>
              <div className="space-y-3">
                {ALERTS.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Icon
                      icon={alert.icon}
                      className={`size-5 shrink-0 ${alert.color}`}
                    />
                    <p className="text-sm text-slate-700">{alert.text}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card bodyClass="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Frequently used actions
              </p>
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
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-400">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
