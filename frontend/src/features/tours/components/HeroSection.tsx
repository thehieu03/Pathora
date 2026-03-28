"use client";

import Link from "next/link";
import Image from "@/features/shared/components/LandingImage";
import { Icon } from "@/components/ui";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80&auto=format&fit=crop";
const HERO_BLUR_URL =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=20&q=10&auto=format&fit=crop";

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
      {/* Background image — Ha Long Bay aerial */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE_URL}
          alt=""
          fill
          priority
          placeholder="blur"
          blurDataURL={HERO_BLUR_URL}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,60,0.7) 0%, rgba(5,7,60,0.4) 50%, rgba(5,7,60,0.8) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm"
        >
          <Link
            href="/home"
            className="text-white/50 hover:text-white transition-colors"
          >
            {safeT("landing.nav.home", "Home")}
          </Link>
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-3.5 h-3.5 text-white/50"
          />
          <span className="text-white/80">
            {safeT("landing.tourDiscovery.packageTours", "Package Tours")}
          </span>
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
          {safeT(
            "landing.tourDiscovery.heroDescription",
            "Discover our curated travel packages and create your perfect adventure",
          )}
        </p>
      </div>
    </section>
  );
};
