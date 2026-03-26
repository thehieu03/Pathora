"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TourForm from "@/features/dashboard/components/TourForm";
import { tourService } from "@/api/services/tourService";

export default function CreateTourPage() {
  const router = useRouter();

  return (
    <TourForm
      mode="create"
      onSubmit={async (formData) => {
        toast.loading("Creating tour...", { toastId: "creating-tour" });
        await tourService.createTour(formData);
        toast.dismiss("creating-tour");
        toast.success("Tour created successfully!");
        router.push("/tour-management");
      }}
      onCancel={() => router.push("/tour-management")}
    />
  );
}
