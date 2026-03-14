"use client";

import Link from "next/link";
import Image from "@/features/shared/components/LandingImage";
import { Icon } from "@/components/ui";
import { formatCurrency } from "@/utils/format";
import { NormalizedTourInstanceVm } from "@/types/tour";

interface TourInstanceCardProps {
  tour: NormalizedTourInstanceVm;
}

export const TourInstanceCard = ({ tour }: TourInstanceCardProps) => {
  const imageUrl = tour.thumbnail?.publicURL || "/images/placeholder-tour.jpg";
  const location = tour.location || "Unknown Location";

  return (
    <Link href={`/tours/instances/${tour.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={tour.tourName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
              {tour.classificationName || "Standard Tour"}
            </span>
          </div>
          {/* Status Badge */}
          {tour.status && (
            <div className="absolute top-3 right-3">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                tour.status === "available" ? "bg-green-100 text-green-700" :
                tour.status === "soldout" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {tour.status === "available" ? "Available" :
                 tour.status === "soldout" ? "Sold Out" :
                 tour.status}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <Icon icon="heroicons-outline:map-pin" className="w-4 h-4" />
            <span>{location}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#fa8b02] transition-colors">
            {tour.title || tour.tourName}
          </h3>

          {/* Dates */}
          {tour.startDate && tour.endDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Icon icon="heroicons-outline:calendar" className="w-4 h-4" />
              <span>
                {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Icon icon="heroicons-outline:clock" className="w-4 h-4" />
              <span>{tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="heroicons-outline:user-group" className="w-4 h-4" />
              <span>{tour.maxParticipation} max</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#fa8b02]">
              {formatCurrency(tour.price || tour.sellingPrice)}
            </span>
            <span className="text-sm text-gray-400">/ person</span>
          </div>

          {/* Available spots */}
          {tour.maxParticipation && (
            <div className="mt-2 text-sm text-gray-500">
              {tour.maxParticipation - (tour.registeredParticipants || 0)} spots remaining
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
