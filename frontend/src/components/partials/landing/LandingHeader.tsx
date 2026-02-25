"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, Icon } from "@/components/ui";
import { AuthModal } from "./AuthModal";
import { useTranslation } from "react-i18next";
import useMobileMenu from "@/hooks/useMobileMenu";
import useWidth from "@/hooks/useWidth";

const LOGO =
  "https://www.figma.com/api/mcp/asset/b9cd8d76-4d7f-43c8-b45b-122fe4f71260";

const navLinks = [
  { labelKey: "landing.nav.home", href: "/" },
  { labelKey: "landing.nav.aboutUs", href: "/about" },
  { labelKey: "landing.nav.tourPackages", href: "/tours" },
  { labelKey: "landing.nav.ourPolicies", href: "/policies" },
];

const sidebarLinks = [
  {
    labelKey: "landing.sidebar.userProfile",
    icon: "heroicons-outline:user",
    children: [
      { labelKey: "landing.sidebar.profile", href: "/profile" },
      { labelKey: "landing.sidebar.bookingHistory", href: "/bookings" },
    ],
  },
  { labelKey: "landing.nav.home", href: "/", icon: "heroicons-outline:home" },
  {
    labelKey: "landing.sidebar.tourDiscovery",
    href: "/tours",
    icon: "heroicons-outline:globe-alt",
  },
  {
    labelKey: "landing.nav.aboutUs",
    href: "/about",
    icon: "heroicons-outline:users",
  },
  {
    labelKey: "landing.nav.ourPolicies",
    href: "/policies",
    icon: "heroicons-outline:document-text",
  },
];

