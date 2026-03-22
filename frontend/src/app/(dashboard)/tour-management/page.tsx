import type { Metadata } from "next";
import { TourListPage } from "@/features/dashboard/components/TourListPage";

export const metadata: Metadata = {
  title: "Tour Management | Pathora",
  description: "Manage tours, create new tours, and update tour information in Pathora admin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TourManagementPage() {
  return <TourListPage />;
}
