"use client";

import Link from "next/link";
import Image from "@/features/shared/components/LandingImage";
import { Icon } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/format";
import { SearchTour } from "@/types/home";

interface TourCardProps {
  tour: SearchTour;
}

export const TourCard = ({ tour }: TourCardProps) => {
  const { t } = useTranslation();

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {tour.thumbnail ? (
          <Image
            src={tour.thumbnail}
            alt={tour.tourName}
            fill
            sizes="(max-width: 767px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#05073c] to-[#1a1c5e] flex items-center justify-center">
            <Icon
              icon="heroicons-outline:calendar-days"
              className="w-10 h-10 text-white/40"
            />
          </div>
        )}

        {/* Classification badge */}
        {tour.classificationName && (
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {tour.classificationName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location & Rating */}
        <div className="flex items-center justify-between mb-2">
          {tour.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Icon
                icon="heroicons-solid:map-pin"
                className="w-3 h-3 shrink-0"
              />
              <span>{tour.location}</span>
            </div>
          )}
          {tour.rating && (
            <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 px-2 py-0.5 rounded-full">
              <Icon
                icon="heroicons-solid:star"
                className="w-3 h-3 text-[#fa8b02]"
              />
              {tour.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 min-h-[40px]">
          {tour.tourName}
        </h3>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 text-xs text-gray-600 px-2 py-0.5 rounded-full">
            <Icon
              icon="heroicons-outline:clock"
              className="w-3 h-3 text-gray-500"
            />
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            <span>{t("landing.tourDiscovery.from", "From")} </span>
            {tour.salePrice > 0 && tour.salePrice < tour.price ? (
              <>
                <span className="text-sm font-bold text-[#fa8b02]">
                  {formatCurrency(tour.salePrice)}
                </span>
                <span className="ml-1 line-through text-[11px] text-gray-400">
                  {formatCurrency(tour.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(tour.price)}
              </span>
            )}
            <span> /pax</span>
          </p>
          <Link
            href={`/tours/${tour.id}`}
            className="w-[26px] h-[26px] bg-orange-50 rounded-[10px] flex items-center justify-center hover:bg-[#fa8b02] group/arrow transition-colors"
          >
            <Icon
              icon="heroicons-outline:arrow-right"
              className="w-3.5 h-3.5 text-[#fa8b02] group-hover/arrow:text-white transition-colors"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};
