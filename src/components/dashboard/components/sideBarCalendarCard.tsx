"use client";

import { useEffect, useState } from "react";
import MiniCalendar from "./miniCalendar";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const parseLocalDate = (str?: string) => {
  if (!str) return new Date();
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function SidebarCalendarCard({
  value: defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState<Date>(() =>
    parseLocalDate(defaultValue),
  );

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );

  useEffect(() => {
    const parsed = parseLocalDate(defaultValue);
    setValue(parsed);
    setActiveStartDate(
      new Date(parsed.getFullYear(), parsed.getMonth(), 1),
    );
  }, [defaultValue]);

  const goPrev = () =>
    setActiveStartDate(
      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
    );

  const goNext = () =>
    setActiveStartDate(
      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
    );

  const handleChange = (date: Date) => {
    setValue(date);
    setActiveStartDate(
      new Date(date.getFullYear(), date.getMonth(), 1),
    );

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    onChange(`${y}-${m}-${d}`);
  };

  return (
    <MiniCalendar
      value={value}
      activeStartDate={activeStartDate}
      onChange={handleChange}
      onPrevMonth={goPrev}
      onNextMonth={goNext}
    />
  );
}