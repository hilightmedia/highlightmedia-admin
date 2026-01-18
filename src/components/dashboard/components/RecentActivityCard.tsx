import React from "react";

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
      <div className="h-9 w-9 rounded-full border border-orange-500/15 bg-[#ffe4cf]" />
      <div className="flex flex-1 flex-col">
        <div className="text-[13px] font-semibold text-black/80">{text}</div>
        <div className="text-xs font-semibold text-black/40">{time}</div>
      </div>
    </div>
  );
}

export default function RecentActivityCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>Recent Activity</span>
        <button className="text-xs font-semibold text-black/40">View All</button>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-2">
        <ActivityItem text="Player- Theppakulam was active" time="2:46 PM" />
        <ActivityItem text="Player- Theppakulam, Simmakal went Offline" time="3:30 PM" />
        <ActivityItem text="Player- Theppakulam was active" time="4:12 PM" />
      </div>
    </div>
  );
}
