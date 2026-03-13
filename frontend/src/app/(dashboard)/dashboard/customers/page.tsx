import dynamic from "next/dynamic";

const CustomersPage = dynamic(
  () => import("@/components/partials/dashboard/CustomersPage"),
);

export default function DashboardCustomersPage() {
  return <CustomersPage />;
}
