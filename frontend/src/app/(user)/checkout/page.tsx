import React from "react";
import dynamic from "next/dynamic";
import CheckoutLoading from "./loading";

const CheckoutPage = dynamic(
  () => import("@/features/checkout/components").then((m) => m.CheckoutPage),
  { loading: () => <CheckoutLoading /> },
);

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
