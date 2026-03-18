import dynamic from "next/dynamic";

const SiteContentManagementPage = dynamic(
  () => import("@/features/dashboard/components/SiteContentManagementPage"),
);

export default function DashboardSiteContentPage() {
  return <SiteContentManagementPage />;
}
