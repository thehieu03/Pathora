import React from "react";
import dynamic from "next/dynamic";
import BookingsLoading from "./loading";

const BookingHistoryPage = dynamic(
  () =>
    import("@/components/partials/bookings").then((m) => m.BookingHistoryPage),
  { loading: () => <BookingsLoading /> },
);

export default function BookingsRoute() {
  return <BookingHistoryPage />;
}
