import React from "react";
import dynamic from "next/dynamic";
import world from "@/constant/world-map.json";

const VectorMap = dynamic(() =>
  import("@south-paw/react-vector-maps").then((m) => m.VectorMap),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-70 w-full rounded bg-slate-100 dark:bg-slate-800 animate-pulse dash-codevmap"
      />
    ),
  },
);

const sales = [
  {
    title: "Nevada",
    amount: "(80%)",
    cls: "bg-primary-500 ring-primary-500",
  },
  {
    title: "Ohio",
    amount: "(75%)",
    cls: "bg-success-500 ring-success-500",
  },
  {
    title: "Montana",
    amount: "(65%)",
    cls: "bg-info-500 ring-info-500",
  },
  {
    title: "Iowa",
    amount: "(85%)",
    cls: "bg-warning-500 ring-warning-500",
  },
  {
    title: "Arkansas",
    amount: "(90%)",
    cls: "bg-success-500 ring-success-500",
  },
];

const MostSales2 = ({ filterMap }) => {
  return (
    <div>
      <VectorMap {...world} className="h-70 w-full dash-codevmap" />
      <ul className="bg-slate-50 dark:bg-slate-900 rounded-sm p-4 min-w-46 mt-8 flex justify-between flex-wrap items-center text-center">
        {sales.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
            <span className="block space-x-2 rtl:space-x-reverse">
              <span
                className={`${item.cls} inline-flex h-1.5 w-1.5 bg-primary-500 ring-opacity-25 rounded-full ring-4`}
              ></span>
              <span>{item.title}</span>
            </span>
            <span className="block mt-1">{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostSales2;
