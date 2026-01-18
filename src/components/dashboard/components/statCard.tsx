import React from "react";
import { cn } from "@/src/lib/util";

export default function StatCard({
  value,
  label,
  primary,
}: {
  value: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[58px] overflow-hidden rounded-xl border border-orange-500/10 px-4 py-3 shadow-[0_2px_10px_rgba(17,24,39,0.04)]",
        primary
          ? "border-none bg-[#ff6a00] text-white"
          : "bg-[#ffe4cf] text-black"
      )}
    >
      <div className="text-xl font-extrabold leading-none">{value}</div>
      <div
        className={cn(
          "mt-1 text-xs",
          primary ? "text-white/90" : "text-black/60"
        )}
      >
        {label}
      </div>

      <div
        className={cn(
          "absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full",
          primary ? "bg-white/25 text-white" : "bg-orange-500/10 text-[#ff6a00]"
        )}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
          <path d="M5 5h6v2H7v10h10v-4h2v6H5V5z" />
        </svg>
      </div>
    </div>
  );
}
