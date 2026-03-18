"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import { AdminSidebar, TopBar } from "./AdminSidebar";

const STATUS_BADGE = "confirmed" | "pending" | "cancelled";

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
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
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
    </AdminSidebar>
  );
}
