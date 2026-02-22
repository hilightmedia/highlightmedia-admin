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

export default function MiniCalendar({
  value,
  activeStartDate,
  onChange,
  onPrevMonth,
  onNextMonth,
}: MiniCalendarProps) {
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(activeStartDate);

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>{monthLabel}</span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="grid h-6 w-6 place-items-center rounded border"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            className="grid h-6 w-6 place-items-center rounded border"
          >
            ›
          </button>
        </div>
      </div>

      <div className="p-4">
        <Calendar
          locale="en-US"
          calendarType="gregory"
          value={value}
          activeStartDate={activeStartDate}
          className="mini-calendar"
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) {
              onChange(
                new Date(
                  activeStartDate.getFullYear(),
                  activeStartDate.getMonth(),
                  value.getDate(),
                ),
              );
            }
          }}
          onChange={(v: CalendarValue) => {
            const next = Array.isArray(v) ? v[0] : v;
            if (next instanceof Date) onChange(next);
          }}
          showNavigation={false}
          showNeighboringMonth={false}
          selectRange={false}
          minDetail="month"
          maxDetail="month"
          formatShortWeekday={(_, date) =>
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()]
          }
          formatDay={(_, date) => String(date.getDate())}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";

            const isSelected =
              date.getFullYear() === value.getFullYear() &&
              date.getMonth() === value.getMonth() &&
              date.getDate() === value.getDate();

            return cn(
              "h-8 w-8 flex items-center justify-center rounded text-xs font-semibold",
              isSelected
                ? "bg-orange-500 text-white"
                : "text-black/80",
            );
          }}
        />
      </div>
    </div>
  );
}