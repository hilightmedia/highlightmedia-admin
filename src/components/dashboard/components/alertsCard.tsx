"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { formatTime } from "@/src/lib/util";
import { useRouter } from "next/router";

function AlertItem({
  title,
  sub,
  time,
  badge,
}: {
  title: string;
  sub: string;
  time: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-3">
      <div className="flex gap-3 items-center">
        <span className="rounded-md bg-[#ff6a00] px-2 py-0.5 text-center text-[11px] font-extrabold text-white">
          {badge}
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

function formatBadgeDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function buildTitle(message: string) {
  const left = (message ?? "").split("|")[0]?.trim();
  return left || "Alert";
}

function buildSub(type: string, daysLeft: number | null, message: string) {
  if (type === "VALIDITY_COMPLETED") return "completed";
  if (typeof daysLeft === "number") return `${daysLeft} days left`;
  const parts = (message ?? "").split("|");
  const sub = parts[1]?.trim();
  return sub || "expiring";
}

export default function AlertsPage() {
  const { data } = useQuery({
    queryKey: ["alerts", "all"],
    queryFn: () =>
      axiosInstance
        .get("/media/get-alerts", { params: { offset: 0, limit: 100 } })
        .then(
          (r) =>
            r.data as {
              alerts: {
                id: string;
                type: "VALIDITY_EXPIRING" | "VALIDITY_COMPLETED";
                folderId: number;
                folderName: string;
                at: string;
                message: string;
                daysLeft: number | null;
              }[];
            },
        ),
  });

  const router = useRouter();

  const items = data?.alerts ?? [];

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)] p-4 min-h-[270px]">
      <div className="flex items-center justify-between mb-3 text-sm font-bold text-black/80">
        <span>Alerts</span>
        <button
          className="text-xs font-semibold text-black/40"
          onClick={() => router.push("/alerts")}
        >
          View All
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {items.length ? (
          items.map((x) => (
            <AlertItem
              key={x.id}
              badge={formatBadgeDate(x.at)}
              title={buildTitle(x.message)}
              sub={buildSub(x.type, x.daysLeft, x.message)}
              time={formatTime(x.at)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-black/40">No Alerts</div>
        )}
      </div>
    </div>
  );
}
