import { DashboardPoliciesPage as DashboardPoliciesPageView } from "@/features/dashboard/components/DashboardPoliciesPage";
import { TourRequestAdminLayout } from "@/features/dashboard/components/TourRequestAdminLayout";

export default function DashboardPoliciesRoutePage() {
  return (
    <TourRequestAdminLayout
      title="Policies"
      subtitle="Review and manage pricing, deposit, cancellation, and visa policy rules"
    >
      <DashboardPoliciesPageView />
    </TourRequestAdminLayout>
  );
}
