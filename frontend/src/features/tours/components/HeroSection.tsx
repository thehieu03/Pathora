"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";

export const HeroSection = () => {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const safeT = (key: string, fallback: string) => {
    return mounted ? t(key, fallback) : fallback;
  };

  return (
    <section className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
      {/* Background - Map pattern with gradient overlay */}
      <div className="absolute inset-0 bg-[#05073c]">
        {/* Map pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,7,60,0.4)] via-transparent to-[rgba(5,7,60,0.6)]" />

      {/* Compass decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 opacity-20 md:opacity-30">
        <svg suppressHydrationWarning viewBox="0 0 100 100" className="w-full h-full text-white">
          <circle suppressHydrationWarning cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle suppressHydrationWarning cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
          <path suppressHydrationWarning d="M50 10 L55 50 L50 45 L45 50 Z" fill="currentColor" />
          <path suppressHydrationWarning d="M50 90 L55 50 L50 55 L45 50 Z" fill="currentColor" />
          <path suppressHydrationWarning d="M10 50 L50 45 L45 50 L10 50 Z" fill="currentColor" opacity="0.5" />
          <path suppressHydrationWarning d="M90 50 L50 55 L55 50 L90 50 Z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm">
          <Link href="/home" className="text-white/50 hover:text-white transition-colors">
            {safeT("landing.nav.home", "Home")}
          </Link>
          <Icon icon="heroicons-outline:chevron-right" className="w-3.5 h-3.5 text-white/50" />
          <span className="text-white/80">{safeT("landing.tourDiscovery.packageTours", "Package Tours")}</span>
        </nav>

        {/* Main title */}
        <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-white leading-[1.2] mb-3">
          {safeT("landing.tourDiscovery.packageLabel", "Package")}{" "}
          <span className="text-[#fa8b02]">
            {safeT("landing.tourDiscovery.toursLabel", "Tours")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/70 max-w-[600px]">
          {safeT("landing.tourDiscovery.heroDescription", "Discover our curated travel packages and create your perfect adventure")}
        </p>
      </div>
    </section>
  );
};
