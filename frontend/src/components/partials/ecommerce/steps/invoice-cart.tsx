import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const InvoiceCart = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h4 className="pb-4 text-2xl font-medium text-slate-900 dark:text-slate-300">
          Thank You for Your Order!
        </h4>
        <p className="text-base font-normal text-slate-900 dark:text-slate-300">
          A copy or your order summary has been sent to
          <span className="ml-1 cursor-pointer text-base font-medium dark:text-slate-400">
            customer@example.com
          </span>
        </p>
      </div>
      <div className="rounded-sm border p-3 lg:p-6 dark:border-slate-700">
        <p className="mb-4 border-b pb-3 text-base font-medium text-slate-900 dark:border-slate-700 dark:text-slate-300">
          Order Summary
        </p>
        <div className="space-y-3 md:flex md:space-x-3 lg:space-x-5">
          <div className="flex-1">
            <div className="flex space-x-2 lg:space-x-12 rtl:space-x-reverse">
              <div className="min-w-27.5 space-y-3 text-xs font-medium text-slate-900 md:text-sm dark:text-slate-300">
                <p>Order Date:</p>
                <p>Name:</p>
                <p>Email:</p>
                <p>Shipping address:</p>
              </div>
              <div className="min-w-27.5 space-y-3 text-xs font-normal text-slate-900 md:text-sm dark:text-slate-300">
                <p>23-07-2023 09:53 AM</p>
                <p>Prantik Chakraborty</p>
                <p>customer.example@gmail.com</p>
                <p>
                  3947 West Side Avenue Hackensack, NJ 07601, College, United
                  States
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex space-x-2 lg:space-x-12 rtl:space-x-reverse">
              <div className="min-w-27.5 space-y-3 text-xs font-medium text-slate-900 md:text-sm dark:text-slate-300">
                <p>Order Status:</p>
                <p>Total order amount:</p>
                <p>Shipping:</p>
                <p>Payment method:</p>
              </div>
              <div className="min-w-27.5 space-y-3 text-xs font-normal text-slate-900 md:text-sm dark:text-slate-300">
                <p>Pending</p>
                <p>$350.00</p>
                <p>Flat shipping rate</p>
                <p>Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 text-center text-xl font-normal text-slate-900 lg:text-2xl dark:text-slate-300">
        Order Code:{" "}
        <span className="text-xl font-medium lg:text-2xl">
          20230723-09532646
        </span>
      </div>
      <div className="rounded-sm p-3 md:p-6">
        <p className="pb-3 text-base font-medium text-slate-900 dark:text-slate-300">
          Order Details
        </p>
        <div className="space-y-7 bg-white dark:bg-slate-800">
          <div className="overflow-x-auto table-responsive border-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full table-fixed divide-y divide-slate-100 dark:divide-slate-700">
                  <thead className="border-slate-00 border-0 dark:border-slate-700">
                    <tr>
                      <th
                        scope="col"
                        className="table-th pl-0 text-sm font-medium text-slate-900 normal-case lg:text-base ltr:text-left last:ltr:text-right rtl:pr-0 rtl:text-right last:rtl:text-left dark:text-slate-300"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="table-th text-sm font-medium text-slate-900 normal-case lg:text-base ltr:text-left last:ltr:text-right rtl:text-right last:rtl:text-left dark:text-slate-300"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="table-th text-sm font-medium text-slate-900 normal-case lg:text-base ltr:text-left last:ltr:text-right rtl:text-right last:rtl:text-left dark:text-slate-300"
                      >
                        Delivery Type
                      </th>
                      <th
                        scope="col"
                        className="table-th pr-0 text-sm font-medium text-slate-900 normal-case lg:text-base ltr:text-left last:ltr:text-right rtl:pl-0 rtl:text-right last:rtl:text-left dark:text-slate-300"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
                    {items?.map((item, i) => (
                      <tr key={i}>
                        <td className="table-td flex items-center space-x-3 pb-3 pl-0 ltr:text-left last:ltr:text-right rtl:space-x-reverse rtl:pr-0 rtl:text-right last:rtl:text-left">
                          <div className="h-16 w-16 flex-none rounded-sm bg-slate-200 p-2 md:h-20 md:w-20 md:p-4 rtl:ml-3">
                            <img
                              className="h-full w-full object-contain"
                              src={item.img}
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="w-37.5 truncate pb-1 text-sm font-normal text-slate-900 md:pb-2 lg:w-95 lg:text-base dark:text-slate-300">
                              {item.name}
                            </p>
                          </div>
                        </td>
                        <td className="table-td pb-3 text-sm font-normal text-slate-900 lg:text-base ltr:text-left last:ltr:text-right rtl:text-right last:rtl:text-left dark:text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="table-td pb-3 text-sm font-normal text-slate-900 lg:text-base ltr:text-left last:ltr:text-right rtl:text-right last:rtl:text-left dark:text-slate-300">
                          Home Delivery
                        </td>
                        <td className="table-td pr-0 pb-3 text-sm font-normal text-slate-900 lg:text-base ltr:text-left last:ltr:text-right rtl:pl-0 rtl:text-right last:rtl:text-left dark:text-slate-300">
                          $180.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 items-center justify-end border-t py-3 md:flex lg:py-6 dark:border-slate-700">
                  <div className="min-w-67.5 flex-none space-y-3">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          Subtotal:
                        </span>
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          ${totalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          Tax:
                        </span>
                        <span className="text-xs font-normal text-slate-700 lg:text-sm dark:text-slate-300">
                          $00.00
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          Shipping:
                        </span>
                        <span className="text-xs font-normal text-slate-700 lg:text-sm dark:text-slate-300">
                          $00.00
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          Coupon Discount:
                        </span>
                        <span className="text-xs font-normal text-slate-700 lg:text-sm dark:text-slate-300">
                          $00.00
                        </span>
                      </div>
                    </div>
                    <div className="border-t dark:border-slate-700">
                      <div className="flex justify-between pt-3">
                        <span className="text-xs font-medium text-slate-900 lg:text-sm dark:text-slate-300">
                          Total:
                        </span>
                        <span className="text-xs text-slate-900 lg:text-sm dark:text-slate-300">
                          ${totalPrice}
                        </span>
                      </div>
                    </div>
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

export default InvoiceCart;
