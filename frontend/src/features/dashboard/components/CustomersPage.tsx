"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import type { AdminCustomer } from "@/types/admin";
import { AdminLogoutButton } from "./AdminLogoutButton";

import {
  calculateCustomerMetrics,
  filterCustomers,
  loadCustomersFromAdminService,
  type CustomerStatusFilter,
  type CustomersDataState,
} from "./customersPageLogic";

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
    label: "Tour Requests",
    icon: "heroicons:clipboard-document-list",
    href: "/dashboard/tour-requests",
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
    active: true,
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
      }`}
    >
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
          className="lg:hidden text-slate-400 hover:text-white"
        >
          <Icon icon="heroicons:x-mark" className="size-5" />
        </button>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.active
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
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

function TopBar({
  onMenuClick,
  searchQuery,
  onSearchQueryChange,
  disableSearch,
}: {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  disableSearch: boolean;
}) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden text-slate-500"
      >
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      <div className="relative flex-1 max-w-xl">
        <Icon
          icon="heroicons:magnifying-glass"
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
        />
        <label htmlFor="customers-search" className="sr-only">
          {t("common.search", "Search")}
        </label>
        <input
          id="customers-search"
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          disabled={disableSearch}
          placeholder={t("placeholder.searchByNameEmailId", "Search by name, email, or ID...")}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <div className="ml-auto relative">
        <button
          aria-label="Notifications - 3 unread"
          className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Icon icon="heroicons:bell" className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>
      </div>
    </header>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  label,
  value,
  change,
  changeType,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="!p-0" bodyClass="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{label}</p>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          <Icon icon={icon} className={`size-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {change && (
        <p
          className={`text-xs mt-1 ${changeType === "positive" ? "text-green-600" : changeType === "negative" ? "text-red-600" : "text-slate-400"}`}
        >
          {change}
        </p>
      )}
    </Card>
  );
}

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700" },
  inactive: { bg: "bg-slate-100", text: "text-slate-600" },
};

const STATUS_FILTERS: CustomerStatusFilter[] = ["all", "active", "inactive"];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const NATIONALITY_FLAGS: Record<string, string> = {
  Vietnam: "🇻🇳",
  Korea: "🇰🇷",
  USA: "🇺🇸",
  Japan: "🇯🇵",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  Australia: "🇦🇺",
};

interface CustomerTableRow {
  customer: AdminCustomer;
  rowKey: string;
}

const buildCustomerTableRows = (
  customers: AdminCustomer[],
): CustomerTableRow[] => {
  const idOccurrences = new Map<string, number>();

  return customers.map((customer, index) => {
    const normalizedId = customer.id || `UNKNOWN-${index + 1}`;
    const occurrence = (idOccurrences.get(normalizedId) ?? 0) + 1;
    idOccurrences.set(normalizedId, occurrence);

    return {
      customer,
      rowKey:
        occurrence === 1 ? normalizedId : `${normalizedId}__${occurrence}`,
    };
  });
};

export function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CustomerStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [dataState, setDataState] = useState<CustomersDataState>("loading");
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      setDataState("loading");
      setErrorMessage(null);

      const result = await loadCustomersFromAdminService();

      if (!active) {
        return;
      }

      setCustomers(result.customers);
      setDataState(result.state);
      setErrorMessage(result.errorMessage);
    };

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const filteredCustomers = useMemo(() => {
    return filterCustomers(customers, statusFilter, searchQuery);
  }, [customers, statusFilter, searchQuery]);

  const customerRows = useMemo(() => {
    return buildCustomerTableRows(filteredCustomers);
  }, [filteredCustomers]);

  const metrics = useMemo(() => {
    return calculateCustomerMetrics(customers);
  }, [customers]);

  const isLoading = dataState === "loading";
  const isError = dataState === "error";
  const isEmpty = dataState === "empty";
  const canShowData = dataState === "ready" || isEmpty;

  const retryLoading = () => {
    setReloadToken((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="lg:pl-64">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          disableSearch={!canShowData}
        />
        <main id="main-content" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage customer profiles and engagement
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <div className="flex items-center gap-3 text-slate-600">
                <Icon
                  icon="heroicons:arrow-path"
                  className="size-5 animate-spin"
                />
                <p className="text-sm font-medium">
                  Loading customers from API...
                </p>
              </div>
            </div>
          ) : null}

          {isError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-red-800">
                    Could not load customers
                  </h2>
                  <p className="text-sm text-red-700 mt-1">
                    {errorMessage ??
                      "Unable to load customer data. Please try again."}
                  </p>
                </div>
                <button
                  onClick={retryLoading}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {canShowData ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Customers"
                  value={metrics.totalCustomers.toString()}
                  change="Synced from backend"
                  changeType="positive"
                  icon="heroicons:users"
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <StatCard
                  label="Active Customers"
                  value={metrics.activeCustomers.toString()}
                  change={`${metrics.activePercentage}% of total`}
                  changeType="positive"
                  icon="heroicons:user-group"
                  iconBg="bg-green-100"
                  iconColor="text-green-600"
                />
                <StatCard
                  label="Avg. Spending"
                  value={`$${Math.round(metrics.averageSpent).toLocaleString()}`}
                  change="Calculated from loaded data"
                  changeType="positive"
                  icon="heroicons:currency-dollar"
                  iconBg="bg-purple-100"
                  iconColor="text-purple-600"
                />
                <StatCard
                  label="VIP Members"
                  value={metrics.vipCustomers.toString()}
                  change="Spending >= $5,000"
                  changeType="positive"
                  icon="heroicons:star"
                  iconBg="bg-amber-100"
                  iconColor="text-amber-600"
                />
              </div>

              <div className="flex items-center gap-3">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {isEmpty ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <Icon
                    icon="heroicons:user-group"
                    className="size-8 text-slate-300 mx-auto"
                  />
                  <h2 className="text-lg font-semibold text-slate-800 mt-3">
                    No customers yet
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    The API returned no customer records for this workspace.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Customer
                          </th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Contact
                          </th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Nationality
                          </th>
                          <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Bookings
                          </th>
                          <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Total Spent
                          </th>
                          <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Status
                          </th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            Last Booking
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerRows.length > 0 ? (
                          customerRows.map(({ customer, rowKey }) => {
                            const initials = customer.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("");
                            const nationalityFlag =
                              NATIONALITY_FLAGS[customer.nationality] ?? "🌍";

                            return (
                              <tr
                                key={rowKey}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                      {initials}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">
                                        {customer.name}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {customer.id}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-slate-600">
                                    {customer.email}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {customer.phone}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm">
                                    {nationalityFlag} {customer.nationality}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="text-sm text-slate-900 font-medium">
                                    {customer.totalBookings}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="text-sm font-semibold text-slate-900">
                                    ${customer.totalSpent.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <StatusBadge status={customer.status} />
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-slate-500">
                                    {customer.lastBooking}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-6 py-10 text-center text-sm text-slate-500"
                            >
                              No customers match your current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default CustomersPage;
