"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

// import images
import img1 from "@/assets/images/all-img/big-shap1.png";
import img2 from "@/assets/images/all-img/big-shap2.png";
import img3 from "@/assets/images/all-img/big-shap3.png";
import img4 from "@/assets/images/all-img/big-shap4.png";

const tables = [
  {
    title: "Advanced",
    price_Yearly: "$96",
    price_Monthly: "$26",
    button: "Buy now",
    bg: "bg-warning-500/15 bg-warning-500/30 ",
    img: img1,
  },
  {
    title: "Business",
    price_Yearly: "$196",
    price_Monthly: "$20",
    button: "Buy now",
    bg: "bg-info-500/15 bg-info-500/30 ",
    ribon: "Most popular",
    img: img2,
  },
  {
    title: "Basic",
    price_Yearly: "$26",
    price_Monthly: "$16",
    button: "Try it free",
    bg: "bg-success-500/15 bg-success-500/30 ",
    img: img3,
  },
  {
    title: "Got a large team?",
    price_Yearly: "$126",
    price_Monthly: "$16",
    button: "Request a quote",
    bg: "bg-primary-500/15 bg-primary-500/30 ",
    img: img4,
  },
];
const tables2 = [
  {
    title: "Advanced",
    price_Yearly: "$96",
    price_Monthly: "$26",
    button: "Buy now",
    bg: "bg-white",
  },
  {
    title: "Business",
    price_Yearly: "$196",
    price_Monthly: "$20",
    button: "Buy now",
    bg: "bg-slate-900",
    ribon: "Most popular",
  },
  {
    title: "Basic",
    price_Yearly: "$26",
    price_Monthly: "$16",
    button: "Try it free",
    bg: "bg-white",
  },
  {
    title: "Got a large team?",
    price_Yearly: "$126",
    price_Monthly: "$16",
    button: "Request a quote",
    bg: "bg-white",
  },
];
const PricingPage = () => {
  const [check, setCheck] = useState(true);
  const toggle = () => {
    setCheck(!check);
  };

  return (
    <div>
      <div className="space-y-5">
        <Card>
          <div className="mb-6 flex justify-between">
            <h4 className="text-xl font-medium text-slate-900 dark:text-slate-300">
              Packages
            </h4>
            <label className="inline-flex cursor-pointer rounded border border-slate-400! p-1 text-sm">
              <input type="checkbox" onChange={toggle} hidden />
              <span
                className={` ${
                  check
                    ? "bg-slate-900 text-white dark:bg-slate-900"
                    : "dark:text-slate-300"
                } rounded px-[18px] py-1 transition duration-100`}
              >
                Yearly
              </span>
              <span
                className={` ${
                  !check
                    ? "bg-slate-900 text-white dark:bg-slate-900"
                    : "dark:text-slate-300"
                } rounded px-[18px] py-1 transition duration-100`}
              >
                Monthly
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tables.map((item, i) => (
              <div
                className={` ${item.bg} price-table relative z-1 overflow-hidden rounded-[6px] p-6 text-slate-900 dark:text-white`}
                key={i}
              >
                <div className="overlay absolute top-0 right-0 z-[-1] h-full w-full">
                  <img src={item.img.src} alt="" className="ml-auto block" />
                </div>
                {item.ribon && (
                  <div className="absolute top-6 transform bg-slate-900 px-10 py-2 text-center text-sm font-medium text-white ltr:-right-[43px] ltr:rotate-[45deg] rtl:-left-[43px] rtl:-rotate-45 dark:bg-slate-900">
                    {item.ribon}
                  </div>
                )}
                <header className="mb-6">
                  <h4 className="mb-5 text-xl">{item.title}</h4>
                  <div className="relative mb-5 flex items-center space-x-4 rtl:space-x-reverse">
                    {check ? (
                      <span className="text-[32px] leading-10 font-medium">
                        {item.price_Yearly}{" "}
                      </span>
                    ) : (
                      <span className="text-[32px] leading-10 font-medium">
                        {item.price_Monthly}
                      </span>
                    )}

                    <span className="text-warning-500 inline-block h-auto rounded-full bg-white px-3 py-1 text-xs font-medium uppercase">
                      Save 20%
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    per user/month, annually
                  </p>
                </header>
                <div className="price-body space-y-8">
                  <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                    Designed for teams who need to manage complex workflows with
                    more automation and integration.
                  </p>
                  <div>
                    <Button
                      text={item.button}
                      className="btn-outline-dark w-full dark:border-slate-400!"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tables2.map((item, i) => (
            <div
              className={`${item.bg} price-table shadow-base relative z-1 overflow-hidden rounded-[6px] p-6 text-slate-900 dark:bg-slate-800 dark:text-white`}
              key={i}
            >
              {item.ribon && (
                <div className="absolute top-6 transform bg-white px-10 py-2 text-center text-sm font-medium text-slate-900 ltr:-right-[43px] ltr:rotate-[45deg] rtl:-left-[43px] rtl:-rotate-45 dark:bg-slate-700 dark:text-slate-300">
                  {item.ribon}
                </div>
              )}
              <header className="mb-6">
                <h4
                  className={` ${
                    item.bg === "bg-slate-900"
                      ? "text-slate-100"
                      : "text-slate-900 dark:text-slate-300"
                  } mb-5 text-xl`}
                >
                  {item.title}
                </h4>
                <div
                  className={` ${
                    item.bg === "bg-slate-900"
                      ? "text-slate-100"
                      : "text-slate-900 dark:text-slate-300"
                  } relative mb-5 flex items-center space-x-4 rtl:space-x-reverse`}
                >
                  {check ? (
                    <span className="text-[32px] leading-10 font-medium">
                      {item.price_Yearly}{" "}
                    </span>
                  ) : (
                    <span className="text-[32px] leading-10 font-medium">
                      {item.price_Monthly}
                    </span>
                  )}

                  <span className="bg-warning-50 text-warning-500 inline-block h-auto rounded-full px-2 py-1 text-xs font-medium uppercase dark:bg-slate-700">
                    Save 20%
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    item.bg === "bg-slate-900"
                      ? "text-slate-100"
                      : "text-slate-500 dark:text-slate-300"
                  } `}
                >
                  per user/month, annually
                </p>
              </header>
              <div className="price-body space-y-8">
                <p
                  className={` ${
                    item.bg === "bg-slate-900"
                      ? "text-slate-100"
                      : "text-slate-600 dark:text-slate-300"
                  } text-sm leading-5`}
                >
                  Designed for teams who need to manage complex workflows with
                  more automation and integration.
                </p>
                <div>
                  <Button
                    text={item.button}
                    className={`w-full ${
                      item.bg === "bg-slate-900"
                        ? "border border-slate-300! text-slate-100"
                        : "btn-outline-dark dark:border-slate-400!"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
