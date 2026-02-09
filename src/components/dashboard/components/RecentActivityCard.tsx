"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { useRouter } from "next/router";
import { ActivityApiItem } from "@/types/types";
import { formatTime } from "@/src/lib/util";
import ActivityItem from "./activityItem";


export default function RecentActivityCard() {
  const { data } = useQuery({
    queryKey: ["activity", "recent"],
    queryFn: () =>
      axiosInstance
        .get("/players/get-activity", { params: { offset: 0, limit: 3 } })
        .then((r) => r.data as { activity: ActivityApiItem[] }),
  });

  const items = data?.activity ?? [];
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-black/80">
        <span>Recent Activity</span>
        <button className="text-xs font-semibold text-black/40" onClick={()=> router.push('/recent-activity')}>View All</button>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-2">
        {items.length ? (
          items.map((x) => (
            <ActivityItem key={x.id} text={x.message.split("|")[0].trim()} time={formatTime(x.at)} />
          ))
        ) : (
          <ActivityItem text="No recent activity" time="" />
        )}
      </div>
    </div>
  );
}
