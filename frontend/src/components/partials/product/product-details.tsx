"use client";
import React, { Fragment, useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { TabList, TabGroup, TabPanels, TabPanel, Tab } from "@headlessui/react";
import blackJumper from "@/assets/images/e-commerce/product-card/classical-black-tshirt.png";
import one from "@/assets/images/e-commerce/productDetails/1.png";
import two from "@/assets/images/e-commerce/productDetails/2.png";
import three from "@/assets/images/e-commerce/productDetails/3.png";

import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ThumbSliderCom from "@/components/partials/ecommerce/thumb-slider";
import Alert from "@/components/ui/Alert";
import LoaderCircle from "@/components/Loader-circle";
import { catalogService } from "@/services/catalogService";
import { formatCurrency, calculateDiscount, formatDate } from "@/utils/format";
import { toast } from "react-toastify";
import { extractResult } from "@/utils/apiResponse";

export const ProductDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const productId = id as string;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const buttons = [
    {
      title: t("productDetails.description"),
    },
    {
      title: t("productDetails.additionalInformation"),
    },
  ];

  // Helper function to map API displayStatus to status code
  const mapDisplayStatus = (displayStatus) => {
    if (!displayStatus) return "active";
    if (displayStatus === "Out of Stock") return "out_of_stock";
    if (displayStatus === "Hidden" || displayStatus === "hidden")
      return "hidden";
    return "active";
  };

  // Get status config for displayStatus badge
  const getStatusConfig = (displayStatus) => {
    const status = mapDisplayStatus(displayStatus);
    const statusConfig = {
      active: {
        label: t("products.active"),
        class: "bg-success-500 text-white",
      },
      out_of_stock: {
        label: t("products.outOfStock"),
        class: "bg-danger-500 text-white",
      },
      hidden: {
        label: t("products.hidden"),
        class: "bg-slate-500 text-white",
      },
    };
    return statusConfig[status] || statusConfig.active;
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await catalogService.getProductById(productId);

        const result = extractResult<any>(response.data);
        const productData = result?.product || result;
        if (productData) {

          // Set initial color and size from API data
          if (productData.colors && productData.colors.length > 0) {
            setColor(productData.colors[0].trim());
          }
          if (productData.sizes && productData.sizes.length > 0) {
            setSize(productData.sizes[0].trim());
          }

          setProduct(productData);
        } else {
          setError(t("productDetails.productNotFound"));
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            t("productDetails.failedToLoad"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  // Handle toggle publish/unpublish
  const handleTogglePublish = async () => {
    if (!product || isUpdating) return;

    try {
      setIsUpdating(true);
      const isCurrentlyPublished = product.published;
      const publishPromise = isCurrentlyPublished
        ? catalogService.unpublishProduct(productId)
        : catalogService.publishProduct(productId);

      const response = await publishPromise;

      if (response && response.status >= 200 && response.status < 300) {
        setProduct((prev) => ({
          ...prev,
          published: !isCurrentlyPublished,
        }));
        toast.success(
          !isCurrentlyPublished
            ? t("productDetails.publishSuccess")
            : t("productDetails.unpublishSuccess"),
          {
            position: "top-right",
            autoClose: 5000,
          },
        );
      }
    } catch (err) {
      console.error("Failed to update publish status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <LoaderCircle />;
  }

  if (error) {
    return (
      <Alert
        className="alert-danger"
        icon="heroicons:information-circle"
        toggle={() => {}}
        dismissible={false}
        label=""
      >
        {t("productDetails.error")}: {error}
      </Alert>
    );
  }

  if (!product) {
    return (
      <div>
        <Alert
          className="alert-danger"
          icon="heroicons:information-circle"
          toggle={() => {}}
          dismissible={false}
          label=""
        >
          {t("productDetails.productNotFound")}
        </Alert>
      </div>
    );
  }

  // Prepare colors and sizes from API data
  const colors =
    product.colors && product.colors.length > 0
      ? product.colors.map((c) => ({ code: c.trim() }))
      : [{ code: t("productDetails.notAvailable") }];

  const sizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes.map((s) => ({ code: s.trim() }))
      : [{ code: t("productDetails.notAvailable") }];

  // Prepare images for slider (thumbnail + images array)
  // Map to URLs for ThumbSliderCom
  const productImages = [];
  if (product.thumbnail?.publicURL) {
    productImages.push(product.thumbnail.publicURL);
  }
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img.publicURL) {
        productImages.push(img.publicURL);
      }
    });
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 dark:bg-slate-800">
      {/* Header with Edit and Publish/Unpublish Buttons */}
      <div className="mb-5 flex items-start justify-between">
        <div></div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => router.push(`/edit-product/${id}`)}
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center text-white"
          >
            <Icon icon="heroicons:pencil-square" className="mr-2 h-4 w-4" />
            {t("productDetails.edit")}
          </Button>
          <Button
            onClick={handleTogglePublish}
            disabled={isUpdating}
            className={`${
              product.published
                ? "bg-danger-500 hover:bg-danger-600"
                : "bg-success-500 hover:bg-success-600"
            } inline-flex items-center text-white`}
          >
            {isUpdating ? (
              <>
                <Icon
                  icon="heroicons:arrow-path"
                  className="mr-2 h-4 w-4 animate-spin"
                />
                {t("productDetails.updating")}
              </>
            ) : product.published ? (
              <>
                <Icon icon="heroicons:x-mark" className="mr-2 h-4 w-4" />
                {t("productDetails.unpublish")}
              </>
            ) : (
              <>
                <Icon icon="heroicons:check" className="mr-2 h-4 w-4" />
                {t("productDetails.publish")}
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="pb-5">
        <div className="grid grid-cols-12 space-y-4 sm:space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
          <div className="col-span-12 space-y-4 md:col-span-5 lg:col-span-4">
            <ThumbSliderCom product={{ ...product, images: productImages }} />
          </div>
          <div className="col-span-12 space-y-2 md:col-span-7 lg:col-span-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {product.featured && (
                  <Badge className="bg-green-100 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t("productDetails.featured")}
                  </Badge>
                )}
                <Badge
                  className={
                    product.published
                      ? "bg-success-500 text-white"
                      : "bg-slate-500 text-white"
                  }
                >
                  {product.published
                    ? t("productDetails.published")
                    : t("productDetails.unpublished")}
                </Badge>
                {product.displayStatus &&
                  (() => {
                    const statusConfig = getStatusConfig(product.displayStatus);
                    return (
                      <Badge className={statusConfig.class}>
                        {statusConfig.label}
                      </Badge>
                    );
                  })()}
              </div>
              <h1 className="text-xl font-medium text-slate-900 lg:text-2xl dark:text-slate-300">
                {product?.name}
              </h1>
              <p className="flex items-center space-x-1.5 text-sm font-normal text-slate-900 lg:text-base rtl:space-x-reverse dark:text-slate-300">
                <Icon icon="ph:star-fill" className="text-yellow-400" />
                <Icon icon="ph:star-fill" className="text-yellow-400" />
                <Icon icon="ph:star-fill" className="text-yellow-400" />
                <Icon icon="ph:star-fill" className="text-yellow-400" />
                <Icon icon="ph:star-fill" className="text-slate-300/80" />
                <span className="text-slate-500 ltr:pl-2 rtl:pr-2 dark:text-slate-400">
                  {t("productDetails.reviews", { count: 789 })}
                </span>
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                  {t("productDetails.sku")}:
                </p>
                <p className="text-sm font-medium text-slate-900 lg:text-base dark:text-slate-300">
                  {product.sku || t("productDetails.notAvailable")}
                </p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                  {t("productDetails.brand")}:
                </p>
                <p className="text-sm font-medium text-slate-900 lg:text-base dark:text-slate-300">
                  {product.brandName || t("productDetails.notAvailable")}
                </p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                  {t("productDetails.available")}:
                </p>
                <p className="text-sm font-medium text-slate-900 lg:text-base dark:text-slate-300">
                  {product.isAvaiable
                    ? t("productDetails.inStock")
                    : product.displayStatus || t("productDetails.outOfStock")}
                </p>
              </div>
            </div>
            <div className="pb-1">
              <div className="mb-4">
                <div className="mb-3 flex items-center space-x-2 pb-2 rtl:space-x-reverse">
                  <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                    {t("productDetails.color")}:
                  </p>
                  <p className="text-sm font-medium text-slate-900 lg:text-base dark:text-slate-300">
                    {color}
                  </p>
                </div>
                <div className="flex h-6 space-x-4 rtl:space-x-reverse">
                  {colors.map((innerColor, i) => {
                    return (
                      <label key={i}>
                        <input
                          type="radio"
                          name="color"
                          value={innerColor.code}
                          onChange={() => setColor(innerColor.code)}
                          className="hidden"
                        />
                        <div
                          style={{ backgroundColor: innerColor.code }}
                          className={`h-7 w-7 ${
                            innerColor.code === color
                              ? "ring-slate-900! dark:ring-slate-200!"
                              : ""
                          } cursor-pointer rounded-sm ring-1 ring-slate-400 ring-offset-2 ring-offset-white dark:ring-slate-900 dark:ring-offset-slate-700!`}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center space-x-2 pb-2 rtl:space-x-reverse">
                  <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                    {t("productDetails.size")}:
                  </p>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-300">
                    {size}
                  </p>
                </div>
                <div className="mb-4 flex h-6 items-center space-x-4 rtl:space-x-reverse">
                  {sizes.map((list, i) => {
                    return (
                      <label key={i}>
                        <input
                          type="radio"
                          name="color"
                          value={list.code}
                          onChange={() => setSize(list.code)}
                          className="hidden h-7 w-7"
                        />
                        <div
                          style={{ backgroundColor: list.code }}
                          className={`h-7 w-7 ${
                            list.code === size
                              ? "ring-slate-900! dark:ring-slate-200!"
                              : ""
                          } flex cursor-pointer items-center justify-center rounded-sm ring-1 ring-slate-400 ring-offset-2 ring-offset-white dark:ring-slate-900 dark:ring-offset-slate-700`}
                        >
                          {list.code}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-full border-t border-slate-300 dark:border-slate-600!"></div>

            <div className="overflow-x-auto">
              <div className="inline-block max-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <tbody className="bg-white dark:bg-slate-800">
                      <tr className="space-x-6 rtl:space-x-reverse">
                        <td className="table-td py-2 pl-0 text-sm font-normal text-slate-500 lg:text-base rtl:pr-0 dark:text-slate-400">
                          {t("productDetails.price")}:
                        </td>
                        <td className="table-td space-x-2 py-2 rtl:space-x-reverse">
                          {product.salePrice ? (
                            <>
                              <span className="text-base font-semibold text-slate-900 lg:text-xl dark:text-slate-300">
                                {formatCurrency(product.salePrice)}
                              </span>
                              <del className="text-base font-semibold text-slate-500 lg:text-xl dark:text-slate-400">
                                {formatCurrency(product.price)}
                              </del>
                              {calculateDiscount(
                                product.price,
                                product.salePrice,
                              ) > 0 && (
                                <Badge className="bg-danger-600 text-[10px] font-normal text-white">
                                  <span>
                                    {calculateDiscount(
                                      product.price,
                                      product.salePrice,
                                    )}
                                    %
                                  </span>
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-base font-semibold text-slate-900 lg:text-xl dark:text-slate-300">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Description and Additional Information */}
        <div className="rounded-sm border border-slate-200 dark:border-slate-700">
          <Card>
            <TabGroup>
              <TabList className="space-x-0 md:space-x-4 lg:space-x-8 rtl:space-x-reverse">
                {buttons.map((item, i) => (
                  <Tab as={Fragment} key={i}>
                    {({ selected }) => (
                      <button
                        className={`foucs:ring-0 relative mb-7 bg-white px-2 text-lg font-medium capitalize ring-0 transition duration-150 before:absolute before:bottom-[-6px] before:left-1/2 before:h-[1.5px] before:-translate-x-1/2 before:bg-slate-900 before:transition-all before:duration-150 focus:outline-hidden lg:text-xl dark:bg-slate-800 dark:before:bg-slate-300 ${
                          selected
                            ? "font-md text-lg text-slate-900 before:w-full lg:text-xl dark:text-slate-300"
                            : "font-md text-lg text-slate-500 before:w-0 lg:text-xl dark:text-slate-500"
                        } `}
                      >
                        {item.title}
                      </button>
                    )}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="text-sm font-normal text-slate-600 lg:text-base dark:text-slate-400">
                    {product.shortDescription && (
                      <p className="mb-4">{product.shortDescription}</p>
                    )}
                    {product.longDescription && (
                      <div>
                        <p className="mb-4">{product.longDescription}</p>
                      </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 font-medium">
                          {t("productDetails.tags")}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              className="bg-primary-500/10 text-primary-500"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    <div className="space-y-3">
                      {product.sku && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.sku")}: {product.sku}
                          </span>
                        </div>
                      )}
                      {product.brandName && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.brand")}: {product.brandName}
                          </span>
                        </div>
                      )}
                      {product.categoryNames &&
                        product.categoryNames.length > 0 && (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                            <span>
                              {t("productDetails.category")}:{" "}
                              {product.categoryNames.join(", ")}
                            </span>
                          </div>
                        )}
                      {product.unit && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.unit")}: {product.unit}
                          </span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.weight")}: {product.weight}{" "}
                            {t("productDetails.kg")}
                          </span>
                        </div>
                      )}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.colors")}:{" "}
                            {product.colors.join(", ")}
                          </span>
                        </div>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.sizes")}:{" "}
                            {product.sizes.join(", ")}
                          </span>
                        </div>
                      )}
                      {product.seoTitle && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.seoTitle")}: {product.seoTitle}
                          </span>
                        </div>
                      )}
                      {product.seoDescription && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="inline-block h-[10px] w-[10px] rounded-full bg-slate-900 dark:bg-slate-400"></span>
                          <span>
                            {t("productDetails.seoDescription")}:{" "}
                            {product.seoDescription}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </div>

        {/* Metadata Section */}
        <div className="rounded-sm border border-slate-200 p-6 dark:border-slate-700">
          <h6 className="pb-4 text-lg font-medium text-slate-900 lg:text-xl dark:text-slate-300">
            {t("productDetails.metadata")}
          </h6>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.createdBy && (
              <div>
                <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("productDetails.createdBy")}:
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
                  {product.createdBy}
                </p>
              </div>
            )}
            {product.createdOnUtc && (
              <div>
                <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("productDetails.createdOn")}:
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
                  {formatDate(product.createdOnUtc)}
                </p>
              </div>
            )}
            {product.lastModifiedBy && (
              <div>
                <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("productDetails.lastModifiedBy")}:
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
                  {product.lastModifiedBy}
                </p>
              </div>
            )}
            {product.lastModifiedOnUtc && (
              <div>
                <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("productDetails.lastModifiedOn")}:
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
                  {formatDate(product.lastModifiedOnUtc)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews and Ratings */}
        <div className="rounded-sm border border-slate-200 p-6 dark:border-slate-700">
          <h6 className="pb-6 text-lg text-slate-900 lg:text-xl dark:text-slate-300">
            {t("productDetails.reviewsAndRatings")}
          </h6>
          <div className="space-y-12">
            <div className="bg-secondary-100 grid grid-cols-12 rounded-sm p-6 dark:bg-slate-700">
              <div className="order-2 col-span-12 mt-3 flex items-center justify-center space-x-3 md:order-1 md:col-span-6 md:mt-0 md:justify-start rtl:space-x-reverse">
                <div className="flex items-center font-medium">
                  <p className="text-base text-slate-900 lg:text-lg dark:text-slate-300">
                    4.2
                  </p>
                  <p className="text-sm text-slate-500 lg:text-base dark:text-slate-400">
                    /5
                  </p>
                </div>
                <div className="flex items-center text-sm font-normal text-slate-900 md:justify-start lg:text-base dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-slate-300/80" />
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {t("productDetails.reviews", { count: 789 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Item */}
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="h-14 w-14 flex-none overflow-hidden rounded-full bg-white object-cover ring-1">
                <img
                  className="h-full w-full object-contain"
                  src={blackJumper.src}
                />
              </div>
              <div>
                {" "}
                <div>
                  <p className="pb-1 text-sm font-medium text-slate-900 lg:text-base dark:text-slate-300">
                    Devied Beakhum
                  </p>
                  <p className="pb-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                    08-03-2023
                  </p>
                  <p className="flex items-center space-x-1.5 pb-3 text-sm font-normal text-slate-900 lg:text-base rtl:space-x-reverse dark:text-slate-300">
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                    <Icon icon="ph:star-fill" className="text-yellow-400" />
                  </p>
                  <p className="pb-4 text-sm text-slate-500 lg:text-base dark:text-slate-400">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna. Lori ipsum dolor sit amet, consetetur sadipscing
                    elitr, sed diam nonumy eirmod tempor invidunt.
                  </p>
                  <div className="flex space-x-2 pb-3 rtl:space-x-reverse">
                    <p className="text-sm font-normal text-slate-500 lg:text-base dark:text-slate-400">
                      {t("productDetails.info")}:
                    </p>
                    <p className="text-sm font-medium text-[#10B26C] lg:text-base">
                      {t("productDetails.verifiedPurchase")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-12 mb-3">
                    <div className="mb-9 flex space-x-2 rtl:space-x-reverse">
                      <div className="h-[90px] w-[90px] overflow-hidden rounded-sm bg-slate-100 p-1">
                        <img
                          className="h-full w-full object-contain"
                          src={three.src}
                        />
                      </div>
                      <div className="h-[90px] w-[90px] overflow-hidden rounded-sm bg-slate-100 p-1">
                        <img
                          className="h-full w-full object-contain"
                          src={one.src}
                        />
                      </div>
                      <div className="h-[90px] w-[90px] overflow-hidden rounded-sm bg-slate-100 p-1">
                        <img
                          className="h-full w-full object-contain"
                          src={two.src}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 flex justify-end space-x-4 rtl:space-x-reverse">
                    <p className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="cursor-pointer">
                        <Icon icon="heroicons:hand-thumb-up" />
                      </span>
                      <span>02</span>
                    </p>
                    <p className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="cursor-pointer">
                        <Icon icon="carbon:reply" />
                      </span>
                      <span>00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
