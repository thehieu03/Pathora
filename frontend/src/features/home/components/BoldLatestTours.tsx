"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Button } from "@/components/ui";
import Image from "next/image";

const latestTours = [
  { name: "Ninh Binh Boat Tour", price: "$79", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" },
  { name: "Phu Quoc Island Escape", price: "$199", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&q=80" },
  { name: "Hoi An Lantern Night", price: "$59", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80" },
  { name: "Cu Chi Tunnels Adventure", price: "$49", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80" },
  { name: "Da Lat Flower Garden", price: "$69", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80" },
];

export const BoldLatestTours = () => {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#050510]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`flex items-end justify-between mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="text-sm font-medium text-[#3b82f6] uppercase tracking-widest">
              {t("landing.latest.eyebrow") || "Just Added"}
            </span>
            <h2
              className="mt-3 text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {t("landing.latest.title") || "Latest Tours"}
            </h2>
          </div>
          <Button
            link="/tours"
            text={t("landing.latest.viewAll") || "View all"}
            icon="heroicons-outline:arrow-right"
            iconPosition="right"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all text-sm"
          />
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={ref}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {latestTours.map((tour, idx) => (
            <Link
              key={idx}
              href="/tours"
              className="snap-center shrink-0 w-64 group"
            >
              <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-[#111827]">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  sizes="256px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#fb8b02]/90 text-white text-xs font-semibold">
                  {tour.price}
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#fb8b02] transition-colors">
                {tour.name}
              </h3>
              <p className="text-white/40 text-xs flex items-center gap-1">
                View details <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
