"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { adminService } from "@/api/services/adminService";
import type { AdminOverview } from "@/types/admin";
import { AdminSidebar, TopBar } from "./AdminSidebar";
import { buildPaymentRowKeys } from "./paymentsPageLogic";

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

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  completed: { bg: "bg-green-100", text: "text-green-700" },
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
  refunded: { bg: "bg-red-100", text: "text-red-700" },
  failed: { bg: "bg-red-100", text: "text-red-700" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function PaymentsPage() {
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

  const payments = overview?.payments ?? [];

  const filteredPayments =
    statusFilter === "all"
      ? payments
      : payments.filter((payment) => payment.status === statusFilter);
  const paymentRowKeys = useMemo(() => {
    return buildPaymentRowKeys(filteredPayments);
  }, [filteredPayments]);

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <main id="main-content" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track all payment transactions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.5% from last month" changeType="positive" icon="heroicons:banknotes" iconBg="bg-green-100" iconColor="text-green-600" />
            <StatCard label="Pending Payments" value={`$${pendingAmount.toLocaleString()}`} change="8 transactions" changeType="neutral" icon="heroicons:clock" iconBg="bg-amber-100" iconColor="text-amber-600" />
            <StatCard label="Completed" value={payments.filter(p => p.status === "completed").length.toString()} change="Synced from backend" changeType="positive" icon="heroicons:check-circle" iconBg="bg-blue-100" iconColor="text-blue-600" />
            <StatCard label="Refunded" value={payments.filter(p => p.status === "refunded").length.toString()} change="Synced from backend" changeType="negative" icon="heroicons:arrow-uturn-left" iconBg="bg-red-100" iconColor="text-red-600" />
          </div>

          <div className="flex items-center gap-3">
            {["all", "completed", "pending", "refunded"].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Payment ID</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Booking</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <tr key={paymentRowKeys[index]} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><span className="font-mono text-sm text-slate-600">{payment.id}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-900">{payment.booking}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{payment.customer}</span></td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                            <Icon
                              icon={
                                payment.method.toLowerCase().includes("bank")
                                  ? "heroicons:building-library"
                                  : payment.method.toLowerCase().includes("cash")
                                    ? "heroicons:banknotes"
                                    : "heroicons:qr-code"
                              }
                              className="size-4 text-slate-400"
                            />
                            {payment.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right"><span className="font-semibold text-slate-900">${payment.amount.toLocaleString()}</span></td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={payment.status} /></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{payment.date}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                        No payment transactions available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
    </AdminSidebar>
  );
}

export default PaymentsPage;


