"use client";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useCountUp } from "../hooks/useCountUp";

const stats = [
  { value: 1200, suffix: "+", labelKey: "landing.stats.items.totalTours" },
  { value: 50000, suffix: "+", labelKey: "landing.stats.items.totalTravellers" },
  { value: 4.9, suffix: "★", labelKey: "landing.reviews.rating", isDecimal: true },
  { value: 24, suffix: "/7", labelKey: "landing.stats.items.support" },
];

function StatItem({ stat, isVisible, t }: { stat: typeof stats[0]; isVisible: boolean; t: (key: string) => string }) {
  const countValue = useCountUp(
    { end: stat.value, duration: 2000, suffix: stat.suffix },
    isVisible
  );

  return (
    <div className="flex flex-col items-center justify-center py-4 md:px-8">
      <span
        className="text-3xl md:text-4xl font-bold text-white mb-1"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {stat.isDecimal ? stat.value + stat.suffix : countValue}
      </span>
      <span className="text-sm text-white/40 uppercase tracking-wider">
        {t(stat.labelKey)}
      </span>
    </div>
  );
}

export const BoldStatsStrip = () => {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative py-6 bg-[#0a0a1a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {stats.map((stat, idx) => (
            <StatItem key={idx} stat={stat} isVisible={isVisible} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};
