"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "./LandingImage";
import { Button, Icon } from "@/components/ui";
import { useTranslation } from "react-i18next";

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

/* ── Calendar helpers ──────────────────────────────────────── */

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

/* ── Destination / Classification data ─────────────────────── */
const DEFAULT_DESTINATIONS = [
  "Ho Chi Minh City",
  "Ha Noi",
  "Da Nang",
  "Moscow",
  "New York",
  "California",
];
const DEFAULT_CLASSIFICATIONS = ["Standard", "VIP", "Luxury"];
const DEFAULT_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PEOPLE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

/* ── Calendar Dropdown ─────────────────────────────────────── */
const CalendarDropdown = ({
  value,
  onChange,
  locale,
  weekdayLabels,
  previousMonthLabel,
  nextMonthLabel,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  locale: string;
  weekdayLabels: string[];
  previousMonthLabel: string;
  nextMonthLabel: string;
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
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(viewYear, viewMonth, 1),
  );
  const resolvedWeekdayLabels =
    weekdayLabels.length === 7 ? weekdayLabels : DEFAULT_WEEKDAYS;

  return (
    <div className="p-4 w-80 max-w-[calc(100vw-2rem)]">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          aria-label={previousMonthLabel}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Icon
            icon="heroicons-outline:chevron-left"
            className="w-4 h-4 text-gray-600"
          />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {monthLabel} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label={nextMonthLabel}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-4 h-4 text-gray-600"
          />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {resolvedWeekdayLabels.map((wd) => (
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
            type="button"
            key={day}
            onClick={() => onChange(new Date(viewYear, viewMonth, day))}
            className={`w-11 h-11 mx-auto rounded-full text-sm flex items-center justify-center transition-colors ${
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
  <div className="py-2 min-w-50 max-h-60 overflow-y-auto">
    {items.map((item) => (
      <button
        type="button"
        key={item}
        onClick={() => onChange(item)}
        className={`w-full min-h-11 text-left px-4 py-2.5 text-sm transition-colors ${
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
  singleLabel,
  pluralLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  singleLabel: string;
  pluralLabel: string;
}) => (
  <div className="py-2 min-w-45 max-h-60 overflow-y-auto">
    {PEOPLE_OPTIONS.map((num) => (
      <button
        type="button"
        key={num}
        onClick={() => onChange(num)}
        className={`w-full min-h-11 text-left px-4 py-2.5 text-sm transition-colors ${
          value === num
            ? "bg-landing-accent/10 text-landing-accent font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}>
        {num} {num === 1 ? singleLabel : pluralLabel}
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
  <div className="relative w-full h-full">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-haspopup={children ? "listbox" : undefined}
      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 min-h-11 bg-white w-full text-left overflow-hidden ${rounded ?? ""} ${
        isOpen ? "ring-2 ring-landing-accent/30" : ""
      }`}>
      <div className="relative w-4 h-4 md:w-6 md:h-6 shrink-0 flex items-center justify-center">
        <Image src={icon} alt="" fill sizes="24px" className="object-contain" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 md:gap-1 w-full">
        <span className="text-[#333] font-semibold text-xs md:text-sm leading-tight truncate w-full block">
          {label}
        </span>
        <div className="flex min-w-0 items-center justify-between gap-1 w-full opacity-70">
          <span
            className={`text-[10px] md:text-xs font-normal truncate flex-1 ${
              displayValue ? "text-[#333]" : "text-[#333] opacity-80"
            }`}>
            {displayValue || placeholder}
          </span>
          <Icon
            icon="heroicons-outline:chevron-down"
            className={`w-3 h-3 md:w-4 md:h-4 shrink-0 text-[#333] transition-transform ${
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
  const { t, i18n } = useTranslation();
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
  const locale = (i18n.resolvedLanguage || i18n.language || "en").toLowerCase();
  const translatedDestinations = t("landing.hero.destinations", {
    returnObjects: true,
  }) as string[];
  const translatedClassifications = t("landing.hero.classifications", {
    returnObjects: true,
  }) as string[];
  const translatedWeekdays = t("landing.hero.weekdays", {
    returnObjects: true,
  }) as string[];
  const destinations =
    Array.isArray(translatedDestinations) && translatedDestinations.length > 0
      ? translatedDestinations
      : DEFAULT_DESTINATIONS;
  const classifications =
    Array.isArray(translatedClassifications) &&
    translatedClassifications.length > 0
      ? translatedClassifications
      : DEFAULT_CLASSIFICATIONS;
  const weekdays =
    Array.isArray(translatedWeekdays) && translatedWeekdays.length === 7
      ? translatedWeekdays
      : DEFAULT_WEEKDAYS;

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <section className="relative w-full min-h-150 md:h-189.75 overflow-hidden">
      <Image
        src={HERO_BG}
        alt={t("landing.hero.backgroundAlt")}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center pt-25 md:pt-51.75 gap-10 md:gap-15 px-4">
        <div className="flex flex-col items-center gap-4 text-white text-center w-full max-w-5xl">
          <h1 className="h-24 md:h-40 flex items-center justify-center text-4xl md:text-[72px] font-normal leading-tight font-serif overflow-hidden">
            {t("landing.hero.title")}
          </h1>
          <p className="h-7 md:h-8 overflow-hidden text-lg md:text-2xl font-bold">
            {t("landing.hero.subtitle")}
          </p>
        </div>

        <div
          ref={searchRef}
          className="bg-white/20 rounded-xl px-3 md:px-5 pt-5 pb-5 flex flex-col items-start justify-center w-full max-w-4xl">
          <div className="flex -mb-px">
            <Button
              onClick={() => setTourType("public")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tl-xl transition-colors ${
                tourType === "public" ? "bg-white" : "bg-white/40"
              }`}>
              <Image
                src={PUBLIC_ICON}
                alt=""
                width={24}
                height={24}
                className="w-5 md:w-6 h-5 md:h-6"
              />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "public" ? "text-landing-accent" : "text-white"
                }`}>
                {t("landing.hero.publicTours")}
              </span>
            </Button>
            <Button
              onClick={() => setTourType("private")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tr-xl transition-colors ${
                tourType === "private" ? "bg-white" : "bg-white/40"
              }`}>
              <Image
                src={PRIVATE_ICON}
                alt=""
                width={24}
                height={24}
                className="w-5 md:w-6 h-5 md:h-6"
              />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "private" ? "text-landing-accent" : "text-white"
                }`}>
                {t("landing.hero.privateTours")}
              </span>
            </Button>
          </div>

          <div className="bg-white rounded-bl-xl rounded-br-xl rounded-tr-xl flex flex-col md:flex-row items-stretch md:items-center gap-0 w-full">
            <div className="relative w-full md:flex-[1.2] md:min-w-0">
              <SelectField
                icon={PEOPLE_ICON}
                label={t("landing.hero.fields.people.label")}
                placeholder={t("landing.hero.fields.people.placeholder")}
                rounded="rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                isOpen={openField === "people"}
                onToggle={() => toggleField("people")}
                displayValue={
                  people
                    ? `${people} ${
                        people === 1
                          ? t("landing.hero.fields.people.single")
                          : t("landing.hero.fields.people.plural")
                      }`
                    : ""
                }>
                <NumberDropdown
                  value={people}
                  onChange={(v) => {
                    setPeople(v);
                    setOpenField(null);
                  }}
                  singleLabel={t("landing.hero.fields.people.single")}
                  pluralLabel={t("landing.hero.fields.people.plural")}
                />
              </SelectField>
            </div>

            <div className="w-full h-px md:w-px md:h-12.5 bg-gray-200 shrink-0" />

            <div className="relative w-full md:flex-1 md:min-w-0">
              <SelectField
                icon={DATE_ICON}
                label={t("landing.hero.fields.date.label")}
                placeholder={t("landing.hero.fields.date.placeholder")}
                isOpen={openField === "date"}
                onToggle={() => toggleField("date")}
                displayValue={formatDate(date)}>
                <CalendarDropdown
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    setOpenField(null);
                  }}
                  locale={locale}
                  weekdayLabels={weekdays}
                  previousMonthLabel={t("landing.hero.calendar.previousMonth")}
                  nextMonthLabel={t("landing.hero.calendar.nextMonth")}
                />
              </SelectField>
            </div>

            <div className="w-full h-px md:w-px md:h-12.5 bg-gray-200 shrink-0" />

            <div className="relative w-full md:flex-[1.1] md:min-w-0">
              <SelectField
                icon={DEST_ICON}
                label={t("landing.hero.fields.destination.label")}
                placeholder={t("landing.hero.fields.destination.placeholder")}
                isOpen={openField === "destination"}
                onToggle={() => toggleField("destination")}
                displayValue={destination}>
                <ListDropdown
                  items={destinations}
                  value={destination}
                  onChange={(v) => {
                    setDestination(v);
                    setOpenField(null);
                  }}
                />
              </SelectField>
            </div>

            <div className="w-full h-px md:w-px md:h-12.5 bg-gray-200 shrink-0" />

            <div className="relative w-full md:flex-[1.1] md:min-w-0">
              <SelectField
                icon={CLASS_ICON}
                label={t("landing.hero.fields.classification.label")}
                placeholder={t(
                  "landing.hero.fields.classification.placeholder",
                )}
                isOpen={openField === "classification"}
                onToggle={() => toggleField("classification")}
                displayValue={classification}>
                <ListDropdown
                  items={classifications}
                  value={classification}
                  onChange={(v) => {
                    setClassification(v);
                    setOpenField(null);
                  }}
                />
              </SelectField>
            </div>

            <div className="p-3 md:p-0 md:pl-2 w-full md:w-auto md:shrink-0 flex justify-center">
              <Button
                className="bg-landing-accent rounded-lg md:rounded-xl h-11 md:h-12 px-4 md:px-5 hover:bg-landing-accent-hover transition-colors shrink-0 w-full md:w-full flex items-center justify-center gap-2"
                ariaLabel={t("landing.hero.searchAria")}>
                <span className="text-white font-medium text-sm md:text-base whitespace-nowrap">
                  {t("landing.hero.exploreTours")}
                </span>
                <Icon
                  icon="heroicons-outline:search"
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
