import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import ToursLoading from "./loading";

const TourDiscoveryPage = dynamic(
  () => import("@/features/tours/components").then((m) => m.TourDiscoveryPage),
  { loading: () => <ToursLoading /> },
);

export default function ToursPage() {
  return (
    <Suspense fallback={<ToursLoading />}>
      <TourDiscoveryPage />
    </Suspense>
  );
}
