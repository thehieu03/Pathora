"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SquaresFour,
  GlobeHemisphereWest,
  CalendarDots,
  ClipboardText,
  Ticket,
  CreditCard,
  UsersThree,
  ShieldCheck,
  Certificate,
  Gear,
  SignOut,
  X,
  List,
  Bell,
  Buildings,
} from "@phosphor-icons/react";
import { AdminLogoutButton } from "./AdminLogoutButton";

/* ══════════════════════════════════════════════════════════════
   Navigation Items - Single Source of Truth
   ══════════════════════════════════════════════════════════════ */
export const NAV_ITEMS = [
  { label: "Dashboard", icon: SquaresFour, href: "/dashboard" },
  { label: "Tours", icon: GlobeHemisphereWest, href: "/tour-management" },
  { label: "Tour Instances", icon: CalendarDots, href: "/tour-instances" },
  { label: "Tour Requests", icon: ClipboardText, href: "/dashboard/tour-requests" },
  { label: "Bookings", icon: Ticket, href: "/dashboard/bookings" },
  { label: "Payments", icon: CreditCard, href: "/dashboard/payments" },
  { label: "Customers", icon: UsersThree, href: "/dashboard/customers" },
  { label: "Insurance", icon: ShieldCheck, href: "/dashboard/insurance" },
  { label: "Visa Applications", icon: Certificate, href: "/dashboard/visa" },
  { label: "Settings", icon: Gear, href: "/dashboard/settings" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

/* ══════════════════════════════════════════════════════════════
   AdminSidebar Props
   ══════════════════════════════════════════════════════════════ */
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/* ══════════════════════════════════════════════════════════════
   AdminSidebar Component
   ══════════════════════════════════════════════════════════════ */
export function AdminSidebar({ isOpen, onClose, children }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col lg:translate-x-0"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group"
          >
            {/* Logo mark */}
            <div
              className="relative w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm text-white transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: "var(--accent)",
              }}
            >
              <Buildings weight="fill" size={18} className="text-stone-900" />
              {/* Subtle shine */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
                }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-sm font-semibold leading-none tracking-tight"
                style={{ color: "var(--sidebar-text)" }}
              >
                Pathora
              </span>
              <span
                className="text-[10px] font-medium tracking-widest uppercase mt-0.5"
                style={{ color: "var(--sidebar-text-muted)" }}
              >
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden rounded-lg p-1.5 transition-all duration-200 hover:bg-white/5"
            style={{ color: "var(--sidebar-text-muted)" }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const IconComp = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  onClick={onClose}
                  style={
                    active
                      ? {
                          backgroundColor: "var(--sidebar-active-bg)",
                          color: "var(--sidebar-active-text)",
                        }
                      : {
                          color: "var(--sidebar-text-muted)",
                        }
                  }
                >
                  {/* Hover fill */}
                  <span
                    className="absolute inset-0 rounded-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  />

                  {/* Icon */}
                  <span className="relative z-10 transition-colors duration-200">
                    <IconComp
                      size={20}
                      weight={active ? "fill" : "regular"}
                    />
                  </span>

                  {/* Label */}
                  <span className="relative z-10 transition-colors duration-200">{item.label}</span>

                  {/* Active indicator — amber pill bar on the left */}
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r-full"
                        style={{ backgroundColor: "var(--sidebar-active-border)" }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div
          className="shrink-0 p-3"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          {/* Admin card */}
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{
                backgroundColor: "var(--accent)",
              }}
            >
              AD
              {/* Online dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  backgroundColor: "#22c55e",
                  borderColor: "var(--sidebar-bg)",
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate leading-none" style={{ color: "var(--sidebar-text)" }}>
                Admin
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: "var(--sidebar-text-muted)" }}>
                Administrator
              </p>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 cursor-default lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Main content area — shifts right on lg so sidebar (fixed) doesn't cover it */}
      {children && <div className="lg:ml-64">{children}</div>}
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
    <header
      className="sticky top-0 z-40 h-16 flex items-center px-6 gap-4 transition-shadow duration-200 border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden text-stone-400 hover:text-stone-600 rounded-lg p-2 -ml-2 transition-all duration-200 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <List size={22} weight="bold" />
      </button>
      {title && (
        <div className="flex-1">
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          aria-label="Notifications"
          className="relative p-2 text-stone-400 hover:text-stone-600 rounded-lg transition-all duration-200 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Bell size={20} weight="regular" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        </button>
      </div>
    </header>
  );
}
