"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import TextInput from "@/components/ui/TextInput";
import Modal from "@/components/ui/Modal";
import LoaderCircle from "@/components/Loader-circle";
import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { extractItems } from "@/utils/apiResponse";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

type BrandApiItem = { id: string; name: string; slug?: string };

const GlobalFilter = React.memo(
  ({
    filter,
    setFilter,
    t,
  }: {
    filter: string | undefined;
    setFilter: (value: string | undefined) => void;
    t: (key: string) => string;
  }) => {
    const [value, setValue] = useState(filter);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setFilter(e.target.value || undefined);
    };
    return (
      <TextInput
        value={value || ""}
        onChange={onChange}
        placeholder={t("brand.search")}
      />
    );
  },
);
GlobalFilter.displayName = "GlobalFilter";

const BrandPage = () => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBrand, setViewingBrand] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
  });
  const [addFormData, setAddFormData] = useState({
    name: "",
  });

  // Fetch brands from API
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.CATALOG.GET_BRANDS);

      // Map API response to component format
      const mappedBrands = extractItems<BrandApiItem>(response.data).map(
        (item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug || "",
        }),
      );

      setBrands(mappedBrands);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleViewClick = (brand) => {
    setViewingBrand(brand);
    setShowViewModal(true);
  };

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    setEditFormData({
      name: brand.name || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingBrand?.id) return;

    try {
      setSaving(true);
      const requestBody = {
        name: editFormData.name,
      };

      const response = await api.put(
        API_ENDPOINTS.CATALOG.UPDATE_BRAND(editingBrand.id),
        requestBody,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("brand.updateSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Optimistic update: update local state instead of refetching
        if (response.data) {
          setBrands((prev) =>
            prev.map((item) =>
              item.id === editingBrand.id
                ? { ...item, name: editFormData.name }
                : item,
            ),
          );
        } else {
          // Fallback: refetch if no data in response
          const refreshResponse = await api.get(
            API_ENDPOINTS.CATALOG.GET_BRANDS,
          );
          const mappedBrands = extractItems<BrandApiItem>(
            refreshResponse.data,
          ).map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug || "",
          }));
          setBrands(mappedBrands);
        }

        setShowEditModal(false);
        setEditingBrand(null);
        setEditFormData({ name: "" });
      }
    } catch (error) {
      console.error("Failed to update brand:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdd = async () => {
    try {
      setSaving(true);
      const requestBody = {
        name: addFormData.name,
      };

      const response = await api.post(
        API_ENDPOINTS.CATALOG.CREATE_BRAND,
        requestBody,
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("brand.createSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Optimistic update: add new item to local state
        if (response.data) {
          const data = response.data as { id?: string; slug?: string };
          const newBrand = {
            id: data.id || String(data),
            name: addFormData.name,
            slug: data.slug || "",
          };
          setBrands((prev) => [newBrand, ...prev]);
        } else {
          // Fallback: refetch if no data in response
          const refreshResponse = await api.get(
            API_ENDPOINTS.CATALOG.GET_BRANDS,
          );
          const mappedBrands = extractItems<BrandApiItem>(
            refreshResponse.data,
          ).map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug || "",
          }));
          setBrands(mappedBrands);
        }

        setShowAddModal(false);
        setAddFormData({ name: "" });
      }
    } catch (error) {
      console.error("Failed to create brand:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (brand) => {
    setItemToDelete(brand);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      setDeleting(true);
      const response = await api.delete(
        API_ENDPOINTS.CATALOG.DELETE_BRAND(itemToDelete.id),
      );

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(t("brand.deleteSuccess"), {
          position: "top-right",
          autoClose: 5000,
        });

        // Remove the deleted brand from the list
        setBrands((prevBrands) =>
          prevBrands.filter((brand) => brand.id !== itemToDelete.id),
        );

        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
    } finally {
      setDeleting(false);
    }
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: t("brand.name"),
        accessor: "name",
        Cell: (row) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("brand.slug"),
        accessor: "slug",
        Cell: (row) => (
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            {row?.cell?.value}
          </span>
        ),
      },
      {
        Header: t("brand.actions"),
        accessor: "action",
        Cell: (row) => {
          const brand = row?.row?.original;
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Tooltip
                content={t("common.view")}
                placement="top"
                arrow
                animation="shift-away">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleViewClick(brand)}>
                  <Icon icon="heroicons:eye" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("common.edit")}
                placement="top"
                arrow
                animation="shift-away">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleEditClick(brand)}>
                  <Icon icon="heroicons:pencil-square" />
                </button>
              </Tooltip>
              <Tooltip
                content={t("common.delete")}
                placement="top"
                arrow
                animation="shift-away"
                theme="danger">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleDeleteClick(brand)}>
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

  const data = useMemo(() => brands, [brands]);

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
          <h4 className="card-title">{t("brand.title")}</h4>
          <div className="space-y-2 md:flex md:space-y-0 md:space-x-4">
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
              t={t}
            />
            <button
              className="btn btn-outline-dark btn-sm inline-flex items-center"
              onClick={fetchBrands}
              disabled={loading}>
              <Icon
                icon="heroicons:arrow-path"
                className={`ltr:mr-2 rtl:ml-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? t("common.refreshing") : t("common.refresh")}
            </button>
            <button
              className="btn btn-dark btn-sm inline-flex items-center"
              onClick={() => setShowAddModal(true)}>
              <Icon icon="heroicons:plus" className="ltr:mr-2 rtl:ml-2" />
              {t("brand.addBrand")}
            </button>
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto table-responsive">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full table-fixed divide-y divide-slate-100 dark:divide-slate-700!"
                {...getTableProps()}>
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
                              className="table-th">
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
                  {...getTableBodyProps()}>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={headerGroups[0]?.headers?.length || 3}
                        className="table-td py-8 text-center">
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
                        colSpan={headerGroups[0]?.headers?.length || 3}
                        className="table-td py-8 text-center">
                        <span className="text-slate-500 dark:text-slate-400">
                          {t("brand.noBrands")}
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
                                className="table-td">
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
              onChange={(e) => setPageSize(Number(e.target.value))}>
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
                disabled={!canPreviousPage}>
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                className={`${!canPreviousPage ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}>
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
                  onClick={() => gotoPage(pageIdx)}>
                  {pageNum + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                className={`${!canNextPage ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => nextPage()}
                disabled={!canNextPage}>
                {t("common.next")}
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 rtl:rotate-180 dark:text-white">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${!canNextPage ? "cursor-not-allowed opacity-50" : ""}`}>
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>

      {/* Add Brand Modal */}
      <Modal
        title={t("brand.addNewBrand")}
        activeModal={showAddModal}
        onClose={() => setShowAddModal(false)}>
        <div className="space-y-4">
          <TextInput
            label={t("brand.name")}
            type="text"
            placeholder={t("brand.namePlaceholder")}
            value={addFormData.name}
            onChange={(e) => handleAddFormChange("name", e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => setShowAddModal(false)}>
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleSaveAdd}
              disabled={saving}>
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
                  {t("brand.saveBrand")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Brand Modal */}
      <Modal
        title={t("brand.editBrand")}
        activeModal={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBrand(null);
        }}>
        <div className="space-y-4">
          <TextInput
            label={t("brand.name")}
            type="text"
            placeholder={t("brand.namePlaceholder")}
            value={editFormData.name}
            onChange={(e) => handleEditFormChange("name", e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setShowEditModal(false);
                setEditingBrand(null);
              }}>
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-dark inline-flex items-center"
              onClick={handleSaveEdit}
              disabled={saving}>
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
                  {t("brand.updateBrand")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("common.deleteConfirmTitle")}
        activeModal={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}>
        <div className="text-center">
          <div className="bg-danger-500/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="text-danger-500 text-3xl"
            />
          </div>
          <p className="mb-2 text-slate-600 dark:text-slate-300">
            {t("common.deleteBrandMessage")}
          </p>
          {itemToDelete && (
            <p className="mb-6 font-semibold text-slate-800 dark:text-slate-200">
              &quot;{itemToDelete.name}&quot;
            </p>
          )}
          <div className="flex justify-center space-x-3">
            <button
              className="btn btn-outline-dark inline-flex items-center"
              onClick={() => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
              }}>
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-danger inline-flex items-center"
              onClick={confirmDelete}
              disabled={deleting}>
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

      {/* View Brand Detail Modal */}
      <Modal
        title={t("brand.viewDetails")}
        activeModal={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingBrand(null);
        }}>
        {viewingBrand && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t("brand.name")}
              </label>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {viewingBrand.name}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t("brand.slug")}
              </label>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200">
                {viewingBrand.slug}
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                className="btn btn-dark inline-flex items-center"
                onClick={() => {
                  setShowViewModal(false);
                  setViewingBrand(null);
                }}>
                {t("common.close")}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BrandPage;
