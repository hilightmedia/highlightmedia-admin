"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ClientsPieCard() {
  const data = {
    labels: ["Client 1", "Client 2", "Client 3", "Client 4"],
    datasets: [
      {
        data: [27, 36, 20, 14],
        backgroundColor: ["#ff6a00", "#ff8a3d", "#ffb07a", "#ffd1b3"],
        borderWidth: 0,
        // optional:
        spacing: 3,
        // radius: "95%",
      },
    ],
  };

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
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
