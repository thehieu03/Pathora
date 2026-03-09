import React from "react";
import { TourDiscoveryPage } from "@/components/partials/tours";
import ToursLoading from "./loading";
import { ClientOnly } from "@/components/utils/ClientOnly";

export default function ToursPage() {
  return (
    <ClientOnly fallback={<ToursLoading />}>
      <TourDiscoveryPage />
    </ClientOnly>
  );
}
