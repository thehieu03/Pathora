"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { adminService } from "@/services/adminService";
import type { AdminInsurance, AdminOverview } from "@/types/admin";
import { AdminLogoutButton } from "./AdminLogoutButton";

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
  },
  {
    label: "Insurance",
    icon: "heroicons:shield-check",
    href: "/dashboard/insurance",
    active: true,
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

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
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
        <label htmlFor="insurance-search" className="sr-only">
          Search
        </label>
        <input
          id="insurance-search"
          type="text"
          placeholder="Search insurance..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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

const INSURANCE_PLANS = [
  {
    id: "INS-001",
    booking: "Japan Sakura Tour",
    customer: "Nguyen Van A",
    type: "Basic Travel",
    coverage: "$10,000",
    premium: 50,
    status: "active",
    startDate: "Mar 1, 2026",
    endDate: "Mar 15, 2026",
  },
  {
    id: "INS-002",
    booking: "Korea Autumn Adventure",
    customer: "Tran Thi B",
    type: "Premium Travel",
    coverage: "$25,000",
    premium: 120,
    status: "active",
    startDate: "Mar 5, 2026",
    endDate: "Mar 20, 2026",
  },
  {
    id: "INS-003",
    booking: "Thailand Beach Paradise",
    customer: "Le Van C",
    type: "Basic Travel",
    coverage: "$10,000",
    premium: 45,
    status: "expired",
    startDate: "Feb 1, 2026",
    endDate: "Feb 15, 2026",
  },
  {
    id: "INS-004",
    booking: "Europe Grand Tour",
    customer: "Pham Thi D",
    type: "Comprehensive",
    coverage: "$50,000",
    premium: 250,
    status: "active",
    startDate: "Apr 1, 2026",
    endDate: "Apr 25, 2026",
  },
  {
    id: "INS-005",
    booking: "Bali Eco Retreat",
    customer: "Hoang Van E",
    type: "Basic Travel",
    coverage: "$10,000",
    premium: 40,
    status: "claimed",
    startDate: "Jan 15, 2026",
    endDate: "Jan 25, 2026",
  },
  {
    id: "INS-006",
    booking: "Singapore Urban Experience",
    customer: "Nguyen Thi F",
    type: "Premium Travel",
    coverage: "$25,000",
    premium: 110,
    status: "active",
    startDate: "Mar 10, 2026",
    endDate: "Mar 18, 2026",
  },
  {
    id: "INS-007",
    booking: "Vietnam Heritage Tour",
    customer: "Tran Van G",
    type: "Basic Travel",
    coverage: "$10,000",
    premium: 35,
    status: "active",
    startDate: "Mar 8, 2026",
    endDate: "Mar 12, 2026",
  },
  {
    id: "INS-008",
    booking: "Japan Cherry Blossom",
    customer: "Le Thi H",
    type: "Comprehensive",
    coverage: "$50,000",
    premium: 280,
    status: "active",
    startDate: "Mar 20, 2026",
    endDate: "Apr 5, 2026",
  },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700" },
  expired: { bg: "bg-slate-100", text: "text-slate-600" },
  claimed: { bg: "bg-amber-100", text: "text-amber-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface InsuranceTableRow {
  insurance: AdminInsurance;
  rowKey: string;
}

export function InsurancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    let active = true;

    const loadOverview = async () => {
      try {
        const result = await adminService.getOverview();
        if (active && result) {
          setOverview(result);
        }
      } catch {
        if (active) {
          setOverview(null);
        }
      }
    };

    void loadOverview();

    return () => {
      active = false;
    };
  }, []);

  const insurancePlans =
    overview?.insurances && overview.insurances.length > 0
      ? overview.insurances
      : INSURANCE_PLANS;

  const filteredInsurances =
    statusFilter === "all"
      ? insurancePlans
      : insurancePlans.filter((i) => i.status === statusFilter);

  const insuranceRows = useMemo<InsuranceTableRow[]>(() => {
    const idOccurrences = new Map<string, number>();

    return filteredInsurances.map((insurance, index) => {
      const normalizedId = insurance.id || `INS-UNKNOWN-${index + 1}`;
      const occurrence = (idOccurrences.get(normalizedId) ?? 0) + 1;
      idOccurrences.set(normalizedId, occurrence);

      return {
        insurance,
        rowKey:
          occurrence === 1 ? normalizedId : `${normalizedId}__${occurrence}`,
      };
    });
  }, [filteredInsurances]);

  const activePolicies = insurancePlans.filter(
    (i) => i.status === "active",
  ).length;
  const totalPremium = insurancePlans
    .filter((i) => i.status === "active")
    .reduce((sum, i) => sum + i.premium, 0);
  const claimsCount = insurancePlans.filter(
    (i) => i.status === "claimed",
  ).length;

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
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Insurance</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage travel insurance policies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Policies"
              value={activePolicies.toString()}
              change="+5 this month"
              changeType="positive"
              icon="heroicons:shield-check"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              label="Total Premiums"
              value={`$${totalPremium.toLocaleString()}`}
              change="+18% from last month"
              changeType="positive"
              icon="heroicons:currency-dollar"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              label="Claims"
              value={claimsCount.toString()}
              change="Synced from backend"
              changeType="neutral"
              icon="heroicons:document-text"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <StatCard
              label="Avg. Premium"
              value={`$${activePolicies > 0 ? Math.round(totalPremium / activePolicies) : 0}`}
              change="per policy"
              changeType="neutral"
              icon="heroicons:calculator"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          <div className="flex items-center gap-3">
            {["all", "active", "expired", "claimed"].map((status) => (
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

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Policy ID
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Booking
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Plan Type
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Coverage
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Premium
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Period
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {insuranceRows.map(({ insurance, rowKey }) => (
                    <tr
                      key={rowKey}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600">
                          {insurance.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-900">
                          {insurance.booking}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {insurance.customer}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {insurance.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-slate-900">
                          {insurance.coverage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-green-600">
                          ${insurance.premium}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={insurance.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500">
                          {insurance.startDate} - {insurance.endDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InsurancePage;
