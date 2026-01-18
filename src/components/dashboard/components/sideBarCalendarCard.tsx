import React from "react";
import MiniCalendar from "./miniCalendar";

export default function SidebarCalendarCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>October 2025</span>
        <div className="flex gap-2 text-black/50">
          <span className="grid h-6 w-6 place-items-center rounded-lg border border-black/10 bg-white">
            ‹
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-lg border border-black/10 bg-white">
            ›
          </span>
        </div>
      </div>
      <div className="p-4">
        <MiniCalendar year={2025} monthIndex={9} selectedDay={10} />
      </div>
    </div>
  );
}
