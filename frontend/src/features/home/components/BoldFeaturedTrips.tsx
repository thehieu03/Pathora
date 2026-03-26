"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { BoldTiltCard } from "./BoldTiltCard";

const featuredTours = [
  {
    id: 1,
    name: "Ha Long Bay 3-Day Adventure",
    duration: "3 days",
    price: "$299",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    size: "large",
  },
  {
    id: 2,
    name: "Sapa Mountain Trek",
    duration: "2 days",
    price: "$149",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
    size: "medium",
  },
  {
    id: 3,
    name: "Mekong Delta Explorer",
    duration: "4 days",
    price: "$399",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583425921686-c5daf6b3d820?w=600&q=80",
    size: "medium",
  },
  {
    id: 4,
    name: "Hue Imperial City Tour",
    duration: "1 day",
    price: "$89",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584979093722-1be5c7c0c35f?w=800&q=80",
    size: "wide",
  },
];

export const BoldFeaturedTrips = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section className="py-20 md:py-28 bg-[#0a0a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={titleRef}
          className={`text-center mb-14 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-sm font-medium text-[#ec4899] uppercase tracking-widest">
            {t("landing.featured.eyebrow") || "Handpicked"}
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            {t("landing.featured.title") || "Featured Adventures"}
          </h2>
        </div>

        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[300px] transition-all duration-1000 ${
            gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {featuredTours.map((tour) => {
            const sizeClass =
              tour.size === "large"
                ? "md:col-span-2 row-span-2"
                : tour.size === "wide"
                  ? "md:col-span-2"
                  : "";

            return (
              <div key={tour.id} className={sizeClass}>
                <BoldTiltCard
                  image={tour.image}
                  title={tour.name}
                  subtitle={tour.duration}
                  badge={`${tour.rating}★`}
                  price={tour.price}
                  href="/tours"
                  height={tour.size === "large" ? "h-full" : "h-[300px]"}
                  width="w-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
