"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = { date: string };

type TopClientItem = {
  folderId: number;
  folderName: string;
  adsPlayed: number;
};

export default function ClientsPieCard({ date }: Props) {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["analytics", "top-clients", date],
    queryFn: () =>
      axiosInstance
        .get("/analytics/top-clients", { params: { date } })
        .then((r) => r.data.items as TopClientItem[]),
  });

  const hasData = (Array.isArray(items) && items.length > 0) ? items.some((x) => x.adsPlayed > 0) : false;

  const chart = useMemo(() => {
    const list = items ?? [];
    const labels = list.length ? list.map((x) => x.folderName) : ["No Data"];
    const values = list.length ? list.map((x) => x.adsPlayed) : [1];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#ff6a00", "#ff8a3d", "#ffb07a", "#ffd1b3", "#ffe3d3"],
          borderWidth: 0,
          spacing: 0,
        },
      ],
    };
  }, [items]);

  const options: any = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: hasData },
    },
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-black/80">
        Clients
      </div>

      <div className="grid min-h-[260px] place-items-center p-3 pb-8">
        {isLoading ? (
          <div className="grid place-items-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
            <div className="mt-3 text-sm text-black/60">Loading…</div>
          </div>
        ) : isError ? (
          <div className="grid place-items-center text-center">
            <div className="text-sm font-semibold text-black/80">Couldn&apos;t load</div>
            <div className="mt-1 text-xs text-black/50">Please try again.</div>
          </div>
        ) : !hasData ? (
          <div className="grid place-items-center text-center px-6">
            <div className="text-sm font-semibold text-black/80">No data</div>
            <div className="mt-1 text-xs text-black/50">
              There are no plays in the selected date range.
            </div>
          </div>
        ) : (
          <div className="h-[220px] w-[220px]">
            <Pie data={chart} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
