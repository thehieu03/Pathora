import dynamic from "next/dynamic";

const BookingsPage = dynamic(
  () => import("@/components/partials/dashboard/BookingsPage"),
);

export default function DashboardBookingsPage() {
  return <BookingsPage />;
}
