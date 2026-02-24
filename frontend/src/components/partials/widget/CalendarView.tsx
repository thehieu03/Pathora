import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type CalendarValue = Date | [Date | null, Date | null] | null | string;

const CalendarView = () => {
  const [value, onChange] = useState<CalendarValue>(new Date());
  return (
    <div>
      <Calendar
        onChange={onChange as (value: CalendarValue) => void}
        value={value}
      />
    </div>
  );
};

export default CalendarView;
