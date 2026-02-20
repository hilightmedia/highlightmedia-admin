"use client";

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = { date: string };

type TopPlayerItem = {
  playerId: number;
  playerName: string;
  adsPlayed: number;
};

const wrapLabel = (s: string) => {
  const parts = String(s || "").split(/\s+|_/g).filter(Boolean);
  if (parts.length <= 1) return s;
  const a = parts.slice(0, Math.ceil(parts.length / 2)).join(" ");
  const b = parts.slice(Math.ceil(parts.length / 2)).join(" ");
  return `${a}\n${b}`;
};

export default function PlayersBarCard({ date }: Props) {
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ["analytics", "top-players", date],
    queryFn: () =>
      axiosInstance
        .get("/analytics/top-players", { params: { date } })
        .then((r) => r.data.items as TopPlayerItem[]),
  });

  const chart = useMemo(() => {
    const list = ((Array.isArray(items) && items.length > 0) && items.some((x) => x.adsPlayed > 0)) ? items : []
    const labels = list.length ? list.map((x) => wrapLabel(x.playerName)) : ["No Data"];
    const values = list.length ? list.map((x) => x.adsPlayed) : [0];

    const bg = ["#ff6a00", "#ff8a3d", "#ff8a3d", "#ffb07a", "#ffd1b3"];

    return {
      labels,
      datasets: [
        {
          label: "Ads",
          data: values,
          backgroundColor: values.map((_, i) => bg[i % bg.length]),
          borderRadius: 8,
          barThickness: 28,
        },
      ],
    };
  }, [items]);

  const maxY = useMemo(() => {
    const v = (items ?? []).map((x) => x.adsPlayed);
    const m = v.length ? Math.max(...v) : 0;
    if (m <= 5) return 5;
    if (m <= 10) return 10;
    if (m <= 20) return 20;
    return Math.ceil(m / 10) * 10;
  }, [items]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#8a8f98", font: { size: 11, weight: 600 } },
      },
      y: {
        beginAtZero: true,
        max: maxY,
        ticks: { stepSize: Math.max(1, Math.floor(maxY / 4)), color: "#8a8f98", font: { size: 11, weight: 600 } },
        grid: { color: "#eef0f3" },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
      <div className="relative flex items-center justify-center px-4 py-3 text-sm font-semibold text-black/80">
        Players
        <span className="absolute right-4 top-3 text-xs text-black/50">⤢</span>
      </div>
      <div className="h-[260px] p-4 pb-6">
       { isLoading ? (
          <div className="grid place-items-center w-full h-full text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
            <div className="mt-3 text-sm text-black/60">Loading…</div>
          </div>
        ) : isError ? (
          <div className="grid place-items-center w-full h-full text-center">
            <div className="text-sm font-semibold text-black/80">Couldn&apos;t load</div>
            <div className="mt-1 text-xs text-black/50">Please try again.</div>
          </div>) :
        <Bar data={chart} options={options} />}
      </div>
    </div>
  );
}
