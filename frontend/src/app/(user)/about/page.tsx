import React from "react";
import dynamic from "next/dynamic";
import AboutLoading from "./loading";

const AboutUsPage = dynamic(
  () => import("@/features/about/components").then((m) => m.AboutUsPage),
  { loading: () => <AboutLoading /> },
);

export default function About() {
  return <AboutUsPage />;
}
