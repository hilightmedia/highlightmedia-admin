"use client";

import React, { useMemo, useState } from "react";
import { Search, Download, Calendar } from "lucide-react";
import { Input } from "@/src/components/common/input";
import DateRangePickerModal from "@/src/components/common/dateRangePicker";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fromYMDLocal, toYMDLocal } from "@/src/lib/util";

export type PlayerSessionItem = {
  sessionStart: string | null;
  sessionEnd: string | null;
  status: "Online" | "Offline";
  lastActive: string | null;
  totalRunTimeSec: number;
};

export type PlayerSessionParams = {
  search?: string;
  startDate?: string;
  endDate?: string;
};

type PickerValue = Date | [Date, Date] | null;

type Props = {
  params: PlayerSessionParams;
  setParams: React.Dispatch<React.SetStateAction<PlayerSessionParams>>;
  data: PlayerSessionItem[];
};

const formatSeconds = (sec?: number) => {
  if (!sec || sec <= 0) return "0s";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
};

export default function PlayerSessionsActions({
  params,
  setParams,
  data,
}: Props) {
  const [dateOpen, setDateOpen] = useState(false);

  const initialPickerValue: PickerValue = useMemo(() => {
    if (!params.startDate || !params.endDate) return null;
    return [
      fromYMDLocal(params.startDate),
      fromYMDLocal(params.endDate),
    ];
  }, [params.startDate, params.endDate]);

  const handleApplyDates = (val: PickerValue) => {
    if (!val) return setDateOpen(false);

    let start: Date | null = null;
    let end: Date | null = null;

    if (val instanceof Date) {
      start = val;
      end = val;
    } else {
      const [a, b] = val;
      if (a && b) {
        start = a <= b ? a : b;
        end = a <= b ? b : a;
      }
    }

    if (!start || !end) return setDateOpen(false);

    const s = new Date(start);
    s.setHours(0, 0, 0, 0);

    const e = new Date(end);
    e.setHours(0, 0, 0, 0);

    setParams((p) => ({
      ...p,
        startDate: toYMDLocal(start),
        endDate: toYMDLocal(end),
    }));

    setDateOpen(false);
  };

  const handleExport = () => {
    const rows = data.map((item) => ({
      SessionStart: item.sessionStart
        ? new Date(item.sessionStart).toLocaleString()
        : "-",
      SessionEnd: item.sessionEnd
        ? new Date(item.sessionEnd).toLocaleString()
        : "-",
      Status: item.status,
      LastActive: item.lastActive
        ? new Date(item.lastActive).toLocaleString()
        : "-",
      RunTime: formatSeconds(item.totalRunTimeSec),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Player Sessions");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `player-sessions-${Date.now()}.xlsx`);
  };

  return (
    <>
      <DateRangePickerModal
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        onApply={handleApplyDates}
        initialValue={initialPickerValue}
      />

      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative col-span-6 md:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-100"
            value={params.search ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, search: e.target.value }))
            }
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <button
            onClick={() => setDateOpen(true)}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 w-full"
          >
            <Calendar size={16} />
            {params.startDate && params.endDate
              ? `${params.startDate} → ${params.endDate}`
              : "Select Dates"}
          </button>
        </div>

        <div className="col-span-3 md:col-span-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg w-full"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
    </>
  );
}