/* ── Mobile Sidebar Drawer ─────────────────────────────────── */
const MobileSidebar = ({
  open,
  onClose,
  onOpenAuth,
  dialogId,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (view: "signup" | "login" | "forgot") => void;
  dialogId: string;
}) => {
  const { t, i18n } = useTranslation();
  const [expandedItem, setExpandedItem] = useState<string | null>(
    "landing.sidebar.userProfile",
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const normalizedLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .toLowerCase()
    .split("-")[0];

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

  if (!open) return null;

  const menuTitleId = `${dialogId}-title`;

  return (
    <div className="fixed inset-0 z-100 md:hidden">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label={t("landing.a11y.closeNavigationMenu")}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id={dialogId}
        className="absolute top-0 left-0 bottom-0 w-75 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 translate-x-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby={menuTitleId}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <Button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-transparent"
            icon="heroicons-outline:chevron-left"
            iconClass="text-[20px] text-gray-700"
            ariaLabel={t("landing.a11y.closeMenu")}
          />
          <h2 id={menuTitleId} className="text-xl font-medium text-gray-900">
            {t("landing.sidebar.dashboard")}
          </h2>
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
            <p className="text-sm font-normal text-gray-900">
              {t("landing.sidebar.user")}
            </p>
            <p className="text-sm text-gray-500">user@gmail.com</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Sidebar">
          {sidebarLinks.map((item) => (
            <div key={item.labelKey}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.labelKey ? null : item.labelKey,
                      )
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-inset"
                    aria-label={t(item.labelKey)}
                    aria-expanded={expandedItem === item.labelKey}
                    aria-controls={`sidebar-submenu-${item.labelKey.replaceAll(".", "-")}`}
                  >
                    <Icon
                      icon={item.icon}
                      className="w-6 h-6 text-gray-600 shrink-0"
                    />
                    <span className="flex-1 text-base text-gray-900">
                      {t(item.labelKey)}
                    </span>
                    <Icon
                      icon="heroicons-outline:chevron-down"
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedItem === item.labelKey ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedItem === item.labelKey && (
                    <div
                      id={`sidebar-submenu-${item.labelKey.replaceAll(".", "-")}`}
                      className="pl-12"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.labelKey}
                          href={child.href}
                          onClick={onClose}
                          className="block px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-landing-accent transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent"
                        >
                          {t(child.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent"
                >
                  <Icon
                    icon={item.icon}
                    className="w-6 h-6 text-gray-600 shrink-0"
                  />
                  <span className="text-base text-gray-900">
                    {t(item.labelKey)}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("landing.language.title")}
            </span>
            <div className="flex rounded-full border border-gray-300 p-0.5">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  normalizedLanguage === "en"
                    ? "bg-landing-accent text-white"
                    : "text-gray-700"
                } min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent`}
                onClick={() => i18n.changeLanguage("en")}
                aria-pressed={normalizedLanguage === "en"}
                aria-label="Change language to English"
              >
                EN
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  normalizedLanguage === "vi"
                    ? "bg-landing-accent text-white"
                    : "text-gray-700"
                } min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent`}
                onClick={() => i18n.changeLanguage("vi")}
                aria-pressed={normalizedLanguage === "vi"}
                aria-label="Change language to Vietnamese"
              >
                VI
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <Button
            onClick={() => onOpenAuth("login")}
            text={t("common.signIn")}
            className="flex-1 min-h-11 px-4 py-2.5 text-center text-gray-900 border border-gray-300 rounded-full font-medium bg-white hover:bg-gray-50 transition-colors text-sm"
          />
          <Button
            onClick={() => onOpenAuth("signup")}
            text={t("common.signUp")}
            className="flex-1 min-h-11 px-4 py-2.5 text-center bg-landing-accent text-white rounded-full font-medium hover:bg-landing-accent-hover transition-colors text-sm"
          />
        </div>
      </div>
    </div>
  );
};

/* ── Header ────────────────────────────────────────────────── */
export const LandingHeader = () => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useMobileMenu();
  const { width, breakpoints } = useWidth();
  const mdBreakpoint = breakpoints.md;
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"signup" | "login" | "forgot">(
    "signup",
  );
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpenRef = useRef(false);
  const normalizedLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .toLowerCase()
    .split("-")[0];
  const switchLanguage = () =>
    i18n.changeLanguage(normalizedLanguage === "vi" ? "en" : "vi");

  const openAuth = (view: "signup" | "login" | "forgot") => {
    setAuthView(view);
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (wasMenuOpenRef.current && !mobileMenuOpen) {
      menuButtonRef.current?.focus();
    }
    wasMenuOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen && width >= mdBreakpoint) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen, width, mdBreakpoint, setMobileMenuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-landing-heading focus:shadow-lg"
      >
        Skip to main content
      </a>
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
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.labelKey}
                href={link.href}
                className={`text-white font-semibold text-base lg:text-[20px] transition-colors hover:text-landing-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                  isActive ? "border-b-2 border-landing-accent" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <Button
            onClick={switchLanguage}
            className="flex items-center gap-1 text-white/60 font-semibold text-base lg:text-[20px] hover:text-white transition-colors bg-transparent"
            icon="heroicons-outline:chevron-down"
            iconPosition="right"
            text={normalizedLanguage.toUpperCase()}
            ariaLabel={`${t("landing.a11y.changeLanguage")} (${normalizedLanguage.toUpperCase()})`}
          />
          <Button
            onClick={() => openAuth("login")}
            text={t("common.signIn")}
            className="px-4 lg:px-5 py-2 lg:py-2.5 text-white font-semibold text-base lg:text-[20px] rounded-full hover:bg-white/10 transition-colors bg-transparent"
          />
          <Button
            onClick={() => openAuth("signup")}
            text={t("common.signUp")}
            className="px-5 lg:px-6 py-2 lg:py-2.5 bg-landing-accent text-white font-semibold text-base lg:text-[20px] rounded-full hover:bg-landing-accent-hover transition-colors"
          />
        </div>

        {/* Hamburger — mobile only (< 768 px) */}
        <button
          ref={menuButtonRef}
          type="button"
          className="md:hidden text-white bg-transparent p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={t("landing.a11y.openMenu")}
          aria-expanded={mobileMenuOpen}
          aria-controls="landing-mobile-menu"
        >
          <Icon icon="heroicons-outline:menu" className="w-7 h-7" />
        </button>
      </header>

      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuth={openAuth}
        dialogId="landing-mobile-menu"
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
