"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import TextInput from "@/components/ui/TextInput";
import Modal from "@/components/ui/Modal";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { tourService } from "@/services/tourService";
import { TourVm, TourStatusMap } from "@/types/tour";

/* ── Status badge color helper ─────────────────────────────── */
function statusBadge(status: string) {
  const lower = status.toLowerCase();
  if (lower === "active") return "bg-success-500 text-white ring-success-500";
  if (lower === "inactive") return "bg-slate-400 text-white ring-slate-400";
  if (lower === "pending") return "bg-warning-500 text-white ring-warning-500";
  if (lower === "rejected") return "bg-danger-500 text-white ring-danger-500";
  return "bg-slate-400 text-white ring-slate-400";
}

/* ── Global Filter ──────────────────────────────────────────── */
const GlobalFilter = React.memo(
  ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <TextInput
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
    />
  ),
);
GlobalFilter.displayName = "GlobalFilter";

/* ══════════════════════════════════════════════════════════════
   Tour List Page
   ══════════════════════════════════════════════════════════════ */
export default function TourListPage() {
  const { t } = useTranslation();
  const router = useRouter();

  /* ── State ────────────────────────────────────────────────── */
  const [tours, setTours] = useState<TourVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TourVm | null>(null);

  // Server-side search & pagination
  const [searchText, setSearchText] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ── Fetch tours ──────────────────────────────────────────── */
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      const result = await tourService.getAllTours(
        searchText || undefined,
        currentPage,
        pageSize,
      );
      if (result) {
        setTours(result.data ?? []);
        setTotalItems(result.total ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      toast.error(t("tourAdmin.fetchError", "Failed to load tours"));
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, currentPage, pageSize, t]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1); // reset to first page on search
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  /* ── Delete handlers ──────────────────────────────────────── */
  const handleDeleteClick = (tour: TourVm) => {
    setItemToDelete(tour);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      setDeleting(true);
      await tourService.deleteTour(itemToDelete.id);
      toast.success(t("tourAdmin.deleteSuccess", "Tour deleted successfully"));
      setTours((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete tour:", error);
      toast.error(t("tourAdmin.deleteError", "Failed to delete tour"));
    } finally {
      setDeleting(false);
    }
  };

  /* ── Table Columns ────────────────────────────────────────── */
  const COLUMNS = useMemo(
    () => [
      {
        Header: t("tourAdmin.tourCode", "Tour Code"),
        accessor: "tourCode",
        Cell: (row) => (
          <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("tourAdmin.tourName", "Tour Name"),
        accessor: "tourName",
        Cell: (row) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("tourAdmin.status", "Status"),
        accessor: "status",
        Cell: (row) => {
          const status = row?.cell?.value;
          return (
            <span
              className={`inline-block px-3 min-w-[90px] text-center py-1 rounded-full text-xs font-medium ring-1 ring-opacity-30 ${statusBadge(status)}`}>
              {status}
            </span>
          );
        },
      },
      {
        Header: t("tourAdmin.createdDate", "Created Date"),
        accessor: "createdOnUtc",
        Cell: (row) => {
          const date = new Date(row?.cell?.value);
          return (
            <span className="text-sm text-slate-500">
              {date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        Header: t("tourAdmin.actions", "Actions"),
        accessor: "id",
        Cell: (row) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip
              content={t("tourAdmin.edit", "Edit")}
              placement="top"
              arrow>
              <button
                type="button"
                className="action-btn"
                onClick={() => router.push(`/tour-management/${row?.cell?.value}/edit`)}>
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip
              content={t("tourAdmin.delete", "Delete")}
              placement="top"
              arrow>
              <button
                type="button"
                className="action-btn"
                onClick={() => handleDeleteClick(row?.row?.original)}>
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [t, router],
  );

  /* ── react-table instance ─────────────────────────────────── */
  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: tours,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  /* ── Pagination helpers ───────────────────────────────────── */
  const totalPages = Math.ceil(totalItems / pageSize);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div>
      <Card>
        {/* Header */}
        <div className="mb-6 items-center justify-between md:flex">
          <h4 className="card-title">
            {t("tourAdmin.title", "Tour Management")}
          </h4>
          <div className="mt-4 space-y-2 md:mt-0 md:flex md:items-center md:space-x-4 md:space-y-0">
            <GlobalFilter
              value={searchText}
              onChange={setSearchText}
              placeholder={t("tourAdmin.search", "Search tours...")}
            />
            <button
              type="button"
              className="btn btn-outline-dark btn-sm inline-flex items-center gap-1"
              onClick={fetchTours}>
              <Icon icon="heroicons:arrow-path" className="size-4" />
              {t("tourAdmin.refresh", "Refresh")}
            </button>
            <button
              type="button"
              className="btn btn-dark btn-sm inline-flex items-center gap-1"
              onClick={() => router.push("/tour-management/create")}>
              <Icon icon="heroicons:plus" className="size-4" />
              {t("tourAdmin.addTour", "Add Tour")}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Icon
              icon="heroicons:arrow-path"
              className="size-8 animate-spin text-slate-400"
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && tours.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon
              icon="heroicons:map"
              className="size-12 text-slate-300 mb-3"
            />
            <p className="text-sm text-slate-500">
              {t("tourAdmin.noTours", "No tours found")}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && tours.length > 0 && (
          <>
            <div className="-mx-6 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table
                    className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                    {...getTableProps()}>
                    <thead className="bg-slate-100 dark:bg-slate-700">
                      {headerGroups.map((headerGroup) => {
                        const { key, ...headerGroupProps } =
                          headerGroup.getHeaderGroupProps();
                        return (
                          <tr key={key as React.Key} {...headerGroupProps}>
                            {headerGroup.headers.map((column) => {
                              const { key: colKey, ...colProps } =
                                column.getHeaderProps(
                                  column.getSortByToggleProps(),
                                );
                              return (
                                <th
                                  key={colKey as React.Key}
                                  {...colProps}
                                  scope="col"
                                  className="table-th">
                                  {column.render("Header")}
                                  <span>
                                    {column.isSorted
                                      ? column.isSortedDesc
                                        ? " ▾"
                                        : " ▴"
                                      : ""}
                                  </span>
                                </th>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </thead>
                    <tbody
                      className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                      {...getTableBodyProps()}>
                      {page.map((row) => {
                        prepareRow(row);
                        const { key, ...rowProps } = row.getRowProps();
                        return (
                          <tr key={key as React.Key} {...rowProps}>
                            {row.cells.map((cell) => {
                              const { key: cellKey, ...cellProps } =
                                cell.getCellProps();
                              return (
                                <td
                                  key={cellKey as React.Key}
                                  {...cellProps}
                                  className="table-td">
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Server-side Pagination */}
            <div className="mt-6 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {t("tourAdmin.showing", "Showing")}{" "}
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, totalItems)}{" "}
                  {t("tourAdmin.of", "of")} {totalItems}
                </span>
              </div>
              <ul className="flex items-center gap-1">
                <li>
                  <button
                    type="button"
                    disabled={!canPrev}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`size-8 flex items-center justify-center rounded text-sm ${
                      canPrev
                        ? "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        : "text-slate-300 cursor-not-allowed"
                    }`}>
                    <Icon icon="heroicons:chevron-left" className="size-4" />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <li className="text-sm text-slate-400">…</li>
                      )}
                      <li>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`size-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                            p === currentPage
                              ? "bg-slate-900 text-white dark:bg-slate-600"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                          }`}>
                          {p}
                        </button>
                      </li>
                    </React.Fragment>
                  ))}
                <li>
                  <button
                    type="button"
                    disabled={!canNext}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`size-8 flex items-center justify-center rounded text-sm ${
                      canNext
                        ? "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        : "text-slate-300 cursor-not-allowed"
                    }`}>
                    <Icon icon="heroicons:chevron-right" className="size-4" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("tourAdmin.confirmDelete", "Confirm Delete")}
        activeModal={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <div className="text-center py-4">
          <Icon
            icon="heroicons:exclamation-triangle"
            className="size-12 text-danger-500 mx-auto mb-4"
          />
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t("tourAdmin.deleteTitle", "Delete Tour?")}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t(
              "tourAdmin.deleteMessage",
              "Are you sure you want to delete this tour? This action cannot be undone.",
            )}
          </p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">
            &ldquo;{itemToDelete?.tourName}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => setDeleteModalOpen(false)}>
              {t("tourAdmin.cancel", "Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={deleting}
              onClick={confirmDelete}>
              {deleting ? (
                <Icon
                  icon="heroicons:arrow-path"
                  className="size-4 animate-spin mr-1"
                />
              ) : (
                <Icon icon="heroicons:trash" className="size-4 mr-1" />
              )}
              {t("tourAdmin.confirmDeleteBtn", "Delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
