import dynamic from "next/dynamic";

const SettingsPage = dynamic(
  () => import("@/features/dashboard/components/SettingsPage"),
);

export default function DashboardSettingsPage() {
  return <SettingsPage />;
}
