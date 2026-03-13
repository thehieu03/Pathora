import dynamic from "next/dynamic";

const SettingsPage = dynamic(
  () => import("@/components/partials/dashboard/SettingsPage"),
);

export default function DashboardSettingsPage() {
  return <SettingsPage />;
}
