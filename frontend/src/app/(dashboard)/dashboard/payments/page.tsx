import dynamic from "next/dynamic";

const PaymentsPage = dynamic(
  () => import("@/components/partials/dashboard/PaymentsPage"),
);

export default function DashboardPaymentsPage() {
  return <PaymentsPage />;
}
