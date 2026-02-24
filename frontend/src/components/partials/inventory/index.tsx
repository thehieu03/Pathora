"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { inventoryService } from "@/services/inventoryService";
import { catalogService } from "@/services/catalogService";
import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";
import { extractItems } from "@/utils/apiResponse";
import type { InventoryListModel } from "@/types/frontendModels";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusFromQuantity = (quantity, available) => {
  if (quantity === 0 || available === 0) return "out_of_stock";
  if (available < 10) return "low_stock";
  return "in_stock";
};

const mapInventoryItems = (payload: unknown) => {
  return extractItems<any>(payload).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name || "N/A",
    sku: item.product?.sku || "N/A",
    quantity: item.quantity || 0,
    reserved: item.reserved || 0,
    available: item.available || 0,
    locationId: item.locationId,
    location: item.location?.location || "N/A",
    status: getStatusFromQuantity(item.quantity, item.available),
    lastUpdated: item.lastModifiedOnUtc || item.createdOnUtc,
  }));
};

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
      placeholder={t("inventory.search")}
    />
  );
};

const InventoryPage = () => {
  const { t } = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [increaseStockModalOpen, setIncreaseStockModalOpen] = useState(false);
  const [decreaseStockModalOpen, setDecreaseStockModalOpen] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryListModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Form data for add
  const [addFormData, setAddFormData] = useState({
    productId: "",
    locationId: "",
    quantity: "",
  });

  // Form data for edit
  const [editFormData, setEditFormData] = useState({
    productId: "",
    locationId: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  // Fetch inventory items
  const fetchInventoryItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllInventoryItems();
      setInventoryItems(mapInventoryItems(response.data));
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  useRealtimeRefresh({
    key: "inventory-page",
    entity: "inventory",
    onRefresh: fetchInventoryItems,
    showToast: true,
  });

  // Fetch inventory histories
  const fetchHistories = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const response = await inventoryService.getHistories();
      const mappedHistories = extractItems<any>(response.data).map((item: any) => ({
        id: item.id,
        message: item.message || "-",
        createdOnUtc: item.createdOnUtc,
        createdBy: item.createdBy || "-",
      }));
      setHistoryData(mappedHistories);
    } catch (error) {
      console.error("Failed to fetch inventory histories:", error);
      setHistoryData([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Fetch inventory reservations
  const fetchReservations = useCallback(async () => {
    try {
      setLoadingReservations(true);
      const response = await inventoryService.getAllReservations();
      const mappedReservations = extractItems<any>(response.data).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        referenceId: item.referenceId,
        quantity: item.quantity,
        status: item.status,
        expiresAt: item.expiresAt,
        createdOnUtc: item.createdOnUtc,
      }));
      setReservationData(mappedReservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      setReservationData([]);
    } finally {
      setLoadingReservations(false);
    }
  }, []);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await catalogService.getAllProducts();
        const productOptions = extractItems<any>(response.data).map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
        setProducts(productOptions);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch locations for dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await inventoryService.getLocations();
        const locationOptions = extractItems<any>(response.data).map((item: any) => ({
          value: item.id,
          label: item.location,
        }));
        setLocations(locationOptions);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      setDeleting(true);
      const response = await inventoryService.deleteInventoryItem(
        itemToDelete.id,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("inventory.deleteSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemToDelete.id),
        );

        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewClick = (item) => {
    setViewingItem(item);
    setViewModalOpen(true);
  };

  const handleAddClick = () => {
    setAddFormData({ productId: "", locationId: "", quantity: "" });
    setAddModalOpen(true);
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAdd = async () => {
    if (!addFormData.productId || !addFormData.locationId) {
      toast.error(t("inventory.fillRequiredFields"), {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        productId: addFormData.productId,
        locationId: addFormData.locationId,
        quantity: parseInt(addFormData.quantity) || 0,
      };

      const response = await inventoryService.createInventoryItem(requestBody);

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("inventory.createSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Refresh inventory items
        const refreshResponse = await inventoryService.getAllInventoryItems();
        setInventoryItems(mapInventoryItems(refreshResponse.data));

        setAddModalOpen(false);
        setAddFormData({ productId: "", locationId: "", quantity: "" });
      }
    } catch (error) {
      console.error("Failed to create inventory item:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleIncreaseStockClick = (item) => {
    setStockItem(item);
    setStockQuantity("");
    setIncreaseStockModalOpen(true);
  };

  const handleDecreaseStockClick = (item) => {
    setStockItem(item);
    setStockQuantity("");
    setDecreaseStockModalOpen(true);
  };

  const handleIncreaseStock = async () => {
    if (!stockItem?.id || !stockQuantity || parseInt(stockQuantity) <= 0) {
      toast.error(t("inventory.invalidQuantity"), {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        quantity: parseInt(stockQuantity),
      };

      const response = await inventoryService.increaseStock(
        stockItem.id,
        requestBody,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("inventory.stockIncreased"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Refresh inventory items
        const refreshResponse = await inventoryService.getAllInventoryItems();
        setInventoryItems(mapInventoryItems(refreshResponse.data));

        setIncreaseStockModalOpen(false);
        setStockItem(null);
        setStockQuantity("");
      }
    } catch (error) {
      console.error("Failed to increase stock:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDecreaseStock = async () => {
    if (!stockItem?.id || !stockQuantity || parseInt(stockQuantity) <= 0) {
      toast.error(t("inventory.invalidQuantity"), {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (parseInt(stockQuantity) > stockItem.available) {
      toast.error(t("inventory.insufficientStock"), {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        quantity: parseInt(stockQuantity),
      };

      const response = await inventoryService.decreaseStock(
        stockItem.id,
        requestBody,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("inventory.stockDecreased"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Refresh inventory items
        const refreshResponse = await inventoryService.getAllInventoryItems();
        setInventoryItems(mapInventoryItems(refreshResponse.data));

        setDecreaseStockModalOpen(false);
        setStockItem(null);
        setStockQuantity("");
      }
    } catch (error) {
      console.error("Failed to decrease stock:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditFormData({
      productId: item.productId,
      locationId: item.locationId,
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (
      !editingItem?.id ||
      !editFormData.productId ||
      !editFormData.locationId
    ) {
      toast.error(t("inventory.fillRequiredFields"), {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        productId: editFormData.productId,
        locationId: editFormData.locationId,
        id: editingItem.id,
      };

      const response = await inventoryService.updateInventoryItem(
        editingItem.id,
        requestBody,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("inventory.updateSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Refresh inventory items
        const refreshResponse = await inventoryService.getAllInventoryItems();
        setInventoryItems(mapInventoryItems(refreshResponse.data));

        setEditModalOpen(false);
        setEditingItem(null);
        setEditFormData({ productId: "", locationId: "" });
      }
    } catch (error) {
      console.error("Failed to update inventory item:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleHistoryClick = async () => {
    setHistoryModalOpen(true);
    await fetchHistories();
  };

  // History table columns
  const HISTORY_COLUMNS = useMemo(
    () => [
      {
        Header: t("inventory.message"),
        accessor: "message",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("inventory.createdDate"),
        accessor: "createdOnUtc",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {formatDate(row?.cell?.value)}
          </span>
        ),
      },
    ],
    [t],
  );

  // Reservation table columns
  const RESERVATION_COLUMNS = useMemo(
    () => [
      {
        Header: t("inventory.productName"),
        accessor: "productName",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("inventory.referenceId"),
        accessor: "referenceId",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("inventory.quantity"),
        accessor: "quantity",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("inventory.reservationStatus"),
        accessor: "status",
        Cell: (row) => {
          const status = row?.cell?.value;
          return (
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm ${
                status === 1
                  ? "text-warning-500 bg-warning-500/30"
                  : status === 2
                    ? "text-success-500 bg-success-500/30"
                    : status === 3
                      ? "bg-slate-500/30 text-slate-500"
                      : "text-danger-500 bg-danger-500/30"
              }`}
            >
              {t(`inventory.reservationStatus${status}`)}
            </span>
          );
        },
      },
      {
        Header: t("inventory.expiresAt"),
        accessor: "expiresAt",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value ? formatDate(row?.cell?.value) : "-"}
          </span>
        ),
      },
      {
        Header: t("inventory.createdDate"),
        accessor: "createdOnUtc",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {formatDate(row?.cell?.value)}
          </span>
        ),
      },
    ],
    [t],
  );

  const COLUMNS = useMemo(
    () => [
      {
        Header: t("inventory.productName"),
        accessor: "productName",
        Cell: (row) => (
          <span className="text-slate-600 dark:text-slate-300">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("inventory.quantity"),
        accessor: "quantity",
        Cell: (row) => {
          const item = row?.row?.original;
          return (
            <div>
              <span className="font-semibold">{item.quantity}</span>
              {/* <span className="text-xs text-slate-400 ml-2">
              ({t("inventory.available")}: {item.available})
            </span> */}
            </div>
          );
        },
      },
      {
        Header: t("inventory.reserved"),
        accessor: "reserved",
        Cell: (row) => {
          const item = row?.row?.original;
          return (
            <span className="text-slate-600 dark:text-slate-300">
              {item.reserved || 0}
            </span>
          );
        },
      },
      {
        Header: t("inventory.location"),
        accessor: "location",
        Cell: (row) => <span>{row?.cell?.value}</span>,
      },
      {
        Header: t("inventory.status"),
        accessor: "status",
        Cell: (row) => {
          const item = row?.row?.original;
          const quantity = item.quantity || 0;

          // Determine status based on quantity
          let status = "in_stock";
          let statusText = t("inventory.inStock");
          if (quantity === 0) {
            status = "out_of_stock";
            statusText = t("inventory.outOfStock");
          } else if (quantity < 10) {
            status = "low_stock";
            statusText = t("inventory.lowStock");
          }

          return (
            <span className="block w-full">
              <span
                className={`mx-auto inline-block min-w-[90px] rounded-[999px] px-3 py-1 text-center ${
                  status === "in_stock"
                    ? "text-success-500 bg-success-500/30"
                    : ""
                } ${status === "low_stock" ? "text-warning-500 bg-warning-500/30" : ""} ${status === "out_of_stock" ? "text-danger-500 bg-danger-500/30" : ""} `}
              >
                {statusText}
              </span>
            </span>
          );
        },
      },
      {
        Header: t("inventory.actions"),
        accessor: "action",
        Cell: (row) => {
          const item = row?.row?.original;
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Tooltip
                content={t("common.view")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleViewClick(item)}
                >
                  <Icon icon="heroicons:eye" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("inventory.increaseStock")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleIncreaseStockClick(item)}
                >
                  <Icon icon="heroicons:arrow-up" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("inventory.decreaseStock")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleDecreaseStockClick(item)}
                >
                  <Icon icon="heroicons:arrow-down" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("common.edit")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleEditClick(item)}
                >
                  <Icon icon="heroicons:pencil-square" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("common.delete")}
                placement="top"
                arrow
                animation="shift-away"
                theme="danger"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleDeleteClick(item)}
                >
                  <Icon icon="heroicons:trash" />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [t],
  );

  const data = useMemo(() => inventoryItems, [inventoryItems]);
  const historyTableData = useMemo(() => historyData, [historyData]);
  const reservationTableData = useMemo(
    () => reservationData,
    [reservationData],
  );

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  const historyTableInstance = useTable(
    {
      columns: HISTORY_COLUMNS,
      data: historyTableData,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const reservationTableInstance = useTable(
    {
      columns: RESERVATION_COLUMNS,
      data: reservationTableData,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
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
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card>
        <div className="mb-6 items-center justify-between md:flex">
          <h4 className="card-title">{t("inventory.title")}</h4>
          <div className="space-y-2 md:flex md:space-y-0 md:space-x-4">
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
              t={t}
            />
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={fetchInventoryItems}
              disabled={loading}
            >
              <Icon
                icon="heroicons:arrow-path"
                className={`ltr:mr-2 rtl:ml-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? t("common.refreshing") : t("common.refresh")}
            </button>
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={handleHistoryClick}
            >
              <Icon icon="heroicons:clock" className="ltr:mr-2 rtl:ml-2" />
              {t("inventory.viewHistory")}
            </button>
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={() => {
                setReservationModalOpen(true);
                fetchReservations();
              }}
            >
              <Icon
                icon="heroicons:lock-closed"
                className="ltr:mr-2 rtl:ml-2"
              />
              {t("inventory.viewReservations")}
            </button>
            <button
              className="btn btn-dark btn-sm inline-flex items-center"
              onClick={handleAddClick}
            >
              <Icon icon="heroicons:plus" className="ltr:mr-2 rtl:ml-2" />
              {t("inventory.addNew")}
            </button>
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full table-fixed divide-y divide-slate-100 dark:divide-slate-700!"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => {
                    const { key: headerKey, ...restHeaderProps } =
                      headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={headerKey} {...restHeaderProps}>
                        {headerGroup.headers.map((column) => {
                          const { key: columnKey, ...restColumnProps } =
                            column.getHeaderProps(
                              column.getSortByToggleProps(),
                            );
                          return (
                            <th
                              key={columnKey}
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
                  className="divide-y divide-slate-100 bg-white dark:divide-slate-700! dark:bg-slate-800"
                  {...getTableBodyProps()}
                >
                  {loading ? (
                    <tr>
                      <td
                        colSpan={headerGroups[0]?.headers?.length || 7}
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
                        colSpan={headerGroups[0]?.headers?.length || 7}
                        className="table-td py-8 text-center"
                      >
                        <span className="text-slate-500 dark:text-slate-400">
                          {t("inventory.noItems")}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    page.map((row) => {
                      prepareRow(row);
                      const { key: rowKey, ...restRowProps } =
                        row.getRowProps();
                      return (
                        <tr key={rowKey} {...restRowProps}>
                          {row.cells.map((cell) => {
                            const { key: cellKey, ...restCellProps } =
                              cell.getCellProps();
                            return (
                              <td
                                key={cellKey}
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
                  } flex h-6 w-6 items-center justify-center rounded text-sm leading-[16px] transition-all duration-150`}
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

      {/* Add Inventory Item Modal */}
      <Modal
        title={t("inventory.addNew")}
        activeModal={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      >
        <div className="space-y-4">
          <Select
            label={t("inventory.product")}
            placeholder={t("inventory.selectProduct")}
            options={products}
            value={addFormData.productId}
            onChange={(e) => handleAddFormChange("productId", e.target.value)}
            isLoading={loadingProducts}
          />
          <Select
            label={t("inventory.location")}
            placeholder={t("inventory.selectLocation")}
            options={locations}
            value={addFormData.locationId}
            onChange={(e) => handleAddFormChange("locationId", e.target.value)}
            isLoading={loadingLocations}
          />
          <Textinput
            label={t("inventory.quantity")}
            type="number"
            placeholder="0"
            value={addFormData.quantity}
            onChange={(e) => handleAddFormChange("quantity", e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => setAddModalOpen(false)}
            >
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleSaveAdd}
              disabled={saving}
            >
              {saving ? (
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
                  {t("common.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Increase Stock Modal */}
      <Modal
        title={t("inventory.increaseStock")}
        activeModal={increaseStockModalOpen}
        onClose={() => {
          setIncreaseStockModalOpen(false);
          setStockItem(null);
          setStockQuantity("");
        }}
      >
        <div className="space-y-4">
          {stockItem && (
            <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.product")}:{" "}
                <span className="font-semibold">{stockItem.productName}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.currentStock")}:{" "}
                <span className="font-semibold">{stockItem.quantity}</span>
              </p>
            </div>
          )}
          <Textinput
            label={t("inventory.quantity")}
            type="number"
            placeholder="0"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setIncreaseStockModalOpen(false);
                setStockItem(null);
                setStockQuantity("");
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleIncreaseStock}
              disabled={saving}
            >
              {saving ? (
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
                  {t("common.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Decrease Stock Modal */}
      <Modal
        title={t("inventory.decreaseStock")}
        activeModal={decreaseStockModalOpen}
        onClose={() => {
          setDecreaseStockModalOpen(false);
          setStockItem(null);
          setStockQuantity("");
        }}
      >
        <div className="space-y-4">
          {stockItem && (
            <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.product")}:{" "}
                <span className="font-semibold">{stockItem.productName}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.currentStock")}:{" "}
                <span className="font-semibold">{stockItem.quantity}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.available")}:{" "}
                <span className="font-semibold">{stockItem.available}</span>
              </p>
            </div>
          )}
          <Textinput
            label={t("inventory.quantity")}
            type="number"
            placeholder="0"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setDecreaseStockModalOpen(false);
                setStockItem(null);
                setStockQuantity("");
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleDecreaseStock}
              disabled={saving}
            >
              {saving ? (
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
                  {t("common.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Inventory Item Modal */}
      <Modal
        title={t("inventory.editItem")}
        activeModal={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
          setEditFormData({ productId: "", locationId: "" });
        }}
      >
        <div className="space-y-4">
          {editingItem && (
            <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.currentProduct")}:{" "}
                <span className="font-semibold">{editingItem.productName}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("inventory.currentLocation")}:{" "}
                <span className="font-semibold">{editingItem.location}</span>
              </p>
            </div>
          )}
          <Select
            label={t("inventory.product")}
            placeholder={t("inventory.selectProduct")}
            options={products}
            value={editFormData.productId}
            onChange={(e) => handleEditFormChange("productId", e.target.value)}
            isLoading={loadingProducts}
          />
          <Select
            label={t("inventory.location")}
            placeholder={t("inventory.selectLocation")}
            options={locations}
            value={editFormData.locationId}
            onChange={(e) => handleEditFormChange("locationId", e.target.value)}
            isLoading={loadingLocations}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setEditModalOpen(false);
                setEditingItem(null);
                setEditFormData({ productId: "", locationId: "" });
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? (
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
                  {t("common.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Inventory Detail Modal */}
      <Modal
        title={t("inventory.viewDetail")}
        activeModal={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewingItem(null);
        }}
      >
        {viewingItem && (
          <div className="space-y-4">
            <div className="mb-4 text-center">
              <h5 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {viewingItem.productName}
              </h5>
              <span className="rounded bg-slate-100 px-3 py-1 font-mono text-sm dark:bg-slate-700">
                {viewingItem.sku}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">
                  {t("inventory.quantity")}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {viewingItem.quantity}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">
                  {t("inventory.available")}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {viewingItem.available}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">
                  {t("inventory.status")}
                </p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm ${
                    viewingItem.status === "in_stock"
                      ? "text-success-500 bg-success-500/30"
                      : viewingItem.status === "low_stock"
                        ? "text-warning-500 bg-warning-500/30"
                        : "text-danger-500 bg-danger-500/30"
                  }`}
                >
                  {viewingItem.status === "in_stock" && t("inventory.inStock")}
                  {viewingItem.status === "low_stock" &&
                    t("inventory.lowStock")}
                  {viewingItem.status === "out_of_stock" &&
                    t("inventory.outOfStock")}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    {t("inventory.location")}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {viewingItem.location || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    {t("inventory.lastUpdated")}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {viewingItem.lastUpdated
                      ? formatDate(viewingItem.lastUpdated)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                className="btn btn-outline-dark inline-flex items-center"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingItem(null);
                }}
              >
                {t("common.close")}
              </button>
              <button
                className="btn btn-dark inline-flex items-center"
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditClick(viewingItem);
                }}
              >
                <Icon
                  icon="heroicons:pencil-square"
                  className="ltr:mr-2 rtl:ml-2"
                />
                {t("common.edit")}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("common.deleteConfirmTitle")}
        activeModal={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      >
        <div className="text-center">
          <div className="bg-danger-500/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="text-danger-500 text-3xl"
            />
          </div>
          <p className="mb-2 text-slate-600 dark:text-slate-300">
            {t("common.deleteInventoryMessage")}
          </p>
          {itemToDelete && (
            <p className="mb-6 font-semibold text-slate-800 dark:text-slate-200">
              "{itemToDelete.productName}"
            </p>
          )}
          <div className="flex justify-center space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-danger inline-flex items-center"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="animate-spin ltr:mr-2 rtl:ml-2"
                  />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Icon icon="heroicons:trash" className="ltr:mr-2 rtl:ml-2" />
                  {t("common.delete")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        title={t("inventory.historyTitle")}
        activeModal={historyModalOpen}
        onClose={() => {
          setHistoryModalOpen(false);
          setHistoryData([]);
        }}
        className="max-w-5xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <GlobalFilter
              filter={historyTableInstance.state.globalFilter}
              setFilter={historyTableInstance.setGlobalFilter}
              t={t}
            />
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={fetchHistories}
              disabled={loadingHistory}
            >
              <Icon
                icon="heroicons:arrow-path"
                className={`ltr:mr-2 rtl:ml-2 ${loadingHistory ? "animate-spin" : ""}`}
              />
              {loadingHistory ? t("common.refreshing") : t("common.refresh")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-slate-100 dark:divide-slate-700"
              {...historyTableInstance.getTableProps()}
            >
              <thead className="bg-slate-200 dark:bg-slate-700">
                {historyTableInstance.headerGroups.map((headerGroup) => {
                  const { key: headerKey, ...restHeaderProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={headerKey} {...restHeaderProps}>
                      {headerGroup.headers.map((column) => {
                        const { key: columnKey, ...restColumnProps } =
                          column.getHeaderProps(column.getSortByToggleProps());
                        return (
                          <th
                            key={columnKey}
                            {...restColumnProps}
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
                {...historyTableInstance.getTableBodyProps()}
              >
                {loadingHistory ? (
                  <tr>
                    <td
                      colSpan={
                        historyTableInstance.headerGroups[0]?.headers?.length ||
                        3
                      }
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
                ) : historyTableInstance.page.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        historyTableInstance.headerGroups[0]?.headers?.length ||
                        3
                      }
                      className="table-td py-8 text-center"
                    >
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("inventory.noHistory")}
                      </span>
                    </td>
                  </tr>
                ) : (
                  historyTableInstance.page.map((row) => {
                    historyTableInstance.prepareRow(row);
                    const { key: rowKey, ...restRowProps } = row.getRowProps();
                    return (
                      <tr key={rowKey} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key: cellKey, ...restCellProps } =
                            cell.getCellProps();
                          return (
                            <td
                              key={cellKey}
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

          {/* Pagination for History */}
          <div className="items-center justify-between space-y-5 md:flex md:space-y-0">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <select
                className="form-control w-max py-2"
                value={historyTableInstance.state.pageSize}
                onChange={(e) =>
                  historyTableInstance.setPageSize(Number(e.target.value))
                }
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
                  {historyTableInstance.state.pageIndex + 1} {t("common.of")}{" "}
                  {historyTableInstance.pageOptions.length}
                </span>
              </span>
            </div>
            <ul className="flex items-center space-x-3 rtl:space-x-reverse">
              <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!historyTableInstance.canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => historyTableInstance.gotoPage(0)}
                  disabled={!historyTableInstance.canPreviousPage}
                >
                  <Icon icon="heroicons:chevron-double-left-solid" />
                </button>
              </li>
              <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!historyTableInstance.canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => historyTableInstance.previousPage()}
                  disabled={!historyTableInstance.canPreviousPage}
                >
                  {t("common.previous")}
                </button>
              </li>
              {historyTableInstance.pageOptions.map((pageNum, pageIdx) => (
                <li key={pageIdx}>
                  <button
                    aria-current="page"
                    className={`${
                      pageIdx === historyTableInstance.state.pageIndex
                        ? "bg-slate-900 font-medium text-white dark:bg-slate-600 dark:text-slate-200"
                        : "bg-slate-100 font-normal text-slate-900 dark:bg-slate-700 dark:text-slate-400"
                    } flex h-6 w-6 items-center justify-center rounded text-sm leading-[16px] transition-all duration-150`}
                    onClick={() => historyTableInstance.gotoPage(pageIdx)}
                  >
                    {pageNum + 1}
                  </button>
                </li>
              ))}
              <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!historyTableInstance.canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => historyTableInstance.nextPage()}
                  disabled={!historyTableInstance.canNextPage}
                >
                  {t("common.next")}
                </button>
              </li>
              <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  onClick={() =>
                    historyTableInstance.gotoPage(
                      historyTableInstance.pageCount - 1,
                    )
                  }
                  disabled={!historyTableInstance.canNextPage}
                  className={`${!historyTableInstance.canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <Icon icon="heroicons:chevron-double-right-solid" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            className="btn btn-outline-dark inline-flex items-center"
            onClick={() => {
              setHistoryModalOpen(false);
              setHistoryData([]);
            }}
          >
            {t("common.close")}
          </button>
        </div>
      </Modal>

      {/* Reservation Modal */}
      <Modal
        title={t("inventory.reservationTitle")}
        activeModal={reservationModalOpen}
        onClose={() => {
          setReservationModalOpen(false);
          setReservationData([]);
        }}
        className="max-w-6xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <GlobalFilter
              filter={reservationTableInstance.state.globalFilter}
              setFilter={reservationTableInstance.setGlobalFilter}
              t={t}
            />
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={fetchReservations}
              disabled={loadingReservations}
            >
              <Icon
                icon="heroicons:arrow-path"
                className={`ltr:mr-2 rtl:ml-2 ${loadingReservations ? "animate-spin" : ""}`}
              />
              {loadingReservations
                ? t("common.refreshing")
                : t("common.refresh")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-slate-100 dark:divide-slate-700"
              {...reservationTableInstance.getTableProps()}
            >
              <thead className="bg-slate-200 dark:bg-slate-700">
                {reservationTableInstance.headerGroups.map((headerGroup) => {
                  const { key: headerKey, ...restHeaderProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={headerKey} {...restHeaderProps}>
                      {headerGroup.headers.map((column) => {
                        const { key: columnKey, ...restColumnProps } =
                          column.getHeaderProps(column.getSortByToggleProps());
                        return (
                          <th
                            key={columnKey}
                            {...restColumnProps}
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
                {...reservationTableInstance.getTableBodyProps()}
              >
                {loadingReservations ? (
                  <tr>
                    <td
                      colSpan={
                        reservationTableInstance.headerGroups[0]?.headers
                          ?.length || 6
                      }
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
                ) : reservationTableInstance.page.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        reservationTableInstance.headerGroups[0]?.headers
                          ?.length || 6
                      }
                      className="table-td py-8 text-center"
                    >
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("inventory.noReservations")}
                      </span>
                    </td>
                  </tr>
                ) : (
                  reservationTableInstance.page.map((row) => {
                    reservationTableInstance.prepareRow(row);
                    const { key: rowKey, ...restRowProps } = row.getRowProps();
                    return (
                      <tr key={rowKey} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key: cellKey, ...restCellProps } =
                            cell.getCellProps();
                          return (
                            <td
                              key={cellKey}
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

          {/* Pagination for Reservations */}
          <div className="items-center justify-between space-y-5 md:flex md:space-y-0">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <select
                className="form-control w-max py-2"
                value={reservationTableInstance.state.pageSize}
                onChange={(e) =>
                  reservationTableInstance.setPageSize(Number(e.target.value))
                }
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
                  {reservationTableInstance.state.pageIndex + 1}{" "}
                  {t("common.of")} {reservationTableInstance.pageOptions.length}
                </span>
              </span>
            </div>
            <ul className="flex items-center space-x-3 rtl:space-x-reverse">
              <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!reservationTableInstance.canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => reservationTableInstance.gotoPage(0)}
                  disabled={!reservationTableInstance.canPreviousPage}
                >
                  <Icon icon="heroicons:chevron-double-left-solid" />
                </button>
              </li>
              <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!reservationTableInstance.canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => reservationTableInstance.previousPage()}
                  disabled={!reservationTableInstance.canPreviousPage}
                >
                  {t("common.previous")}
                </button>
              </li>
              {reservationTableInstance.pageOptions.map((pageNum, pageIdx) => (
                <li key={pageIdx}>
                  <button
                    aria-current="page"
                    className={`${
                      pageIdx === reservationTableInstance.state.pageIndex
                        ? "bg-slate-900 font-medium text-white dark:bg-slate-600 dark:text-slate-200"
                        : "bg-slate-100 font-normal text-slate-900 dark:bg-slate-700 dark:text-slate-400"
                    } flex h-6 w-6 items-center justify-center rounded text-sm leading-[16px] transition-all duration-150`}
                    onClick={() => reservationTableInstance.gotoPage(pageIdx)}
                  >
                    {pageNum + 1}
                  </button>
                </li>
              ))}
              <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  className={`${!reservationTableInstance.canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => reservationTableInstance.nextPage()}
                  disabled={!reservationTableInstance.canNextPage}
                >
                  {t("common.next")}
                </button>
              </li>
              <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
                <button
                  onClick={() =>
                    reservationTableInstance.gotoPage(
                      reservationTableInstance.pageCount - 1,
                    )
                  }
                  disabled={!reservationTableInstance.canNextPage}
                  className={`${!reservationTableInstance.canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <Icon icon="heroicons:chevron-double-right-solid" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            className="btn btn-outline-dark inline-flex items-center"
            onClick={() => {
              setReservationModalOpen(false);
              setReservationData([]);
            }}
          >
            {t("common.close")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InventoryPage;
