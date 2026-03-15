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
    <Link href={`/tours/${tour.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {tour.thumbnail ? (
            <Image
              src={tour.thumbnail}
              alt={tour.tourName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                {tour.classificationName}
              </span>
            </div>
          )}

          {/* Rating Badge */}
          {tour.rating && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-gray-700 rounded-full">
                <Icon
                  icon="heroicons-solid:star"
                  className="w-3.5 h-3.5 text-[#fa8b02]"
                />
                {tour.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <Icon icon="heroicons-outline:map-pin" className="w-4 h-4" />
            <span>{tour.location || t("common.noData", "N/A")}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-[#fa8b02] transition-colors">
            {tour.tourName}
          </h3>

          {/* Meta info / Duration */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Icon icon="heroicons-outline:clock" className="w-4 h-4" />
              <span>
                {tour.durationDays} {t("tourInstance.days", "days")}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-0.5 mt-2">
            {tour.salePrice > 0 && tour.salePrice < tour.price ? (
              <div className="flex items-baseline gap-2">
                 <span className="text-xl font-bold text-[#fa8b02]">
                  {formatCurrency(tour.salePrice)}
                </span>
                <span className="text-sm line-through text-gray-400">
                  {formatCurrency(tour.price)}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#fa8b02]">
                  {formatCurrency(tour.price)}
                </span>
                <span className="text-sm text-gray-400">
                   {t("tourInstance.perPersonShort", "/person")}
                </span>
              </div>
            )}
            {tour.salePrice > 0 && tour.salePrice < tour.price && (
              <span className="text-sm text-gray-400">
                {t("tourInstance.perPersonShort", "/person")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
