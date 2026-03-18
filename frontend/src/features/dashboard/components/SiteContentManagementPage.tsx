"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { siteContentAdminService } from "@/api/services/siteContentAdminService";
import { Icon } from "@/components/ui";
import type {
  SiteContentAdminDetailItem,
  SiteContentAdminListItem,
} from "@/types/siteContent";

const formatDate = (value: string | null): string => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString();
};

const tryValidateJson = (value: string): string | null => {
  if (!value.trim()) {
    return "empty";
  }

  try {
    JSON.parse(value);
    return null;
  } catch {
    return "invalid";
  }
};

export function SiteContentManagementPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<SiteContentAdminListItem[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(true);
  const [rowsError, setRowsError] = useState<string | null>(null);
  const [pageKeyFilter, setPageKeyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SiteContentAdminDetailItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [englishContentValue, setEnglishContentValue] = useState("");
  const [vietnameseContentValue, setVietnameseContentValue] = useState("");
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadRows = useCallback(async () => {
    setIsLoadingRows(true);
    setRowsError(null);

    const response = await siteContentAdminService.getList();
    if (!response.success) {
      setRows([]);
      setRowsError(
        t(
          "dashboard.siteContent.errors.loadList",
          "Unable to load site content records. Please try again.",
        ),
      );
      setIsLoadingRows(false);
      return;
    }

    setRows(response.data ?? []);
    setIsLoadingRows(false);
  }, [t]);

  const loadDetail = useCallback(
    async (id: string) => {
      setIsLoadingDetail(true);
      setDetailError(null);
      setSaveError(null);
      setSaveSuccess(null);
      setJsonValidationError(null);

      const response = await siteContentAdminService.getById(id);
      if (!response.success || !response.data) {
        setDetail(null);
        setEnglishContentValue("");
        setVietnameseContentValue("");
        setDetailError(
          t(
            "dashboard.siteContent.errors.loadDetail",
            "Unable to load content detail. Please try again.",
          ),
        );
        setIsLoadingDetail(false);
        return;
      }

      setDetail(response.data);
      setEnglishContentValue(response.data.englishContentValue);
      setVietnameseContentValue(response.data.vietnameseContentValue);
      setIsLoadingDetail(false);
    },
    [t],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRows();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      if (pageKeyFilter !== "all" && row.pageKey !== pageKeyFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (`${row.pageKey} ${row.contentKey}`)
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [pageKeyFilter, rows, searchQuery]);

  const pageKeyOptions = useMemo(() => {
    const keys = new Set(rows.map((row) => row.pageKey));
    return Array.from(keys).sort((left, right) => left.localeCompare(right));
  }, [rows]);

  const handleSelectRow = async (id: string) => {
    setSelectedId(id);
    await loadDetail(id);
  };

  const handleSave = async () => {
    if (!detail) {
      return;
    }

    setJsonValidationError(null);
    setSaveError(null);
    setSaveSuccess(null);

    const englishValidation = tryValidateJson(englishContentValue);
    const vietnameseValidation = tryValidateJson(vietnameseContentValue);

    if (englishValidation || vietnameseValidation) {
      setJsonValidationError(
        t(
          "dashboard.siteContent.errors.invalidJson",
          "English and Vietnamese content must be valid JSON.",
        ),
      );
      return;
    }

    setIsSaving(true);

    const response = await siteContentAdminService.updateById(detail.id, {
      englishContentValue,
      vietnameseContentValue,
    });

    if (!response.success) {
      setSaveError(
        t(
          "dashboard.siteContent.errors.saveFailed",
          "Unable to save content changes. Please try again.",
        ),
      );
      setIsSaving(false);
      return;
    }

    await Promise.all([loadRows(), loadDetail(detail.id)]);
    setSaveSuccess(
      t(
        "dashboard.siteContent.messages.saveSuccess",
        "Site content updated successfully.",
      ),
    );
    setIsSaving(false);
  };

  const handleCloseEditor = () => {
    setSelectedId(null);
    setDetail(null);
    setDetailError(null);
    setJsonValidationError(null);
    setSaveError(null);
    setSaveSuccess(null);
  };

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t("dashboard.siteContent.title", "Site Content")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t(
              "dashboard.siteContent.description",
              "Manage page content records and edit English/Vietnamese JSON values.",
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void loadRows();
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Icon icon="heroicons:arrow-path" className="size-4" />
          {t("dashboard.siteContent.actions.refresh", "Refresh")}
        </button>
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
                "dashboard.siteContent.searchPlaceholder",
                "Search by page key or content key",
              )}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="w-full lg:w-56">
            <label htmlFor="site-content-page-filter" className="sr-only">
              {t("dashboard.siteContent.filters.pageKey", "Page key")}
            </label>
            <select
              id="site-content-page-filter"
              value={pageKeyFilter}
              onChange={(event) => setPageKeyFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="all">
                {t("dashboard.siteContent.filters.allPageKeys", "All page keys")}
              </option>
              {pageKeyOptions.map((pageKey) => (
                <option key={pageKey} value={pageKey}>
                  {pageKey}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoadingRows && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
          {t("dashboard.siteContent.states.loading", "Loading site content records...")}
        </div>
      )}

      {!isLoadingRows && rowsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
          <p>{rowsError}</p>
        </div>
      )}

      {!isLoadingRows && !rowsError && filteredRows.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-slate-800">
            {t("dashboard.siteContent.states.emptyTitle", "No site content records found")}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {t(
              "dashboard.siteContent.states.emptyDescription",
              "Try another filter or search keyword.",
            )}
          </p>
        </div>
      )}

      {!isLoadingRows && !rowsError && filteredRows.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.siteContent.table.pageKey", "Page key")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.siteContent.table.contentKey", "Content key")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.siteContent.table.locales", "Locales")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.siteContent.table.updated", "Last updated")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("dashboard.siteContent.table.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 align-top text-sm font-medium text-slate-800">
                      {row.pageKey}
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-slate-700">{row.contentKey}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.hasEnglish
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          EN
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.hasVietnamese
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          VI
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-slate-600">
                      <p>{formatDate(row.lastModifiedOnUtc)}</p>
                      <p className="text-xs text-slate-500">
                        {row.lastModifiedBy || t("dashboard.siteContent.table.system", "system")}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      <button
                        type="button"
                        onClick={() => {
                          void handleSelectRow(row.id);
                        }}
                        className="rounded-md border border-orange-200 px-2.5 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50"
                      >
                        {t("dashboard.siteContent.actions.edit", "Edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {filteredRows.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{row.pageKey}</p>
                    <p className="text-xs text-slate-500">{row.contentKey}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void handleSelectRow(row.id);
                    }}
                    className="rounded-md border border-orange-200 px-2.5 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50"
                  >
                    {t("dashboard.siteContent.actions.edit", "Edit")}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.hasEnglish
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    EN
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.hasVietnamese
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    VI
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDate(row.lastModifiedOnUtc)} · {row.lastModifiedBy || t("dashboard.siteContent.table.system", "system")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedId && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {t("dashboard.siteContent.editor.title", "Bilingual content editor")}
              </h2>
              {detail && (
                <p className="mt-1 text-sm text-slate-600">
                  {detail.pageKey} / {detail.contentKey}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleCloseEditor}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Icon icon="heroicons:x-mark" className="size-4" />
              {t("dashboard.siteContent.actions.close", "Close")}
            </button>
          </div>

          {isLoadingDetail && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {t("dashboard.siteContent.states.loadingDetail", "Loading content detail...")}
            </div>
          )}

          {!isLoadingDetail && detailError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {detailError}
            </div>
          )}

          {!isLoadingDetail && !detailError && detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label htmlFor="site-content-en" className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("dashboard.siteContent.editor.englishLabel", "English JSON (en)")}
                  </label>
                  <textarea
                    id="site-content-en"
                    value={englishContentValue}
                    onChange={(event) => setEnglishContentValue(event.target.value)}
                    className="h-64 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    spellCheck={false}
                  />
                </div>

                <div>
                  <label htmlFor="site-content-vi" className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("dashboard.siteContent.editor.vietnameseLabel", "Vietnamese JSON (vi)")}
                  </label>
                  <textarea
                    id="site-content-vi"
                    value={vietnameseContentValue}
                    onChange={(event) => setVietnameseContentValue(event.target.value)}
                    className="h-64 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    spellCheck={false}
                  />
                </div>
              </div>

              {jsonValidationError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {jsonValidationError}
                </div>
              )}

              {saveError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {saveSuccess}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                >
                  <Icon
                    icon={isSaving ? "heroicons:arrow-path" : "heroicons:check"}
                    className={`size-4 ${isSaving ? "animate-spin" : ""}`}
                  />
                  {isSaving
                    ? t("dashboard.siteContent.actions.saving", "Saving...")
                    : t("dashboard.siteContent.actions.save", "Save changes")}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default SiteContentManagementPage;
