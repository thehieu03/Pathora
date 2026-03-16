"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import { tourRequestService } from "@/api/services/tourRequestService";
import { AdminLogoutButton } from "./AdminLogoutButton";

type TourRequestAdminLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  pendingRefreshKey?: number;
};

type NavItem = {
  label: string;
  icon: string;
  href: string;
  showPendingBadge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
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
    showPendingBadge: true,
  },
  { label: "Bookings", icon: "heroicons:ticket", href: "/dashboard/bookings" },
  { label: "Payments", icon: "heroicons:credit-card", href: "/dashboard/payments" },
  { label: "Customers", icon: "heroicons:user-group", href: "/dashboard/customers" },
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
  { label: "Settings", icon: "heroicons:cog-6-tooth", href: "/dashboard/settings" },
];

const isRouteActive = (pathname: string, href: string): boolean => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function TourRequestAdminLayout({
  title,
  subtitle,
  children,
  pendingRefreshKey,
}: TourRequestAdminLayoutProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadPendingCount = useCallback(async () => {
    try {
      const result = await tourRequestService.getAllTourRequests({
        status: "Pending",
        pageNumber: 1,
        pageSize: 1,
      });

      setPendingCount(result.total);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPendingCount();
  }, [loadPendingCount, pendingRefreshKey]);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "max-lg:-translate-x-full"
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
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Icon icon="heroicons:x-mark" className="size-5" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <Icon icon={item.icon} className="size-5" />
                  <span>
                    {item.showPendingBadge
                      ? t("tourRequest.page.adminRequests.title")
                      : item.label}
                  </span>
                </span>

                {item.showPendingBadge && pendingCount > 0 && (
                  <span className="inline-flex min-w-6 justify-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
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

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="lg:hidden text-slate-500"
              >
                <Icon icon="heroicons:bars-3" className="size-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500">{subtitle}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
