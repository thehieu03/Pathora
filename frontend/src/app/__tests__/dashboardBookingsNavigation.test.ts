import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

const dashboardNavFiles = [
  "src/components/partials/dashboard/AdminDashboardPage.tsx",
  "src/components/partials/dashboard/VisaApplicationsPage.tsx",
  "src/components/partials/dashboard/SettingsPage.tsx",
  "src/components/partials/dashboard/InsurancePage.tsx",
  "src/components/partials/dashboard/PaymentsPage.tsx",
  "src/components/partials/dashboard/CustomersPage.tsx",
  "src/components/partials/dashboard/TourListPage.tsx",
  "src/components/partials/dashboard/TourDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceListPage.tsx",
  "src/components/partials/dashboard/CreateTourInstancePage.tsx",
  "src/app/(dashboard)/tour-management/create/page.tsx",
];

describe("dashboard bookings navigation", () => {
  it("keeps booking navigation inside dashboard routes", () => {
    dashboardNavFiles.forEach((filePath) => {
      const source = readFile(filePath);

      expect(source.includes('href: "/dashboard/bookings"')).toBe(true);
      expect(source.includes('href: "/bookings"')).toBe(false);
    });
  });

  it("has a dedicated dashboard bookings route", () => {
    const source = readFile("src/app/(dashboard)/dashboard/bookings/page.tsx");

    expect(source.includes("DashboardBookingsPage")).toBe(true);
    expect(
      source.includes("@/components/partials/dashboard/BookingsPage"),
    ).toBe(true);
  });
});
