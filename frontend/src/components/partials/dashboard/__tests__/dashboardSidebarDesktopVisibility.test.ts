import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const DASHBOARD_SIDEBAR_FILES = [
  "src/components/partials/dashboard/AdminDashboardPage.tsx",
  "src/components/partials/dashboard/BookingsPage.tsx",
  "src/components/partials/dashboard/CreateTourInstancePage.tsx",
  "src/components/partials/dashboard/CustomersPage.tsx",
  "src/components/partials/dashboard/InsurancePage.tsx",
  "src/components/partials/dashboard/PaymentsPage.tsx",
  "src/components/partials/dashboard/SettingsPage.tsx",
  "src/components/partials/dashboard/TourDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceListPage.tsx",
  "src/components/partials/dashboard/TourListPage.tsx",
  "src/components/partials/dashboard/VisaApplicationsPage.tsx",
  "src/app/(dashboard)/tour-management/create/page.tsx",
];

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

describe("dashboard sidebar desktop visibility", () => {
  it("keeps sidebar visible on desktop and only hides it on mobile when closed", () => {
    DASHBOARD_SIDEBAR_FILES.forEach((filePath) => {
      const source = readFile(filePath);

      expect(
        source.includes('open ? "translate-x-0" : "max-lg:-translate-x-full"'),
      ).toBe(true);
      expect(source.includes('open ? "translate-x-0" : "-translate-x-full"')).toBe(false);
    });
  });
});
