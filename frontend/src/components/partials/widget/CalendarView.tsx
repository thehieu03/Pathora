import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

type CalendarValue = Date | [Date | null, Date | null] | null | string;

const LazyCalendar = dynamic(() => import("react-calendar"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-90 w-full rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
    />
  ),
});

const CalendarView = () => {
  const [value, onChange] = useState<CalendarValue>(new Date());
  return (
    <div>
      <LazyCalendar
        onChange={onChange as (value: CalendarValue) => void}
        value={value}
      />
    </div>
  );
};

export default CalendarView;
