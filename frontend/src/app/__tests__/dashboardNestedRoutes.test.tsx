import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import DashboardTourManagementPage from "../(dashboard)/dashboard/tour-management/page";
import DashboardCreateTourManagementPage from "../(dashboard)/dashboard/tour-management/create/page";
import DashboardTourInstancesPage from "../(dashboard)/dashboard/tour-instances/page";
import DashboardVisaPage from "../(dashboard)/dashboard/visa/page";
import DashboardCustomersPage from "../(dashboard)/dashboard/customers/page";
import DashboardInsurancePage from "../(dashboard)/dashboard/insurance/page";
import DashboardPaymentsPage from "../(dashboard)/dashboard/payments/page";
import DashboardSettingsPage from "../(dashboard)/dashboard/settings/page";

describe("dashboard nested routes", () => {
  beforeEach(() => {
    redirectMock.mockReset();
  });

  it("redirects legacy dashboard tour route to canonical tour management", () => {
    DashboardTourManagementPage();
    expect(redirectMock).toHaveBeenCalledWith("/tour-management");
  });

  it("redirects legacy dashboard create-tour route", () => {
    DashboardCreateTourManagementPage();
    expect(redirectMock).toHaveBeenCalledWith("/tour-management/create");
  });

  it("redirects legacy dashboard tour-instances route", () => {
    DashboardTourInstancesPage();
    expect(redirectMock).toHaveBeenCalledWith("/tour-instances");
  });

  it("redirects legacy dashboard visa route", () => {
    DashboardVisaPage();
    expect(redirectMock).toHaveBeenCalledWith("/visa");
  });

  it("renders payments placeholder page", () => {
    const markup = renderToStaticMarkup(<DashboardPaymentsPage />);
    expect(markup).toContain("Payments");
    expect(markup).toContain("under construction");
  });

  it("renders customers placeholder page", () => {
    const markup = renderToStaticMarkup(<DashboardCustomersPage />);
    expect(markup).toContain("Customers");
    expect(markup).toContain("under construction");
  });

  it("renders insurance placeholder page", () => {
    const markup = renderToStaticMarkup(<DashboardInsurancePage />);
    expect(markup).toContain("Insurance");
    expect(markup).toContain("under construction");
  });

  it("renders settings placeholder page", () => {
    const markup = renderToStaticMarkup(<DashboardSettingsPage />);
    expect(markup).toContain("Settings");
    expect(markup).toContain("under construction");
  });
});
