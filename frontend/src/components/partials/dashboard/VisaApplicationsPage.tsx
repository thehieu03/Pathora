"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { adminService } from "@/services/adminService";
import type { AdminOverview } from "@/types/admin";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { buildVisaRowKeys } from "./visaPageLogic";

/* ══════════════════════════════════════════════════════════════
   Sidebar Navigation
   ══════════════════════════════════════════════════════════════ */
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
  { label: "Visa Applications", icon: "heroicons:document-check", href: "/dashboard/visa", active: true },
  { label: "Policies", icon: "heroicons:clipboard-document-list", href: "/dashboard/policies" },
  { label: "Settings", icon: "heroicons:cog-6-tooth", href: "/dashboard/settings" },
];

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
        <button onClick={onClose} aria-label="Close sidebar" className="lg:hidden text-slate-400 hover:text-white">
          <Icon icon="heroicons:x-mark" className="size-5" />
        </button>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.active ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
        <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <label htmlFor="visa-search" className="sr-only">{t("common.search", "Search")}</label>
        <input id="visa-search" type="text" placeholder={t("placeholder.searchVisaApplications", "Search visa applications...")} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>
      <div className="ml-auto relative">
        <button aria-label="Notifications - 3 unread" className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon icon="heroicons:bell" className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
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

function StatCard({ label, value, change, changeType, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="!p-0" bodyClass="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{label}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon icon={icon} className={`size-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${changeType === "positive" ? "text-green-600" : changeType === "negative" ? "text-red-600" : "text-slate-400"}`}>
          {change}
        </p>
      )}
    </Card>
  );
}

const VISA_APPLICATIONS = [
  { id: "VISA-001", booking: "Japan Sakura Tour", applicant: "Nguyen Van A", passport: "P1234567", country: "Japan", type: "Tourist", status: "approved", submittedDate: "Feb 15, 2026", decisionDate: "Mar 1, 2026" },
  { id: "VISA-002", booking: "Korea Autumn Adventure", applicant: "Tran Thi B", passport: "P7654321", country: "South Korea", type: "Tourist", status: "pending", submittedDate: "Mar 5, 2026", decisionDate: "-" },
  { id: "VISA-003", booking: "Europe Grand Tour", applicant: "Le Van C", passport: "P9876543", country: "Schengen", type: "Tourist", status: "under_review", submittedDate: "Feb 28, 2026", decisionDate: "-" },
  { id: "VISA-004", booking: "Thailand Beach Paradise", applicant: "Pham Thi D", passport: "P4567890", country: "Thailand", type: "Tourist", status: "approved", submittedDate: "Mar 1, 2026", decisionDate: "Mar 8, 2026" },
  { id: "VISA-005", booking: "Singapore Urban Experience", applicant: "Hoang Van E", passport: "P1122334", country: "Singapore", type: "Tourist", status: "rejected", submittedDate: "Feb 10, 2026", decisionDate: "Feb 20, 2026" },
  { id: "VISA-006", booking: "Vietnam Heritage Tour", applicant: "Nguyen Thi F", passport: "P9988776", country: "Vietnam", type: "E-visa", status: "approved", submittedDate: "Mar 2, 2026", decisionDate: "Mar 5, 2026" },
  { id: "VISA-007", booking: "Japan Cherry Blossom", applicant: "Tran Van G", passport: "P5566778", country: "Japan", type: "Tourist", status: "pending", submittedDate: "Mar 8, 2026", decisionDate: "-" },
  { id: "VISA-008", booking: "Bali Eco Retreat", applicant: "Le Thi H", passport: "P4433221", country: "Indonesia", type: "Tourist", status: "under_review", submittedDate: "Mar 6, 2026", decisionDate: "-" },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string; iconColor: string }> = {
  approved: { bg: "bg-green-100", text: "text-green-700", icon: "heroicons:check-circle", iconColor: "text-green-500" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: "heroicons:clock", iconColor: "text-amber-500" },
  under_review: { bg: "bg-blue-100", text: "text-blue-700", icon: "heroicons:arrow-path", iconColor: "text-blue-500" },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: "heroicons:x-circle", iconColor: "text-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon icon={cfg.icon} className={`size-3.5 ${cfg.iconColor}`} />
      {status === "under_review" ? "Under Review" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function VisaApplicationsPage() {
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

  const visaApplications =
    overview?.visaApplications && overview.visaApplications.length > 0
      ? overview.visaApplications
      : VISA_APPLICATIONS;

  const filteredVisas =
    statusFilter === "all"
      ? visaApplications
      : visaApplications.filter((v) => v.status === statusFilter);
  const visaRowKeys = useMemo(() => {
    return buildVisaRowKeys(filteredVisas);
  }, [filteredVisas]);
  const approvedCount = visaApplications.filter((v) => v.status === "approved").length;
  const pendingCount = visaApplications.filter((v) => v.status === "pending" || v.status === "under_review").length;
  const decidedCount = visaApplications.filter(
    (v) => v.status !== "pending" && v.status !== "under_review",
  ).length;
  const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button aria-label="Close sidebar" className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-default" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Visa Applications</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track visa application status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Applications" value={visaApplications.length.toString()} change="Synced from backend" changeType="positive" icon="heroicons:document-text" iconBg="bg-blue-100" iconColor="text-blue-600" />
            <StatCard label="Approved" value={approvedCount.toString()} change="+8 this month" changeType="positive" icon="heroicons:check-circle" iconBg="bg-green-100" iconColor="text-green-600" />
            <StatCard label="Pending Review" value={pendingCount.toString()} change="5 awaiting action" changeType="neutral" icon="heroicons:clock" iconBg="bg-amber-100" iconColor="text-amber-600" />
            <StatCard label="Approval Rate" value={`${approvalRate}%`} change="+3% from last month" changeType="positive" icon="heroicons:chart-bar" iconBg="bg-purple-100" iconColor="text-purple-600" />
          </div>

          <div className="flex items-center gap-3">
            {["all", "pending", "under_review", "approved", "rejected"].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
                {status === "all" ? "All" : status === "under_review" ? "Under Review" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Application ID</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Applicant</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Passport</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Destination</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Visa Type</th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Submitted</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisas.map((visa, index) => (
                    <tr key={visaRowKeys[index]} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4"><span className="font-mono text-sm text-slate-600">{visa.id}</span></td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{visa.applicant}</p>
                          <p className="text-xs text-slate-400">{visa.booking}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="font-mono text-sm text-slate-600">{visa.passport}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-900">{visa.country}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{visa.type}</span></td>
                      <td className="px-6 py-4 text-center"><StatusBadge status={visa.status} /></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-500">{visa.submittedDate}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-500">{visa.decisionDate}</span></td>
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

export default VisaApplicationsPage;
