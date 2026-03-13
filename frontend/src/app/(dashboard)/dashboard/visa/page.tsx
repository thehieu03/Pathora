import dynamic from "next/dynamic";

const VisaApplicationsPage = dynamic(
  () => import("@/components/partials/dashboard/VisaApplicationsPage"),
);

export default function DashboardVisaPage() {
  return <VisaApplicationsPage />;
}
