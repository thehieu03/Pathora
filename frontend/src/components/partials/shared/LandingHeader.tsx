"use client";
import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "./LandingImage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Icon } from "@/components/ui";
import dynamic from "next/dynamic";
import { Transition, TransitionChild } from "@headlessui/react";

const AuthModal = dynamic(
  () => import("./AuthModal").then((m) => m.AuthModal),
  { ssr: false },
);
import { useTranslation } from "react-i18next";
import useMobileMenu from "@/hooks/useMobileMenu";
import useWidth from "@/hooks/useWidth";
import type { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import useDarkmode from "@/hooks/useDarkMode";
import { handleCustomizer } from "@/store/layout";
import { useLogoutMutation } from "@/store/api/auth/authApiSlice";
import LogoDark from "@/assets/images/logo/logo.png";
import LogoLight from "@/assets/images/logo/logo-white.svg";
import {
  FiGlobe,
  FiChevronDown,
  FiCheck,
  FiSun,
  FiMoon,
  FiSliders,
  FiLogOut,
} from "react-icons/fi";

const languages = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

const navLinks = [
  { labelKey: "landing.nav.home", href: "/" },
  { labelKey: "landing.nav.aboutUs", href: "/about" },
  { labelKey: "landing.nav.tourPackages", href: "/tours" },
  { labelKey: "landing.nav.ourPolicies", href: "/policies" },
];

const sidebarLinks = [
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

const configuredRemoteImageHosts = new Set(
  (process.env.NEXT_PUBLIC_REMOTE_IMAGE_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      try {
        const normalized = entry.includes("://")
          ? entry
          : `https://${entry.replace(/^\/\//, "")}`;
        return new URL(normalized).hostname.toLowerCase();
      } catch {
        return "";
      }
    })
    .filter(Boolean),
);

const canUseNextImage = (src: string) => {
  try {
    const url = new URL(src);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    return configuredRemoteImageHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
};

const AvatarImage = ({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) => {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- fallback for non-allowlisted user avatar hosts */
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover"
    />
  );
};

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
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
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

  const menuTitleId = `${dialogId}-title`;

  return (
    <Transition show={open} as={Fragment}>
      <div className="fixed inset-0 z-100 md:hidden">
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label={t("landing.a11y.closeNavigationMenu")}
          />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="transform transition duration-300 ease-out"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition duration-200 ease-in"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full">
          <div
            ref={panelRef}
            id={dialogId}
            className="absolute top-0 left-0 bottom-0 w-75 max-w-[85vw] bg-white flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuTitleId}
            tabIndex={-1}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
              <Button
                onClick={onClose}
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-transparent"
                icon="heroicons-outline:chevron-left"
                iconClass="text-[20px] text-gray-700"
                ariaLabel={t("landing.a11y.closeMenu")}
              />
              <h2
                id={menuTitleId}
                className="text-xl font-medium text-gray-900">
                {t("landing.sidebar.dashboard")}
              </h2>
            </div>

            {/* User info */}
            {isAuth && (
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
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2" aria-label="Sidebar">
              {sidebarLinks.map((item) => (
                <div key={item.labelKey}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent">
                    <Icon
                      icon={item.icon}
                      className="w-6 h-6 text-gray-600 shrink-0"
                    />
                    <span className="text-base text-gray-900">
                      {t(item.labelKey)}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>

            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {t("landing.language.title")}
                </span>
                <div className="flex rounded-full border border-gray-300 p-0.5">
                  <Button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      normalizedLanguage === "en"
                        ? "bg-landing-accent text-white"
                        : "text-gray-700"
                    } min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent`}
                    onClick={() => i18n.changeLanguage("en")}
                    aria-pressed={normalizedLanguage === "en"}
                    aria-label="Change language to English">
                    EN
                  </Button>
                  <Button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      normalizedLanguage === "vi"
                        ? "bg-landing-accent text-white"
                        : "text-gray-700"
                    } min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent`}
                    onClick={() => i18n.changeLanguage("vi")}
                    aria-pressed={normalizedLanguage === "vi"}
                    aria-label="Change language to Vietnamese">
                    VI
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isAuth && (
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
            )}
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};

/* ── Header ────────────────────────────────────────────────── */
export const LandingHeader = ({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) => {
  const isSolid = variant === "solid";
  const { t, i18n } = useTranslation();
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const customizerOpen = useSelector(
    (state: RootState) => state.layout.customizer,
  );
  const dispatch = useDispatch();
  const [isDark, setDarkMode] = useDarkmode();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  // useSyncExternalStore is the React-recommended way to detect client mount
  // without hydration mismatch — returns false on server, true on client
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Use mounted to prevent SSR/client hydration mismatch for auth state
  const clientIsAuth = mounted && isAuth;

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const refreshToken =
      (typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((r) => r.startsWith("refresh_token="))
            ?.split("=")[1]
        : undefined) ?? "";
    try {
      await logout({ refreshToken }).unwrap();
    } catch {
      // logOut is dispatched inside the mutation's onQueryStarted
    }
    router.push("/home");
  };
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useMobileMenu();
  const { width, breakpoints } = useWidth();
  const mdBreakpoint = breakpoints.md;
  const searchParams = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"signup" | "login" | "forgot">(
    "signup",
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (searchParams.get("login") === "true" && !authOpen) {
      timer = setTimeout(() => {
        setAuthView("login");
        setAuthOpen(true);
        // Clean up the URL query param
        const url = new URL(window.location.href);
        url.searchParams.delete("login");
        router.replace(url.pathname, { scroll: false });
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchParams, authOpen, router]);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const languageMenuId = "landing-language-menu";
  const userMenuId = "landing-user-menu";
  const normalizedLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .toLowerCase()
    .split("-")[0];
  const userDisplayName = user?.fullName ?? user?.username ?? "";
  const userInitial = (userDisplayName || "U")[0].toUpperCase();
  const userAvatarAlt = userDisplayName
    ? `${userDisplayName} avatar`
    : "User avatar";
  const logoSource = isSolid ? LogoDark : LogoLight;

  const openAuth = (view: "signup" | "login" | "forgot") => {
    setAuthView(view);
    setAuthOpen(true);
    setMobileMenuOpen(false);
    setLanguageMenuOpen(false);
    setUserMenuOpen(false);
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

  useEffect(() => {
    if (!languageMenuOpen && !userMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        languageMenuOpen &&
        languageMenuRef.current &&
        !languageMenuRef.current.contains(target)
      ) {
        setLanguageMenuOpen(false);
      }
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [languageMenuOpen, userMenuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-landing-heading focus:shadow-lg">
        Skip to main content
      </a>
      <header
        className={`${
          isSolid
            ? "relative bg-white dark:bg-slate-900 shadow-sm border-b border-landing-border dark:border-slate-700"
            : "absolute top-0 left-0 right-0 bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
        } z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 lg:px-12 py-4 md:py-5 min-h-17.5 md:h-32`}>
        <Link
          href="/"
          className="flex items-center shrink-0 justify-self-start">
          <div className="relative h-12 md:h-25 w-28 md:w-34">
            <Image
              src={logoSource}
              alt="Pathora logo"
              fill
              sizes="(max-width: 768px) 112px, 136px"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop nav — visible from md (>=768px) */}
        <nav
          className="hidden md:flex items-center gap-2 xl:gap-3 justify-self-center"
          aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.labelKey}
                href={link.href}
                onMouseEnter={() => router.prefetch(link.href)}
                onFocus={() => router.prefetch(link.href)}
                className={`inline-flex w-28 xl:w-36 justify-center overflow-hidden whitespace-nowrap text-ellipsis ${isSolid ? "text-landing-heading" : "text-white"} font-semibold text-sm xl:text-[20px] transition-colors hover:text-landing-accent focus:outline-none focus-visible:ring-2 ${isSolid ? "focus-visible:ring-landing-heading" : "focus-visible:ring-white"} rounded ${
                  isActive ? "border-b-2 border-landing-accent" : ""
                }`}
                aria-current={isActive ? "page" : undefined}>
                {mounted
                  ? t(link.labelKey)
                  : link.labelKey === "landing.nav.home"
                    ? "Home"
                    : link.labelKey === "landing.nav.aboutUs"
                      ? "About Us"
                      : link.labelKey === "landing.nav.tourPackages"
                        ? "Tours"
                        : link.labelKey === "landing.nav.ourPolicies"
                          ? "Docs"
                          : ""}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 xl:gap-3 justify-self-end">
          {/* Dark mode toggle — render icon only after mount to prevent
              browser extensions (e.g. Dark Reader) from mutating the SSR HTML */}
          <Button
            type="button"
            onClick={() => setDarkMode(!isDark)}
            className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all bg-transparent focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${isSolid ? "border-gray-200 text-gray-600 hover:text-landing-heading hover:border-gray-400 focus-visible:ring-landing-heading" : "border-white/20 text-white/70 hover:text-white hover:border-white/40 focus-visible:ring-white"}`}
            aria-label={
              mounted && isDark ? "Switch to light mode" : "Switch to dark mode"
            }>
            {mounted ? (
              isDark ? (
                <FiSun className="w-4 h-4 xl:w-5 xl:h-5" />
              ) : (
                <FiMoon className="w-4 h-4 xl:w-5 xl:h-5" />
              )
            ) : (
              <span className="w-4 h-4 xl:w-5 xl:h-5" />
            )}
          </Button>

          {/* Live mode (customizer) toggle */}
          <Button
            type="button"
            onClick={() => dispatch(handleCustomizer(!customizerOpen))}
            className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${
              customizerOpen
                ? "border-landing-accent text-landing-accent bg-landing-accent/10"
                : isSolid
                  ? "border-gray-200 text-gray-600 hover:text-landing-heading hover:border-gray-400 bg-transparent focus-visible:ring-landing-heading"
                  : "border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent focus-visible:ring-white"
            }`}
            aria-label="Toggle live customizer">
            {mounted ? (
              <FiSliders className="w-4 h-4 xl:w-5 xl:h-5" />
            ) : (
              <span className="w-4 h-4 xl:w-5 xl:h-5" />
            )}
          </Button>

          {/* Language switcher */}
          <div className="relative" ref={languageMenuRef}>
            <Button
              type="button"
              suppressHydrationWarning
              className={`min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all bg-transparent focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${isSolid ? "border-gray-200 text-gray-600 hover:text-landing-heading hover:border-gray-400 focus-visible:ring-landing-heading" : "border-white/20 text-white/70 hover:text-white hover:border-white/40 focus-visible:ring-white"}`}
              onClick={() => {
                setLanguageMenuOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              aria-label={`${t("landing.a11y.changeLanguage")} (${mounted ? normalizedLanguage.toUpperCase() : "EN"})`}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              aria-controls={languageMenuId}>
              {mounted ? (
                <FiGlobe className="w-4 h-4 xl:w-5 xl:h-5" />
              ) : (
                <span className="w-4 h-4 xl:w-5 xl:h-5" />
              )}
              <span className="text-sm xl:text-base font-semibold">
                {mounted ? normalizedLanguage.toUpperCase() : "EN"}
              </span>
              {mounted ? (
                <FiChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    languageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              ) : (
                <span className="w-3.5 h-3.5" />
              )}
            </Button>
            <div
              id={languageMenuId}
              role="menu"
              className={`absolute right-0 top-full mt-2 min-w-40 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 py-1.5 overflow-hidden z-50 transition-all duration-200 ${
                languageMenuOpen
                  ? "visible opacity-100 pointer-events-auto"
                  : "invisible opacity-0 pointer-events-none"
              }`}>
              {languages.map((lang) => {
                const isActive = mounted && lang.code === normalizedLanguage;
                return (
                  <Button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent cursor-pointer ${
                      isActive
                        ? "bg-landing-accent/10 text-landing-accent font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <span>{lang.label}</span>
                    {isActive && (
                      <FiCheck className="w-4 h-4" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Avatar dropdown — shown when logged in */}
          {clientIsAuth && (
            <div className="relative" ref={userMenuRef}>
              <Button
                type="button"
                onClick={() => {
                  setUserMenuOpen((prev) => !prev);
                  setLanguageMenuOpen(false);
                }}
                className={`w-11 h-11 rounded-full border-2 hover:border-landing-accent overflow-hidden transition-all bg-gray-300 flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${isSolid ? "border-gray-300 focus-visible:ring-landing-heading" : "border-white/40 focus-visible:ring-white"}`}
                aria-label="User menu"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-controls={userMenuId}>
                {user?.avatar ? (
                  <AvatarImage
                    src={user.avatar}
                    alt={userAvatarAlt}
                    size={44}
                  />
                ) : (
                  <span className="text-sm font-bold text-white select-none">
                    {userInitial}
                  </span>
                )}
              </Button>

              {/* Dropdown */}
              <div
                id={userMenuId}
                role="menu"
                className={`absolute right-0 top-full mt-2 w-60 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 ${
                  userMenuOpen
                    ? "visible opacity-100 pointer-events-auto"
                    : "invisible opacity-0 pointer-events-none"
                }`}>
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-landing-accent flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <AvatarImage
                        src={user.avatar}
                        alt={userAvatarAlt}
                        size={36}
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {userInitial}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.fullName ?? user?.username ?? ""}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="border-t border-gray-100 py-1">
                  <Button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer">
                    <FiLogOut className="w-4 h-4 shrink-0" />
                    <span>{t("common.signOut") || "Đăng xuất"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          {!clientIsAuth && (
            <>
              <Button
                onClick={() => openAuth("login")}
                text={mounted ? t("common.signIn") : "Sign In"}
                className={`w-30 xl:w-36 px-4 xl:px-5 py-2 xl:py-2.5 font-semibold text-sm xl:text-[20px] rounded-full transition-colors ${isSolid ? "text-landing-heading hover:bg-gray-100 bg-transparent" : "text-white hover:bg-white/10 bg-transparent"}`}
              />
              <Button
                onClick={() => openAuth("signup")}
                text={mounted ? t("common.signUp") : "Sign Up"}
                className="w-30 xl:w-36 px-5 xl:px-6 py-2 xl:py-2.5 bg-landing-accent text-white font-semibold text-sm xl:text-[20px] rounded-full hover:bg-landing-accent-hover transition-colors"
              />
            </>
          )}
        </div>

        {/* Hamburger — mobile (< 768px) */}
        <Button
          ref={menuButtonRef}
          type="button"
          className={`md:hidden justify-self-end w-11 h-11 flex items-center justify-center bg-transparent rounded focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${isSolid ? "text-landing-heading focus-visible:ring-landing-heading" : "text-white focus-visible:ring-white"}`}
          onClick={() => setMobileMenuOpen(true)}
          aria-label={t("landing.a11y.openMenu")}
          aria-expanded={mobileMenuOpen}
          aria-controls="landing-mobile-menu">
          <Icon icon="heroicons-outline:menu" className="w-7 h-7" />
        </Button>
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

