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
  const { data: items } = useQuery({
    queryKey: ["analytics", "top-clients", date],
    queryFn: () =>
      axiosInstance
        .get("/analytics/top-clients", { params: { date } })
        .then((r) => r.data.items as TopClientItem[]),
  });

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
          spacing: 3,
        },
      ],
    };
  }, [items]);

  const options: any = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-black/80">
        Clients
      </div>
      <div className="grid min-h-[260px] place-items-center p-3 pb-8">
        <div className="h-[220px] w-[220px]">
          <Pie data={chart} options={options} />
        </div>
      </div>
    </div>
  );
}
