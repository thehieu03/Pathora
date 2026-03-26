"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { tourService } from "@/api/services/tourService";
import TourForm from "@/features/dashboard/components/TourForm";
import type { TourDto } from "@/types/tour";
import { handleApiError } from "@/utils/apiResponse";

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<TourDto | null>(null);

  const loadTour = useCallback(async () => {
    if (!tourId) return;
    try {
      setLoading(true);
      const data = await tourService.getTourDetail(tourId);
      if (!data) {
        toast.error("Tour not found");
        router.push("/tour-management");
        return;
      }
      setTour(data);
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error("Failed to load tour:", handledError.message);
      toast.error("Failed to load tour");
      router.push("/tour-management");
    } finally {
      setLoading(false);
    }
  }, [tourId, router]);

  useEffect(() => {
    loadTour();
  }, [loadTour]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-16 rounded-xl bg-[var(--surface)] animate-pulse" />
        {/* Content skeleton */}
        <div className="h-96 rounded-xl bg-[var(--surface)] animate-pulse" />
      </div>
    );
  }

  if (!tour) {
    return null;
  }

  return (
    <TourForm
      mode="edit"
      initialData={tour}
      existingImages={tour.images ?? []}
      onSubmit={async (formData) => {
        await tourService.updateTour(formData);
        toast.success("Tour updated successfully!");
        router.push("/tour-management");
      }}
      onCancel={() => router.push("/tour-management")}
    />
  );
}
