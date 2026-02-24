"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Icon } from "@/components/ui";

const HERO_BG =
  "https://www.figma.com/api/mcp/asset/e4c27cca-3e11-49a0-bb16-22b1bdf0f4cc";
const PUBLIC_ICON =
  "https://www.figma.com/api/mcp/asset/554c0547-fd8d-4c08-bff9-b4b0129f531a";
const PRIVATE_ICON =
  "https://www.figma.com/api/mcp/asset/c0d410d5-3013-4c54-aa50-807d334a3f82";
const PEOPLE_ICON =
  "https://www.figma.com/api/mcp/asset/e4a75e02-46bb-4c17-94d3-685688ecf5a2";
const DATE_ICON =
  "https://www.figma.com/api/mcp/asset/8452a393-4dd5-406c-a3ce-2bac21cf6389";
const DEST_ICON =
  "https://www.figma.com/api/mcp/asset/bf2d5a5d-a72b-46e7-9c41-a78011b2ea6c";
const CLASS_ICON =
  "https://www.figma.com/api/mcp/asset/b067c485-6c91-4a06-98d2-87ac97fb3ae5";
const SEARCH_ICON =
  "https://www.figma.com/api/mcp/asset/c9b4683c-0ccd-4eed-bcd8-b21f304a2f34";

/* ── Calendar helpers ──────────────────────────────────────── */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

/* ── Destination / Classification data ─────────────────────── */
const DESTINATIONS = [
  "Ho Chi Minh City",
  "Ha Noi",
  "Da Nang",
  "Moscow",
  "New York",
  "California",
];
const CLASSIFICATIONS = ["Standard", "VIP", "Luxury"];
const PEOPLE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

