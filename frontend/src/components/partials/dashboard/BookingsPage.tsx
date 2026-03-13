"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { AdminLogoutButton } from "./AdminLogoutButton";

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
    active: true,
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

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface BookingRow {
  id: string;
  customer: string;
  tour: string;
  departure: string;
  amount: number;
  status: BookingStatus;
}

const SAMPLE_BOOKINGS: BookingRow[] = [
  {
    id: "BK-2031",
    customer: "Nguyen Van A",
    tour: "Japan Sakura Tour",
    departure: "2026-04-16",
    amount: 3200,
    status: "confirmed",
  },
  {
    id: "BK-2032",
    customer: "Tran Thi B",
    tour: "Korea Autumn Adventure",
    departure: "2026-04-23",
    amount: 2100,
    status: "pending",
  },
  {
    id: "BK-2033",
    customer: "Le Van C",
    tour: "Thailand Beach Paradise",
    departure: "2026-05-02",
    amount: 1850,
    status: "cancelled",
  },
  {
    id: "BK-2034",
    customer: "Pham Thi D",
    tour: "Europe Grand Tour",
    departure: "2026-05-09",
    amount: 5600,
    status: "confirmed",
  },
];

const STATUS_BADGE: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
};

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
              item.active
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
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden text-slate-500">
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      <h1 className="text-lg font-semibold text-slate-900">Bookings</h1>
      <div className="ml-auto">
        <button
          aria-label="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon icon="heroicons:bell" className="size-5" />
        </button>
      </div>
    </header>
  );
}

export default function BookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalRevenue = useMemo(
    () => SAMPLE_BOOKINGS.reduce((sum, booking) => sum + booking.amount, 0),
    [],
  );

  const confirmedCount = useMemo(
    () => SAMPLE_BOOKINGS.filter((booking) => booking.status === "confirmed").length,
    [],
  );

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
              <p className="text-sm text-slate-500 mt-1">
                Theo doi trang thai don booking ma khong bi mat navbar dashboard.
              </p>
            </div>
            <Link
              href="/bookings"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Icon icon="heroicons:arrow-top-right-on-square" className="size-4" />
              Open customer booking page (new tab)
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card bodyClass="p-5">
              <p className="text-sm text-slate-500">Total bookings</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {SAMPLE_BOOKINGS.length}
              </p>
            </Card>
            <Card bodyClass="p-5">
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {confirmedCount}
              </p>
            </Card>
            <Card bodyClass="p-5">
              <p className="text-sm text-slate-500">Total revenue</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
            </Card>
          </div>

          <Card bodyClass="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Booking
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Tour
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Departure
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {SAMPLE_BOOKINGS.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                        {booking.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {booking.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{booking.tour}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {booking.departure}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                        ${booking.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
