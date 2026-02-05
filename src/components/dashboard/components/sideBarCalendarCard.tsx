import { useState } from "react";
import MiniCalendar from "./miniCalendar";

export default function SidebarCalendarCard() {
  const [value, setValue] = useState<Date>(new Date(2025, 9, 10));
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date(2025, 9, 1));

  const goPrev = () => setActiveStartDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () => setActiveStartDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const onChange = (date: Date) => {
    setValue(date);
    setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <MiniCalendar
      value={value}
      activeStartDate={activeStartDate}
      onChange={onChange}
      onPrevMonth={goPrev}
      onNextMonth={goNext}
    />
  );
}
