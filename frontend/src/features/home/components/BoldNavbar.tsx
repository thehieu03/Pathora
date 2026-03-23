"use client";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { FiGlobe, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/features/shared/components/AuthModal").then(m => m.AuthModal), { ssr: false });

const navLinks = [
  { labelKey: "landing.nav.home", href: "/home" },
  { labelKey: "landing.nav.aboutUs", href: "/about" },
  { labelKey: "landing.nav.tourPackages", href: "/tours" },
  { labelKey: "landing.nav.ourPolicies", href: "/policies" },
];

export const BoldNavbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"signup" | "login" | "forgot">("signup");

  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const normalizedLanguage = (i18n.resolvedLanguage || i18n.language || "en").toLowerCase().split("-")[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/home" className="flex items-center shrink-0">
              <span className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                Pathora
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  {mounted ? t(link.labelKey) : link.labelKey}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-sm text-white"
              >
                <FiGlobe className="w-4 h-4 text-white/70" />
                <span suppressHydrationWarning>{mounted ? normalizedLanguage.toUpperCase() : "EN"}</span>
                <FiChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${languageMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {!isAuth && (
                <>
                  <Button
                    onClick={() => { setAuthView("login"); setAuthOpen(true); }}
                    text="Sign In"
                    className="px-5 py-2.5 font-semibold text-sm text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
                  />
                  <Button
                    onClick={() => { setAuthView("signup"); setAuthOpen(true); }}
                    text="Book Now"
                    className="px-6 py-2.5 bg-[#fb8b02] text-white font-semibold text-sm rounded-full hover:shadow-lg hover:shadow-[#fb8b02]/30 transition-all"
                  />
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-[#0a0a1a] border-l border-white/10 p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-white">{t("landing.menu") || "Menu"}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {mounted ? t(link.labelKey) : link.labelKey}
                </Link>
              ))}
            </nav>
            {!isAuth && (
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  onClick={() => { setAuthView("signup"); setAuthOpen(true); setMobileMenuOpen(false); }}
                  text="Book Now"
                  className="w-full py-3 bg-[#fb8b02] text-white font-semibold rounded-full"
                />
              </div>
            )}
          </div>
          <div className="absolute inset-0 -left-full" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <AuthModal
        key={authView}
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};
