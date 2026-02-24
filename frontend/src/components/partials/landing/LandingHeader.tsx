"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Icon } from "@/components/ui";
import { AuthModal } from "./AuthModal";

const LOGO =
  "https://www.figma.com/api/mcp/asset/b9cd8d76-4d7f-43c8-b45b-122fe4f71260";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "About Us", href: "/about" },
  { label: "Tour Packages", href: "/tours" },
  { label: "Our Policies", href: "/policies" },
];

const sidebarLinks = [
  {
    label: "User Profile",
    icon: "heroicons-outline:user",
    children: [
      { label: "Profile", href: "/profile" },
      { label: "Booking History", href: "/bookings" },
    ],
  },
  { label: "Home", href: "/", icon: "heroicons-outline:home" },
  {
    label: "Tour Discovery",
    href: "/tours",
    icon: "heroicons-outline:globe-alt",
  },
  { label: "About Us", href: "/about", icon: "heroicons-outline:users" },
  {
    label: "Our Policies",
    href: "/policies",
    icon: "heroicons-outline:document-text",
  },
];

/* ── Mobile Sidebar Drawer ─────────────────────────────────── */
const MobileSidebar = ({
  open,
  onClose,
  onOpenAuth,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (view: "signup" | "login" | "forgot") => void;
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(
    "User Profile",
  );
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const selectors =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(selectors),
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close navigation menu"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 left-0 bottom-0 w-75 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <Button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-transparent"
            icon="heroicons-outline:chevron-left"
            iconClass="text-[20px] text-gray-700"
            ariaLabel="Close menu"
          />
          <h2 className="text-xl font-medium text-gray-900">Dashboard</h2>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <Icon
              icon="heroicons-solid:user-circle"
              className="w-full h-full text-gray-400"
            />
          </div>
          <div>
            <p className="text-sm font-normal text-gray-900">User</p>
            <p className="text-sm text-gray-500">user@gmail.com</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Sidebar">
          {sidebarLinks.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <Button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors bg-transparent"
                  >
                    <Icon
                      icon={item.icon}
                      className="w-6 h-6 text-gray-600 shrink-0"
                    />
                    <span className="flex-1 text-base text-gray-900">
                      {item.label}
                    </span>
                    <Icon
                      icon="heroicons-outline:chevron-down"
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedItem === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  {expandedItem === item.label && (
                    <div className="pl-12">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          className="block px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-landing-accent transition-colors rounded"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Icon
                    icon={item.icon}
                    className="w-6 h-6 text-gray-600 shrink-0"
                  />
                  <span className="text-base text-gray-900">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <Button
            onClick={() => onOpenAuth("login")}
            text="Login"
            className="flex-1 px-4 py-2.5 text-center text-gray-900 border border-gray-300 rounded-full font-medium bg-white hover:bg-gray-50 transition-colors text-sm"
          />
          <Button
            onClick={() => onOpenAuth("signup")}
            text="Sign Up"
            className="flex-1 px-4 py-2.5 text-center bg-landing-accent text-white rounded-full font-medium hover:bg-landing-accent-hover transition-colors text-sm"
          />
        </div>
      </div>
    </div>
  );
};

/* ── Header ────────────────────────────────────────────────── */
export const LandingHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"signup" | "login" | "forgot">(
    "signup",
  );

  const openAuth = (view: "signup" | "login" | "forgot") => {
    setAuthView(view);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 md:py-5 min-h-17.5 md:h-32 bg-[rgba(255,255,255,0.2)] backdrop-blur-sm">
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative h-12 md:h-25 w-28 md:w-34">
            <Image
              src={LOGO}
              alt="Pathora logo"
              fill
              sizes="(max-width: 768px) 112px, 136px"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop / iPad nav — visible from md (768 px) */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-10"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-white font-semibold text-base lg:text-[20px] transition-colors hover:text-landing-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                link.active ? "border-b-2 border-landing-accent" : ""
              }`}
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <Button
            className="flex items-center gap-1 text-white/60 font-semibold text-base lg:text-[20px] hover:text-white transition-colors bg-transparent"
            icon="heroicons-outline:chevron-down"
            iconPosition="right"
            text="Eng"
            ariaLabel="Change language"
          />
          <Button
            onClick={() => openAuth("login")}
            text="Login"
            className="px-4 lg:px-5 py-2 lg:py-2.5 text-white font-semibold text-base lg:text-[20px] rounded-full hover:bg-white/10 transition-colors bg-transparent"
          />
          <Button
            onClick={() => openAuth("signup")}
            text="Sign Up"
            className="px-5 lg:px-6 py-2 lg:py-2.5 bg-landing-accent text-white font-semibold text-base lg:text-[20px] rounded-full hover:bg-landing-accent-hover transition-colors"
          />
        </div>

        {/* Hamburger — mobile only (< 768 px) */}
        <Button
          className="md:hidden text-white bg-transparent p-2"
          onClick={() => setMenuOpen(true)}
          ariaLabel="Open menu"
        >
          <Icon icon="heroicons-outline:menu" className="w-7 h-7" />
        </Button>
      </header>

      <MobileSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenAuth={openAuth}
      />
      <AuthModal
        key={authView}
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};
