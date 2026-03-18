"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import { Icon } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  DashboardPolicyListItem,
  DashboardPolicyStatusFilter,
  DashboardPoliciesDataState,
} from "@/types/dashboardPolicy";

import {
  calculateDashboardPolicyMetrics,
  filterDashboardPolicies,
  getPrimaryPolicyCreateHref,
  getStatusVariant,
  getToggleActionLabel,
  loadDashboardPoliciesData,
} from "./dashboardPoliciesPageLogic";

const STATUS_FILTERS: DashboardPolicyStatusFilter[] = ["all", "active", "inactive"];

const formatUpdatedDate = (value: string | null): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

const isApiSuccess = (response: unknown): boolean => {
  if (!response || typeof response !== "object") {
    return false;
  }

  if ("success" in response && typeof response.success === "boolean") {
    return response.success;
  }

  if ("isSuccess" in response && typeof response.isSuccess === "boolean") {
    return response.isSuccess;
  }

  return false;
};

export function DashboardPoliciesPage() {
  const { t } = useTranslation();
  const [dataState, setDataState] = useState<DashboardPoliciesDataState>("loading");
  const [policies, setPolicies] = useState<DashboardPolicyListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<DashboardPolicyStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBusyKey, setActionBusyKey] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const loadPolicies = useCallback(async () => {
    setDataState("loading");
    setErrorMessage(null);

    const result = await loadDashboardPoliciesData();

    setPolicies(result.policies);
    setDataState(result.state);
    setErrorMessage(result.errorMessage);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPolicies();
  }, [loadPolicies]);

  const filteredPolicies = useMemo(() => {
    return filterDashboardPolicies(policies, {
      searchQuery: debouncedSearchQuery,
      statusFilter,
    });
  }, [debouncedSearchQuery, policies, statusFilter]);

  const metrics = useMemo(() => {
    return calculateDashboardPolicyMetrics(policies);
  }, [policies]);

  const hasActiveFilters =
    statusFilter !== "all" || debouncedSearchQuery.trim().length > 0;
  const isFilteredEmpty =
    dataState === "ready" && filteredPolicies.length === 0 && hasActiveFilters;

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleToggleStatus = async (policy: DashboardPolicyListItem) => {
    if (!policy.canToggleStatus || !policy.togglePayload) {
      return;
    }

    const confirmed = window.confirm(
      t(
        "dashboard.policies.confirmToggle",
        "Are you sure you want to change the status for this policy?",
      ),
    );

    if (!confirmed) {
      return;
    }

    setActionBusyKey(policy.rowKey);
    setErrorMessage(null);

    const response = await cancellationPolicyService.update(policy.togglePayload);
    if (isApiSuccess(response)) {
      await loadPolicies();
    } else {
      setErrorMessage(
        t(
          "dashboard.policies.errors.toggleFailed",
          "Unable to change policy status. Please try again.",
        ),
      );
    }

    setActionBusyKey(null);
  };

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t("dashboard.policies.title", "Policies")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t(
              "dashboard.policies.description",
              "Review and manage pricing, deposit, cancellation, and visa policy rules.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void loadPolicies();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Icon icon="heroicons:arrow-path" className="size-4" />
            {t("dashboard.policies.actions.refresh", "Refresh")}
          </button>
          <Link
            href="/dashboard/site-content"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Icon icon="heroicons:document-text" className="size-4" />
            {t("dashboard.siteContent.title", "Site Content")}
          </Link>
          <Link
            href={getPrimaryPolicyCreateHref()}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Icon icon="heroicons:plus" className="size-4" />
            {t("dashboard.policies.actions.create", "Create policy")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t("dashboard.policies.metrics.total", "Total policies")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.totalPolicies}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-sm text-emerald-700">
            {t("dashboard.policies.metrics.active", "Active")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-800">{metrics.activePolicies}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <p className="text-sm text-slate-600">
            {t("dashboard.policies.metrics.inactive", "Inactive")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">{metrics.inactivePolicies}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t("dashboard.policies.metrics.categories", "Policy categories")}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {t("dashboard.policies.types.pricing", "Pricing")}: {metrics.typeCounts.pricing} · {" "}
            {t("dashboard.policies.types.deposit", "Deposit")}: {metrics.typeCounts.deposit} · {" "}
            {t("dashboard.policies.types.cancellation", "Cancellation")}: {metrics.typeCounts.cancellation} · {" "}
            {t("dashboard.policies.types.visa", "Visa")}: {metrics.typeCounts.visa}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Icon
              icon="heroicons:magnifying-glass"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t(
                "dashboard.policies.searchPlaceholder",
                "Search by policy name, type, or scope",
              )}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t(
                    `dashboard.policies.filters.${filter}`,
                    filter.charAt(0).toUpperCase() + filter.slice(1),
                  )}
                </button>
              );
            })}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {t("dashboard.policies.actions.reset", "Reset")}
              </button>
            )}
          </div>
        </div>
      </div>

      {dataState === "loading" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
          {t("dashboard.policies.states.loading", "Loading policy data...")}
        </div>
      )}

      {dataState === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
          <p>{errorMessage || t("dashboard.policies.errors.loadFailed", "Unable to load policies.")}</p>
          <button
            type="button"
            onClick={() => {
              void loadPolicies();
            }}
            className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            {t("dashboard.policies.actions.retry", "Retry")}
          </button>
        </div>
      )}

      {dataState === "empty" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-slate-800">
            {t("dashboard.policies.states.emptyTitle", "No policies found")}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {t(
              "dashboard.policies.states.emptyDescription",
              "Create your first policy to start configuring business rules.",
            )}
          </p>
          <Link
            href={getPrimaryPolicyCreateHref()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Icon icon="heroicons:plus" className="size-4" />
            {t("dashboard.policies.actions.create", "Create policy")}
          </Link>
        </div>
      )}

      {isFilteredEmpty && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-slate-800">
            {t("dashboard.policies.states.filteredEmptyTitle", "No matching policies")}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {t(
              "dashboard.policies.states.filteredEmptyDescription",
              "Try another keyword or reset filters to see all policies.",
            )}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("dashboard.policies.actions.reset", "Reset")}
          </button>
        </div>
      )}

      {dataState === "ready" && filteredPolicies.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.policy", "Policy")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.type", "Type")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.scope", "Scope")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.status", "Status")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.updated", "Last updated")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.policies.table.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.rowKey} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 align-top">
                      <p className="text-sm font-semibold text-slate-900">{policy.title}</p>
                      <p className="text-xs text-slate-500">{policy.subtitle}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{policy.typeLabel}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{policy.scope}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusVariant(policy.status)}`}
                      >
                        {policy.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatUpdatedDate(policy.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={policy.viewHref}
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          {t("dashboard.policies.actions.view", "View")}
                        </Link>
                        <Link
                          href={policy.editHref}
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          {t("dashboard.policies.actions.edit", "Edit")}
                        </Link>
                        <button
                          type="button"
                          disabled={!policy.canToggleStatus || actionBusyKey === policy.rowKey}
                          title={policy.toggleBlockedReason ?? undefined}
                          onClick={() => {
                            void handleToggleStatus(policy);
                          }}
                          className="rounded-md border border-orange-200 px-2.5 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                        >
                          {actionBusyKey === policy.rowKey
                            ? t("dashboard.policies.actions.updating", "Updating...")
                            : getToggleActionLabel(policy)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.rowKey}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{policy.title}</p>
                    <p className="text-xs text-slate-500">{policy.subtitle}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusVariant(policy.status)}`}
                  >
                    {policy.statusLabel}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <dt className="text-slate-500">{t("dashboard.policies.table.type", "Type")}</dt>
                    <dd className="font-medium text-slate-700">{policy.typeLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t("dashboard.policies.table.scope", "Scope")}</dt>
                    <dd className="font-medium text-slate-700">{policy.scope}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t("dashboard.policies.table.updated", "Last updated")}</dt>
                    <dd className="font-medium text-slate-700">
                      {formatUpdatedDate(policy.updatedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t("dashboard.policies.table.destination", "Management")}</dt>
                    <dd className="font-medium text-slate-700">{policy.manageHref}</dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={policy.viewHref}
                    className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {t("dashboard.policies.actions.view", "View")}
                  </Link>
                  <Link
                    href={policy.editHref}
                    className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {t("dashboard.policies.actions.edit", "Edit")}
                  </Link>
                  <button
                    type="button"
                    disabled={!policy.canToggleStatus || actionBusyKey === policy.rowKey}
                    title={policy.toggleBlockedReason ?? undefined}
                    onClick={() => {
                      void handleToggleStatus(policy);
                    }}
                    className="rounded-md border border-orange-200 px-2.5 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {actionBusyKey === policy.rowKey
                      ? t("dashboard.policies.actions.updating", "Updating...")
                      : getToggleActionLabel(policy)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
