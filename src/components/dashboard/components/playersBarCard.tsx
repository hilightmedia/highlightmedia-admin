"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
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

export default function PlayersBarCard() {
  const data = {
    labels: ["Anna\nnagar", "Pudur", "KK\nnagar", "Theppa\nkulam", "Simmakal", "Keelavocval"],
    datasets: [
      {
        label: "Ads",
        data: [20, 16, 15, 10, 6, 3],
        backgroundColor: ["#ff6a00", "#ff8a3d", "#ff8a3d", "#ffb07a", "#ffd1b3", "#ffe3d3"],
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#8a8f98", font: { size: 11, weight: 600 } } },
      y: {
        beginAtZero: true,
        max: 20,
        ticks: { stepSize: 5, color: "#8a8f98", font: { size: 11, weight: 600 } },
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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
