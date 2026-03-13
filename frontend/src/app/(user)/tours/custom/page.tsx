import React from "react";
import dynamic from "next/dynamic";
import CustomTourLoading from "./loading";

const CustomTourPage = dynamic(
  () =>
    import("@/components/partials/custom-tour").then((m) => m.CustomTourPage),
  { loading: () => <CustomTourLoading /> },
);

export default function CustomTour() {
  return <CustomTourPage />;
}
