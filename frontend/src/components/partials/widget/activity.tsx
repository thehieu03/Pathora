import React from "react";

export const lists = [
  {
    title: "Project start date",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    date: "Sep 20, 2021 ",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
  },
];
const TrackingParcel = () => {
  return (
    <ul className="relative ltr:pl-2 rtl:pr-2">
      {lists.map((item, i) => (
        <li
          key={i}
          className={`
               ${
                 item.status === "ok"
                   ? "before:opacity-100"
                   : " before:opacity-50"
               }

                 ltr:border-l-2 rtl:border-r-2 border-slate-100 dark:border-slate-700 pb-4 
                 last:border-none ltr:pl-[22px] rtl:pr-[22px] relative before:absolute ltr:before:left-[-8px] 
                 rtl:before:-right-2 before:top-[0px] before:rounded-full before:w-4 before:h-4
                  before:bg-slate-900 dark:before:bg-slate-600 before:leading-[2px] 
                  before:content-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%3E%3Cpath%20fill='white'%20d='M10.97%204.97a.75.75%200%200%201%201.07%201.05l-3.99%204.99a.75.75%200%200%201-1.08.02L4.324%208.384a.75.75%200%201%201%201.06-1.06l2.094%202.093l3.473-4.425a.267.267%200%200%201%20.02-.022z'/%3E%3C/svg%3E")] `}
        >
          <div className="p-[10px] relative top-[-20px]">
            <h2 className="text-sm font-medium dark:text-slate-400-900 mb-1 text-slate-600">
              {item.title}
            </h2>
            <p className="text-xs capitalize dark:text-slate-400">
              {item.date}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrackingParcel;
