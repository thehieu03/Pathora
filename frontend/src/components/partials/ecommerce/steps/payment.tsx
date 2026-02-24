import React, { useState } from "react";
import { payments } from "@/constant/data";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Payment = () => {
  const [payment, setPayment] = useState("bkash");
  const [checked, setChecked] = useState(false);
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <div className="card rounded-xs p-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7">
          <h3 className="pb-3 text-base font-medium text-slate-900 dark:text-slate-300">
            Select a Payment Option
          </h3>
          <div className="card rounded-xs border p-5 dark:border-slate-700">
            <div className="space-x-5 rtl:space-x-reverse">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                {payments.map((pay, i) => {
                  return (
                    <button onClick={() => setPayment(pay.value)} key={i}>
                      <div
                        className={`${
                          pay.value === payment
                            ? "ring-primary-500 scale-105 text-slate-900 ring-1 dark:text-white"
                            : "scale-100"
                        } cursor-pointer rounded border border-slate-300 p-2 text-center ring-0 transition-all duration-150 dark:border-slate-700`}
                      >
                        <div>
                          <img
                            className="h-full w-full object-cover"
                            src={pay.img as string}
                            alt=""
                          />
                        </div>
                        <p className="pt-2">{pay.value}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 rtl:space-x-reverse">
            <div className="text-base text-gray-500">
              <Checkbox
                value={checked}
                onChange={() => setChecked(!checked)}
                label={
                  <>
                    <span>I agree to the</span>
                    <span className="font-medium text-slate-900 dark:text-slate-300">
                      {" "}
                      terms and conditions, Return Policy & Privacy Policy
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <h3 className="pb-3 text-base font-medium text-slate-900 dark:text-slate-300">
            Summary
          </h3>
          <div className="card rounded-xs border p-4 dark:border-slate-700">
            <div>
              <ul className="divide-y divide-slate-300 pb-8 dark:divide-slate-600!">
                <li className="pb-3 text-xs">
                  <div className="flex justify-between">
                    <p>Product</p>
                    <p>Total</p>
                  </div>
                </li>
                {items?.map((item, i) => (
                  <li
                    className="py-2 text-sm text-slate-600 dark:text-slate-300"
                    key={i}
                  >
                    <div className="flex justify-between gap-3 pb-1">
                      <p>
                        {item.name}
                        <span className="px-2 font-medium text-slate-800 dark:text-slate-300">
                          x
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-300">
                          {item.quantity}
                        </span>
                      </p>
                      <p className="font-medium text-slate-800 dark:text-slate-300">
                        ${item.price}
                      </p>
                    </div>
                  </li>
                ))}

                <li className="py-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium text-slate-900 dark:text-slate-300">
                      Total
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-300">
                      ${totalPrice}
                    </p>
                  </div>
                </li>
              </ul>

              <InputGroup
                type="text"
                placeholder="Have coupon code? Apply here "
                append={<Button text="Apply" className="btn btn-dark" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
