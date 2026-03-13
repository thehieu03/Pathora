import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const readFile = (relativePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
};

const SIDEBAR_PAGES_WITH_LOGOUT = [
  "src/components/partials/dashboard/CustomersPage.tsx",
  "src/components/partials/dashboard/CreateTourInstancePage.tsx",
  "src/components/partials/dashboard/InsurancePage.tsx",
  "src/components/partials/dashboard/PaymentsPage.tsx",
  "src/components/partials/dashboard/SettingsPage.tsx",
  "src/components/partials/dashboard/TourDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceDetailPage.tsx",
  "src/components/partials/dashboard/TourInstanceListPage.tsx",
  "src/components/partials/dashboard/TourListPage.tsx",
  "src/components/partials/dashboard/VisaApplicationsPage.tsx",
];

describe("admin sidebar logout wiring", () => {
  it("uses the shared AdminLogoutButton on every admin sidebar", () => {
    SIDEBAR_PAGES_WITH_LOGOUT.forEach((filePath) => {
      const source = readFile(filePath);

      expect(source.includes("import { AdminLogoutButton }")).toBe(true);
      expect(source.includes("<AdminLogoutButton")).toBe(true);
    });
  });
});
