"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { BoldTiltCard } from "./BoldTiltCard";

const destinations = [
  { name: "Hanoi", country: "Vietnam", image: "https://images.unsplash.com/photo-1509030969356-4dd11f51c5e8?w=600&q=80", tours: 120 },
  { name: "Ho Chi Minh City", country: "Vietnam", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80", tours: 95 },
  { name: "Da Nang", country: "Vietnam", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80", tours: 78 },
  { name: "Hue", country: "Vietnam", image: "https://images.unsplash.com/photo-1584979093722-1be5c7c0c35f?w=600&q=80", tours: 45 },
  { name: "Mekong Delta", country: "Vietnam", image: "https://images.unsplash.com/photo-1583425921686-c5daf6b3d820?w=600&q=80", tours: 62 },
];

export const BoldTrendingDestinations = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 md:py-28 bg-[#0a0a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={titleRef}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="text-sm font-medium text-[#fb8b02] uppercase tracking-widest mb-3 block">
              {t("landing.destinations.eyebrow") || "Explore"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {t("landing.destinations.title") || "Trending Destinations"}
            </h2>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium group"
          >
            {t("landing.destinations.viewAll") || "View all destinations"}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {destinations.map((dest, idx) => (
            <div
              key={dest.name}
              className="snap-center shrink-0"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <BoldTiltCard
                image={dest.image}
                title={dest.name}
                subtitle={dest.country}
                badge={`${dest.tours} ${t("landing.destinations.tours") || "tours"}`}
                href="/tours"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
