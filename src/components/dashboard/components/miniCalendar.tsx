import React from "react";
import { cn } from "@/src/lib/util";

export default function MiniCalendar({
  year,
  monthIndex, // 0-based (0=Jan)
  selectedDay = 10,
}: {
  year: number;
  monthIndex: number;
  selectedDay?: number;
}) {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  const cells = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startOffset + 1;
    return dayNum >= 1 && dayNum <= lastDay ? dayNum : null;
  });

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <div key={d} className="text-center text-[11px] font-extrabold text-black/40">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, idx) => {
          const isSelected = d === selectedDay;
          return (
            <div
              key={idx}
              className={cn(
                "grid h-7 place-items-center rounded-xl border text-xs font-semibold",
                d ? "border-black/10 bg-white text-black/80" : "border-transparent bg-transparent text-transparent",
                isSelected && "border-[#ff6a00] bg-[#ff6a00] text-white"
              )}
            >
              {d ?? "0"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