/* ── Calendar Dropdown ─────────────────────────────────────── */
const CalendarDropdown = ({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    value?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value?.getMonth() ?? today.getMonth(),
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSelected = (day: number) =>
    value &&
    value.getDate() === day &&
    value.getMonth() === viewMonth &&
    value.getFullYear() === viewYear;

  return (
    <div className="p-4 w-[280px]">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Icon
            icon="heroicons-outline:chevron-left"
            className="w-4 h-4 text-gray-600"
          />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-4 h-4 text-gray-600"
          />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <span
            key={wd}
            className="text-[11px] text-center text-gray-400 font-medium">
            {wd}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => onChange(new Date(viewYear, viewMonth, day))}
            className={`w-8 h-8 mx-auto rounded-full text-sm flex items-center justify-center transition-colors ${
              isSelected(day)
                ? "bg-landing-accent text-white font-bold"
                : "text-gray-700 hover:bg-gray-100"
            }`}>
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── List Dropdown ─────────────────────────────────────────── */
const ListDropdown = ({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="py-2 min-w-[200px] max-h-[240px] overflow-y-auto">
    {items.map((item) => (
      <button
        key={item}
        onClick={() => onChange(item)}
        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
          value === item
            ? "bg-landing-accent/10 text-landing-accent font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}>
        {item}
      </button>
    ))}
  </div>
);

/* ── Number Dropdown ───────────────────────────────────────── */
const NumberDropdown = ({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) => (
  <div className="py-2 min-w-[180px] max-h-[240px] overflow-y-auto">
    {PEOPLE_OPTIONS.map((num) => (
      <button
        key={num}
        onClick={() => onChange(num)}
        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
          value === num
            ? "bg-landing-accent/10 text-landing-accent font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}>
        {num} {num === 1 ? "person" : "people"}
      </button>
    ))}
  </div>
);

/* ── SelectField ───────────────────────────────────────────── */
type SelectFieldProps = {
  icon: string;
  label: string;
  placeholder: string;
  rounded?: string;
  isOpen: boolean;
  onToggle: () => void;
  displayValue?: string;
  children?: React.ReactNode;
};

const SelectField = ({
  icon,
  label,
  placeholder,
  rounded,
  isOpen,
  onToggle,
  displayValue,
  children,
}: SelectFieldProps) => (
  <div className="relative w-full md:w-auto">
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white w-full text-left ${rounded ?? ""} ${
        isOpen ? "ring-2 ring-landing-accent/30" : ""
      }`}>
      <div className="w-4 h-4 md:w-6 md:h-6 shrink-0 mt-0.5 flex items-center justify-center">
        <img
          src={icon}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1 md:gap-1.5">
        <span className="text-[#333] font-semibold text-xs md:text-base leading-none">
          {label}
        </span>
        <div className="flex items-center gap-2 md:gap-4 opacity-70">
          <span
            className={`text-[10px] md:text-sm font-normal ${
              displayValue ? "text-[#333]" : "text-[#333] opacity-80"
            }`}>
            {displayValue || placeholder}
          </span>
          <Icon
            icon="heroicons-outline:chevron-down"
            className={`w-3 h-3 md:w-5 md:h-5 shrink-0 text-[#333] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </button>

    {/* Dropdown panel */}
    {isOpen && children && (
      <div className="absolute top-full left-0 right-0 md:left-auto md:right-auto md:min-w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
        {children}
      </div>
    )}
  </div>
);

type TourType = "public" | "private";
type FieldName = "people" | "date" | "destination" | "classification";

export const HeroSection = () => {
  const [tourType, setTourType] = useState<TourType>("public");
  const [openField, setOpenField] = useState<FieldName | null>(null);

  // Form state
  const [people, setPeople] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [destination, setDestination] = useState("");
  const [classification, setClassification] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  // Click-outside handler
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setOpenField(null);
    }
  }, []);

  useEffect(() => {
    if (openField) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openField, handleClickOutside]);

  const toggleField = (name: FieldName) =>
    setOpenField((prev) => (prev === name ? null : name));

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <section className="relative w-full min-h-[600px] md:h-[759px] overflow-hidden">
      <img
        src={HERO_BG}
        alt="Travel destination with beautiful scenery"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center pt-[100px] md:pt-[207px] gap-[40px] md:gap-[60px] px-4">
        <div className="flex flex-col items-center gap-4 text-white text-center">
          <h1 className="text-4xl md:text-[72px] font-normal leading-tight font-serif">
            Enjoy in the best way!
          </h1>
          <p className="text-lg md:text-2xl font-bold">
            Enjoy our services for your trip anytime
          </p>
        </div>

        <div
          ref={searchRef}
          className="bg-white/20 rounded-xl px-3 md:px-5 pt-5 pb-5 flex flex-col items-start justify-center w-full max-w-4xl">
          <div className="flex mb-[-1px]">
            <Button
              onClick={() => setTourType("public")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tl-xl transition-colors ${
                tourType === "public" ? "bg-white" : "bg-white/40"
              }`}>
              <img src={PUBLIC_ICON} alt="" className="w-5 md:w-6 h-5 md:h-6" />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "public" ? "text-landing-accent" : "text-white"
                }`}>
                Public Tours
              </span>
            </Button>
            <Button
              onClick={() => setTourType("private")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tr-xl transition-colors ${
                tourType === "private" ? "bg-white" : "bg-white/40"
              }`}>
              <img
                src={PRIVATE_ICON}
                alt=""
                className="w-5 md:w-6 h-5 md:h-6"
              />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "private" ? "text-landing-accent" : "text-white"
                }`}>
                Private Tours
              </span>
            </Button>
          </div>

          <div className="bg-white rounded-bl-xl rounded-br-xl rounded-tr-xl flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-3 p-0 md:p-3 w-full overflow-hidden md:overflow-visible">
            <SelectField
              icon={PEOPLE_ICON}
              label="Number of people"
              placeholder="Choose number"
              rounded="rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              isOpen={openField === "people"}
              onToggle={() => toggleField("people")}
              displayValue={
                people ? `${people} ${people === 1 ? "person" : "people"}` : ""
              }>
              <NumberDropdown
                value={people}
                onChange={(v) => {
                  setPeople(v);
                  setOpenField(null);
                }}
              />
            </SelectField>

            <div className="w-full h-px md:w-px md:h-[50px] bg-gray-200 shrink-0" />

            <SelectField
              icon={DATE_ICON}
              label="Date"
              placeholder="Choose Date"
              isOpen={openField === "date"}
              onToggle={() => toggleField("date")}
              displayValue={formatDate(date)}>
              <CalendarDropdown
                value={date}
                onChange={(d) => {
                  setDate(d);
                  setOpenField(null);
                }}
              />
            </SelectField>

            <div className="w-full h-px md:w-px md:h-[50px] bg-gray-200 shrink-0" />

            <SelectField
              icon={DEST_ICON}
              label="Destination"
              placeholder="Select Location"
              isOpen={openField === "destination"}
              onToggle={() => toggleField("destination")}
              displayValue={destination}>
              <ListDropdown
                items={DESTINATIONS}
                value={destination}
                onChange={(v) => {
                  setDestination(v);
                  setOpenField(null);
                }}
              />
            </SelectField>

            <div className="w-full h-px md:w-px md:h-[50px] bg-gray-200 shrink-0" />

            <SelectField
              icon={CLASS_ICON}
              label="Classification"
              placeholder="Select Classification"
              isOpen={openField === "classification"}
              onToggle={() => toggleField("classification")}
              displayValue={classification}>
              <ListDropdown
                items={CLASSIFICATIONS}
                value={classification}
                onChange={(v) => {
                  setClassification(v);
                  setOpenField(null);
                }}
              />
            </SelectField>

            <div className="p-3 md:p-0 w-full md:w-auto flex justify-center">
              <Button
                className="bg-landing-accent rounded-xl py-3 px-6 md:py-4 md:px-8 hover:bg-landing-accent-hover transition-colors shrink-0 w-full md:w-auto flex items-center justify-center gap-2"
                ariaLabel="Search tours">
                <span className="text-white font-medium text-sm md:text-base whitespace-nowrap">
                  Explore Our Tours
                </span>
                <img
                  src={SEARCH_ICON}
                  alt="Search"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
