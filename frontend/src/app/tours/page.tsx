import React from "react";
import dynamic from "next/dynamic";
import ToursLoading from "./loading";

const TourDiscoveryPage = dynamic(() =>
  import("@/components/partials/landing").then((m) => m.TourDiscoveryPage),
  { loading: () => <ToursLoading /> },
);

export default function ToursPage() {
  return <TourDiscoveryPage />;
}
