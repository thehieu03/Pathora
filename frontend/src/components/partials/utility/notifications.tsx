"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import { notificationService } from "@/services/notificationService";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

interface RawNotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  targetUrl?: string;
  createdAt?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  targetUrl?: string;
  createdAt: string;
}

const GlobalFilter = ({ filter, setFilter, t }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  return (
    <Textinput
      value={value || ""}
      onChange={onChange}
      placeholder={t("notification.search")}
    />
  );
};

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    if ("current" in resolvedRef && resolvedRef.current) {
      resolvedRef.current.indeterminate = !!indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={resolvedRef}
      {...rest}
      className="table-checkbox"
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const NotificationPage= () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getAll();

        // Map API response to component format
        const mappedNotifications = (
          response.data as { result: { notifications: RawNotificationItem[] } }
        ).result.notifications.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          isRead: item.isRead,
          readAt: item.readAt,
          targetUrl: item.targetUrl,
          createdAt: item.createdAt || new Date().toISOString(),
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return t("notification.justNow");

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t("notification.justNow");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t("notification.minutesAgo", { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t("notification.hoursAgo", { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return t("notification.daysAgo", { count: diffInDays });
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead([notification.id]);

        // Update local state
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n,
          ),
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate if targetUrl exists
    if (notification.targetUrl) {
      router.push(notification.targetUrl);
    }
  };

  // Handle mark selected as read
  const handleMarkSelectedAsRead = async () => {
    const selectedIds = selectedFlatRows.map((row) => row.original.id);

    if (selectedIds.length === 0) {
      toast.warning(t("notification.selectAll"));
      return;
    }

    try {
      setMarking(true);
      await notificationService.markAsRead(selectedIds);

      toast.success(t("notification.markAsReadSuccess"), {
        position: "top-right",
        autoClose: 5000,
      });

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          selectedIds.includes(n.id)
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n,
        ),
      );

      // Clear selection
      toggleAllRowsSelected(false);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error(t("notification.markAsReadError"), {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setMarking(false);
    }
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: t("notification.title"),
        accessor: "title",
        Cell: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => handleNotificationClick(row.row.original)}
          >
            <span
              className={`font-semibold ${row.row.original.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}
            >
              {row?.cell?.value}
            </span>
          </div>
        ),
      },
      {
        Header: t("notification.message"),
        accessor: "message",
        Cell: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => handleNotificationClick(row.row.original)}
          >
            <span
              className={`${row.row.original.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300"} block max-w-100 truncate`}
            >
              {row?.cell?.value}
            </span>
          </div>
        ),
      },
      {
        Header: t("common.status"),
        accessor: "isRead",
        Cell: (row) => {
          const isRead = row?.cell?.value;
          return (
            <div
              className="cursor-pointer"
              onClick={() => handleNotificationClick(row.row.original)}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  isRead
                    ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {isRead ? t("notification.read") : t("notification.unread")}
              </span>
            </div>
          );
        },
      },
      {
        Header: t("notification.time"),
        accessor: "createdAt",
        Cell: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => handleNotificationClick(row.row.original)}
          >
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatTimeAgo(row?.cell?.value)}
            </span>
          </div>
        ),
      },
    ],
    [t],
  );

  const data = useMemo(() => notifications, [notifications]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks: { visibleColumns: Array<unknown> }) => {
      hooks.visibleColumns.push((columns: unknown[]) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }: { getToggleAllRowsSelectedProps: () => React.InputHTMLAttributes<HTMLInputElement> }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }: { row: { getToggleRowSelectedProps: () => React.InputHTMLAttributes<HTMLInputElement> } }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    },
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card>
        <div className="mb-6 items-center justify-between md:flex">
          <h4 className="card-title">{t("notification.title")}</h4>
          <div className="space-y-2 md:flex md:space-y-0 md:space-x-4">
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
              t={t}
            />
            <button
              className="btn btn-dark btn-sm inline-flex items-center"
              onClick={handleMarkSelectedAsRead}
              disabled={marking || selectedFlatRows.length === 0}
            >
              {marking ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="animate-spin ltr:mr-2 rtl:ml-2"
                  />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Icon icon="heroicons:check" className="ltr:mr-2 rtl:ml-2" />
                  {t("notification.markSelectedAsRead")}
                </>
              )}
            </button>
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full table-fixed divide-y divide-slate-100 dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => {
                    const { key: headerKey, ...restHeaderProps } =
                      headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={headerKey as React.Key} {...restHeaderProps}>
                        {headerGroup.headers.map((column) => {
                          const { key: columnKey, ...restColumnProps } =
                            column.getHeaderProps(
                              column.getSortByToggleProps(),
                            );
                          return (
                            <th
                              key={columnKey as React.Key}
                              {...restColumnProps}
                              scope="col"
                              className="table-th"
                            >
                              {column.render("Header")}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
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
                  className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800"
                  {...getTableBodyProps()}
                >
                  {loading ? (
                    <tr>
                      <td
                        colSpan={headerGroups[0]?.headers?.length || 5}
                        className="table-td py-8 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Icon
                            icon="heroicons:arrow-path"
                            className="mb-2 animate-spin text-2xl text-slate-400"
                          />
                          <span className="text-slate-500 dark:text-slate-400">
                            {t("common.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : page.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headerGroups[0]?.headers?.length || 5}
                        className="table-td py-8 text-center"
                      >
                        <span className="text-slate-500 dark:text-slate-400">
                          {t("notification.noNotificationsFound")}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    page.map((row) => {
                      prepareRow(row);
                      const { key: rowKey, ...restRowProps } =
                        row.getRowProps();
                      return (
                        <tr key={rowKey as React.Key} {...restRowProps}>
                          {row.cells.map((cell) => {
                            const { key: cellKey, ...restCellProps } =
                              cell.getCellProps();
                            return (
                              <td
                                key={cellKey as React.Key}
                                {...restCellProps}
                                className="table-td"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-6 items-center justify-between space-y-5 md:flex md:space-y-0">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control w-max py-2"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {t("common.show")} {size}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t("common.page")}{" "}
              <span>
                {pageIndex + 1} {t("common.of")} {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                className={`${!canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                className={`${!canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {t("common.previous")}
              </button>
            </li>
            {pageOptions.map((pageNum, pageIdx) => (
              <li key={pageIdx}>
                <button
                  aria-current="page"
                  className={`${
                    pageIdx === pageIndex
                      ? "bg-slate-900 font-medium text-white dark:bg-slate-600 dark:text-slate-200"
                      : "bg-slate-100 font-normal text-slate-900 dark:bg-slate-700 dark:text-slate-400"
                  } flex h-6 w-6 items-center justify-center rounded text-sm leading-4 transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {pageNum + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                className={`${!canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {t("common.next")}
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${!canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default NotificationPage;
