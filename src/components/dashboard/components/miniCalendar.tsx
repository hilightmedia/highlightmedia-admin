"use client";

import React from "react";
import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { cn } from "@/src/lib/util";

type MiniCalendarProps = {
  value: Date;
  activeStartDate: Date;
  onChange: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

type CalendarValue = CalendarProps["value"];

function MiniCalendar({ value, activeStartDate, onChange, onPrevMonth, onNextMonth }: MiniCalendarProps) {
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(activeStartDate);

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>{monthLabel}</span>
        <div className="flex gap-2 text-black/50">
          <button
            type="button"
            onClick={onPrevMonth}
            className="grid h-6 w-6 place-items-center rounded-lg border border-black/10 bg-white"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="grid h-6 w-6 place-items-center rounded-lg border border-black/10 bg-white"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="p-4">
        <Calendar
          value={value}
          onChange={(v: CalendarValue) => {
            const next = Array.isArray(v) ? v[0] : v;
            if (next instanceof Date) onChange(next);
          }}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={() => {}}
          showNavigation={false}
          showNeighboringMonth={false}
          selectRange={false}
          calendarType="gregory"
          minDetail="month"
          maxDetail="month"
          formatShortWeekday={(_, date) => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()]}
          formatDay={(_, date) => String(date.getDate())}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";
            const isSelected =
              date.getFullYear() === value.getFullYear() &&
              date.getMonth() === value.getMonth() &&
              date.getDate() === value.getDate();
            return cn(
              "h-7 w-7 rounded-xl border text-xs font-semibold",
              "border-black/10 bg-white text-black/80",
              isSelected && "border-[#ff6a00] bg-[#ff6a00] text-white p-0"
            );
          }}
          className={cn(
            "w-full border-0 bg-transparent p-0",
            "[&_.react-calendar__navigation]:hidden",
            "[&_.react-calendar__month-view__weekdays]:mb-2 [&_.react-calendar__month-view__weekdays]:grid [&_.react-calendar__month-view__weekdays]:grid-cols-7 [&_.react-calendar__month-view__weekdays]:gap-1.5",
            "[&_.react-calendar__month-view__weekdays__weekday]:text-center [&_.react-calendar__month-view__weekdays__weekday]:text-[11px] [&_.react-calendar__month-view__weekdays__weekday]:font-extrabold [&_.react-calendar__month-view__weekdays__weekday]:text-black/40",
            "[&_.react-calendar__month-view__weekdays__weekday_abbr]:no-underline",
            "[&_.react-calendar__month-view__days]:grid [&_.react-calendar__month-view__days]:grid-cols-7 [&_.react-calendar__month-view__days]:gap-1.5",
            "[&_.react-calendar__tile]:p-0 [&_.react-calendar__tile]:leading-none [&_.react-calendar__tile]:grid [&_.react-calendar__tile]:place-items-center",
            "[&_.react-calendar__tile--now]:bg-white [&_.react-calendar__tile--now]:text-black/80",
            "[&_.react-calendar__month-view__days__day--neighboringMonth]:invisible [&_.react-calendar__month-view__days__day--neighboringMonth]:pointer-events-none",
            "[&_.react-calendar__tile:enabled:hover]:bg-white [&_.react-calendar__tile:enabled:focus]:bg-white"
          )}
        />
      </div>
    </div>
  );
}

export default MiniCalendar;