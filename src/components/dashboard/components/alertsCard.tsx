import React from "react";

function AlertItem({
  title,
  sub,
  time,
}: {
  title: string;
  sub: string;
  time: string;
}) {
  return (
    <div className="flex flex-col  gap-2 rounded-xl border border-black/10 bg-white p-3">
      <div className="flex gap-3 items-center">
        <span className="rounded-md bg-[#ff6a00] px-2 py-0.5 text-center text-[11px] font-extrabold text-white">
          10 Oct
        </span>
        <span className="text-xs font-semibold text-black/40">{time}</span>
      </div>

      <div className="flex flex-col">
        <div className="text-[13px] font-semibold text-black/80">{title}</div>
        <div className="text-xs font-medium text-black/40">{sub}</div>
      </div>
    </div>
  );
}

export default function AlertsCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>Alerts</span>
        <button className="text-xs font-semibold text-black/40">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-2">
        <AlertItem title="Client 1 - Media" sub="2 days left" time="7:00 AM" />
        <AlertItem title="Client 2 - Media" sub="2 days left" time="7:00 AM" />
        <AlertItem title="Client 3 - Media" sub="2 days left" time="3:00 PM" />
      </div>
    </div>
  );
}
