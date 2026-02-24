"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import Modal from "@/components/ui/Modal";
import { catalogService } from "@/services/catalogService";
import { formatCurrency } from "@/utils/format";
import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";
import type { ProductListModel } from "@/types/frontendModels";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

// Helper function to map API status to component status
const mapStatus = (displayStatus) => {
  if (displayStatus === "Out of Stock") return "out_of_stock";
  if (displayStatus === "In Stock") return "in_stock";
  if (displayStatus === "Hidden" || displayStatus === "hidden") return "hidden";
  return "active";
};

type ProductApiItem = {
  id?: string;
  name?: string;
  sku?: string;
  categoryNames?: string[];
  brandName?: string;
  price?: number;
  salePrice?: number | null;
  published?: boolean;
  featured?: boolean;
  thumbnail?: {
    publicURL?: string;
  };
  imageUrl?: string;
  displayStatus?: string;
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
      placeholder={t("products.search")}
    />
  );
};

const Ecommerce = () => {
  const { t } = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [products, setProducts] = useState<ProductListModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [itemToPublish, setItemToPublish] = useState(null);
  const [publishing, setPublishing] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await catalogService.getAllProducts();

      const rawData: unknown = response.data;
      const wrappedData =
        rawData && typeof rawData === "object"
          ? (rawData as {
              result?: { items?: ProductApiItem[] };
              data?: { items?: ProductApiItem[] };
            })
          : undefined;

      const sourceItems: ProductApiItem[] = Array.isArray(rawData)
        ? rawData
        : wrappedData?.result?.items || wrappedData?.data?.items || [];

      // Map API response to component format
      const mappedProducts = sourceItems.map(
        (item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          categories:
            item.categoryNames && item.categoryNames.length > 0
              ? item.categoryNames.join(", ")
              : "",
          brand: item.brandName,
          price: item.price,
          salePrice: item.salePrice || null,
          published: item.published ?? true,
          featured: item.featured,
          image:
            item.thumbnail?.publicURL ||
            item.imageUrl ||
            "https://placehold.co/60x60/e2e8f0/475569?text=No+Img",
          status: mapStatus(item.displayStatus),
        }),
      );

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useRealtimeRefresh({
    key: "products-page",
    entity: "product",
    onRefresh: fetchProducts,
    showToast: true,
  });

  const handleDeleteClick = (product) => {
    setItemToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      setDeleting(true);
      const response = await catalogService.deleteProduct(itemToDelete.id);

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("products.deleteSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Remove the deleted product from the list
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== itemToDelete.id),
        );

        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishClick = (product) => {
    setItemToPublish(product);
    setPublishModalOpen(true);
  };

  const confirmPublish = async () => {
    if (!itemToPublish?.id) return;

    try {
      setPublishing(true);
      const isCurrentlyPublished = itemToPublish.published;
      const publishPromise = isCurrentlyPublished
        ? catalogService.unpublishProduct(itemToPublish.id)
        : catalogService.publishProduct(itemToPublish.id);

      const response = await publishPromise;

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(
          isCurrentlyPublished
            ? t("productDetails.unpublishSuccess")
            : t("productDetails.publishSuccess"),
          {
            position: "top-right",
            autoClose: 5000,
          },
        );

        // Update the product in the list
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === itemToPublish.id
              ? { ...product, published: !isCurrentlyPublished }
              : product,
          ),
        );

        setPublishModalOpen(false);
        setItemToPublish(null);
      }
    } catch (error) {
      console.error("Failed to update publish status:", error);
    } finally {
      setPublishing(false);
    }
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: t("products.product"),
        accessor: "name",
        Cell: (row) => {
          const product = row?.row?.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <Link
                  href={`/products/${product?.id}`}
                  className="hover:text-primary-500 block max-w-[250px] truncate font-medium text-slate-800 dark:text-slate-200"
                >
                  {product?.name}
                </Link>
                <p className="font-mono text-xs text-slate-500">
                  {product?.sku}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        Header: t("products.brand"),
        accessor: "brand",
        Cell: (row) => (
          <span className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-700">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("products.category"),
        accessor: "categories",
        Cell: (row) => (
          <span className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-700">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("products.price"),
        accessor: "price",
        Cell: (row) => {
          const product = row?.row?.original;
          return (
            <div>
              {product?.salePrice ? (
                <>
                  <span className="text-danger-500 font-semibold">
                    {formatCurrency(product?.salePrice)}
                  </span>
                  <span className="block text-xs text-slate-400 line-through">
                    {formatCurrency(product?.price)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatCurrency(product?.price)}
                </span>
              )}
            </div>
          );
        },
      },
      {
        Header: t("products.publish"),
        accessor: "published",
        Cell: (row) => {
          const published = row?.cell?.value;
          return (
            <span
              className={`font-medium ${
                published ? "text-success-500" : "text-danger-500"
              }`}
            >
              {published ? t("products.published") : t("products.unpublished")}
            </span>
          );
        },
      },
      {
        Header: t("products.status"),
        accessor: "status",
        Cell: (row) => {
          const status = row?.cell?.value;
          const statusConfig = {
            active: {
              label: t("products.active"),
              class: "text-success-500 bg-success-500/30",
            },
            out_of_stock: {
              label: t("products.outOfStock"),
              class: "text-danger-500 bg-danger-500/30",
            },
            in_stock: {
              label: t("products.inStock"),
              class: "text-success-500 bg-success-500/30",
            },
            draft: {
              label: t("products.draft"),
              class: "text-warning-500 bg-warning-500/30",
            },
            hidden: {
              label: t("products.hidden"),
              class: "text-slate-500 bg-slate-500/30",
            },
          };
          const config = statusConfig[status] || statusConfig.active;
          return (
            <span className="block w-full">
              <span
                className={`inline-block min-w-[80px] rounded-[999px] px-3 py-1 text-center text-sm ${config.class}`}
              >
                {config.label}
              </span>
            </span>
          );
        },
      },
      {
        Header: t("products.actions"),
        accessor: "action",
        Cell: (row) => {
          const product = row?.row?.original;
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Tooltip
                content={t("common.view")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <Link href={`/products/${product?.id}`} className="action-btn">
                  <Icon icon="heroicons:eye" />
                </Link>
              </Tooltip>
              <Tooltip
                content={t("common.edit")}
                placement="top"
                arrow
                animation="shift-away"
              >
                <Link
                  href={`/edit-product/${product?.id}`}
                  className="action-btn"
                >
                  <Icon icon="heroicons:pencil-square" />
                </Link>
              </Tooltip>
              <Tooltip
                content={
                  product?.published
                    ? t("productDetails.unpublish")
                    : t("productDetails.publish")
                }
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handlePublishClick(product)}
                >
                  <Icon
                    icon={
                      product?.published
                        ? "heroicons:lock-closed"
                        : "heroicons:globe-alt"
                    }
                  />
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
                  onClick={() => handleDeleteClick(product)}
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

  const data = useMemo(() => products, [products]);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    if (statusFilter === "published") {
      return data.filter((product) => product.published === true);
    }
    if (statusFilter === "unpublished") {
      return data.filter((product) => product.published === false);
    }
    if (statusFilter === "out_of_stock") {
      return data.filter((product) => product.status === "out_of_stock");
    }
    return data;
  }, [data, statusFilter]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: filteredData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
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

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: data.length,
      published: data.filter((p) => p.published === true).length,
      unpublished: data.filter((p) => p.published === false).length,
      out_of_stock: data.filter((p) => p.status === "out_of_stock").length,
    };
  }, [data]);

  return (
    <>
      <div className="space-y-5">
        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              key: "all",
              label: t("products.all"),
              icon: "heroicons:squares-2x2",
              color: "bg-slate-500",
            },
            {
              key: "published",
              label: t("products.published"),
              icon: "heroicons:check-circle",
              color: "bg-success-500",
            },
            {
              key: "unpublished",
              label: t("products.unpublished"),
              icon: "heroicons:document",
              color: "bg-warning-500",
            },
            {
              key: "out_of_stock",
              label: t("products.outOfStock"),
              icon: "heroicons:x-circle",
              color: "bg-danger-500",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`rounded-lg border-2 p-4 transition-all ${
                statusFilter === item.key
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-10 w-10 rounded-lg ${item.color} flex items-center justify-center`}
                >
                  <Icon icon={item.icon} className="text-xl text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {statusCounts[item.key]}
                </span>
              </div>
              <p className="mt-2 text-left text-sm text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
            </button>
          ))}
        </div>

        <Card>
          <div className="mb-6 items-center justify-between md:flex">
            <h4 className="card-title">{t("products.title")}</h4>
            <div className="mt-4 space-y-2 md:mt-0 md:flex md:space-y-0 md:space-x-4">
              <GlobalFilter
                filter={globalFilter}
                setFilter={setGlobalFilter}
                t={t}
              />
              <button
                className="btn btn-outline-dark btn-sm inline-flex items-center"
                onClick={fetchProducts}
                disabled={loading}
              >
                <Icon
                  icon="heroicons:arrow-path"
                  className={`ltr:mr-2 rtl:ml-2 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? t("common.refreshing") : t("common.refresh")}
              </button>
              <button className="btn btn-outline-dark btn-sm inline-flex items-center">
                <Icon
                  icon="heroicons:arrow-down-tray"
                  className="ltr:mr-2 rtl:ml-2"
                />
                {t("products.exportExcel")}
              </button>
              <Link
                href="/create-product"
                className="btn btn-dark btn-sm inline-flex items-center"
              >
                <Icon icon="heroicons:plus" className="ltr:mr-2 rtl:ml-2" />
                {t("products.createNew")}
              </Link>
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
                          colSpan={headerGroups[0]?.headers?.length || 6}
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
                          colSpan={headerGroups[0]?.headers?.length || 6}
                          className="table-td py-8 text-center"
                        >
                          <span className="text-slate-500 dark:text-slate-400">
                            {t("products.noProducts")}
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
      </div>

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
            {t("common.deleteProductMessage")}
          </p>
          {itemToDelete && (
            <p className="mb-6 font-semibold text-slate-800 dark:text-slate-200">
              "{itemToDelete.name}"
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

      {/* Publish/Unpublish Confirmation Modal */}
      <Modal
        title={
          itemToPublish?.published
            ? t("productDetails.unpublish")
            : t("productDetails.publish")
        }
        activeModal={publishModalOpen}
        onClose={() => {
          setPublishModalOpen(false);
          setItemToPublish(null);
        }}
      >
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              itemToPublish?.published
                ? "bg-warning-500/20"
                : "bg-success-500/20"
            }`}
          >
            <Icon
              icon={
                itemToPublish?.published
                  ? "heroicons:lock-closed"
                  : "heroicons:globe-alt"
              }
              className={`text-3xl ${
                itemToPublish?.published
                  ? "text-warning-500"
                  : "text-success-500"
              }`}
            />
          </div>
          <p className="mb-2 text-slate-600 dark:text-slate-300">
            {itemToPublish?.published
              ? t("productDetails.unpublishConfirmMessage")
              : t("productDetails.publishConfirmMessage")}
          </p>
          {itemToPublish && (
            <p className="mb-6 font-semibold text-slate-800 dark:text-slate-200">
              "{itemToPublish.name}"
            </p>
          )}
          <div className="flex justify-center space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setPublishModalOpen(false);
                setItemToPublish(null);
              }}
              disabled={publishing}
            >
              {t("common.cancel")}
            </button>
            <button
              className={`btn inline-flex items-center ${
                itemToPublish?.published ? "btn-warning" : "btn-success"
              }`}
              onClick={confirmPublish}
              disabled={publishing}
            >
              {publishing ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="animate-spin ltr:mr-2 rtl:ml-2"
                  />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Icon
                    icon={
                      itemToPublish?.published
                        ? "heroicons:lock-closed"
                        : "heroicons:globe-alt"
                    }
                    className="ltr:mr-2 rtl:ml-2"
                  />
                  {itemToPublish?.published
                    ? t("productDetails.unpublish")
                    : t("productDetails.publish")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Ecommerce;
