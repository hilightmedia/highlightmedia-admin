import { useState } from "react";
import MiniCalendar from "./miniCalendar";
interface Props {
  value: string;
  onChange: (value: string) => void;
}
export default function SidebarCalendarCard(props: Props) {
  const { value: defaultValue, onChange: onDateChange } = props;
  const [value, setValue] = useState<Date>(new Date(defaultValue));

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(defaultValue),
  );

  const goPrev = () =>
    setActiveStartDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () =>
    setActiveStartDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const onChange = (date: Date) => {
    setValue(date);
    setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
    const d = date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    onDateChange(`${y}-${m}-${day}`);
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
