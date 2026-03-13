import dynamic from "next/dynamic";

const InsurancePage = dynamic(
  () => import("@/components/partials/dashboard/InsurancePage"),
);

export default function DashboardInsurancePage() {
  return <InsurancePage />;
}
