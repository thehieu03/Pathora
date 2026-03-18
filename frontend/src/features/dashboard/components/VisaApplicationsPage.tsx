"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { adminService } from "@/api/services/adminService";
import type { AdminOverview } from "@/types/admin";
import { AdminSidebar, TopBar } from "./AdminSidebar";
import { buildVisaRowKeys } from "./visaPageLogic";

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
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
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
    </AdminSidebar>
  );
}

export default VisaApplicationsPage;
