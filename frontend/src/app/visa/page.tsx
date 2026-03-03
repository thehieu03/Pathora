import React from "react";
import dynamic from "next/dynamic";
import VisaLoading from "./loading";

const VisaApplicationPage = dynamic(
  () =>
    import("@/components/partials/landing").then((m) => m.VisaApplicationPage),
  { loading: () => <VisaLoading /> },
);

export default function VisaRoute() {
  return <VisaApplicationPage />;
}
