"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { AdminLogoutButton } from "./AdminLogoutButton";

/* ══════════════════════════════════════════════════════════════
   Navigation Items - Single Source of Truth
   ══════════════════════════════════════════════════════════════ */
export const NAV_ITEMS = [
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
    label: "Settings",
    icon: "heroicons:cog-6-tooth",
    href: "/dashboard/settings",
  },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

/* ══════════════════════════════════════════════════════════════
   AdminSidebar Props
   ══════════════════════════════════════════════════════════════ */
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/* ══════════════════════════════════════════════════════════════
   AdminSidebar Component
   ══════════════════════════════════════════════════════════════ */
export function AdminSidebar({ isOpen, onClose, children }: AdminSidebarProps) {
  const pathname = usePathname();

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "max-lg:-translate-x-full"
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
            aria-label="Close sidebar"
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
                isActive(item.href)
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
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-default"
          onClick={onClose}
        />
      )}

      {/* Main content with sidebar offset */}
      <div className="lg:ml-64">{children}</div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TopBar Component (reusable)
   ══════════════════════════════════════════════════════════════ */
interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function TopBar({ onMenuClick, title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button onClick={onMenuClick} aria-label="Open menu" className="lg:hidden text-slate-500">
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      {title && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
      <div className="ml-auto relative">
        <button aria-label="Notifications" className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon icon="heroicons:bell" className="size-5" />
        </button>
      </div>
    </header>
  );
}


