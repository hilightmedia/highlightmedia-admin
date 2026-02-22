"use client";

import React, { useState } from "react";
import { Search, Download, Calendar } from "lucide-react";
import { Input } from "@/src/components/common/input";
import Select from "@/src/components/common/select";
import DateRangePickerModal from "@/src/components/common/dateRangePicker";
import { PlayerLogItem, PlayerLogsParams } from "@/types/types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatSeconds, toYMDLocal } from "@/src/lib/util";

type Props = {
  params: PlayerLogsParams;
  setParams: React.Dispatch<React.SetStateAction<PlayerLogsParams>>;
  data: PlayerLogItem[];
};

const sortOptions = [
  { label: "Last Active (Newest)", value: "lastActive:desc" },
  { label: "Last Active (Oldest)", value: "lastActive:asc" },
  { label: "Duration (High → Low)", value: "duration:desc" },
  { label: "Duration (Low → High)", value: "duration:asc" },
  { label: "Name (A → Z)", value: "name:asc" },
  { label: "Name (Z → A)", value: "name:desc" },
  { label: "Status", value: "status:desc" },
];

export default function PlayerLogsActions({
  params,
  setParams,
  data,
}: Props) {
  const [dateOpen, setDateOpen] = useState(false);

  const handleExport = () => {
    const rows = data.map((item) => ({
      Player: item.name,
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
      TotalRunTime: formatSeconds(item.totalRunTimeSec),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Player Logs");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `player-logs-${Date.now()}.xlsx`);
  };

  const handleApplyDates = (val: any) => {
    if (!val) return;

    let start: Date | null = null;
    let end: Date | null = null;

    if (val instanceof Date) {
      start = val;
      end = val;
    } else {
      const [a, b] = val;
      start = a;
      end = b;
    }

    if (!start || !end) return;

    setParams((p) => ({
      ...p,
      startDate: toYMDLocal(start),
      endDate: toYMDLocal(end),
    }));

    setDateOpen(false);
  };

  return (
    <>
      <DateRangePickerModal
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        onApply={handleApplyDates}
      />

      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative col-span-6 md:col-span-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            className="pl-10 bg-gray-100"
            value={params.search ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, search: e.target.value }))
            }
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={sortOptions}
            value={`${params.sortBy ?? "lastActive"}:${
              params.sortOrder ?? "desc"
            }`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as any;
              setParams((p) => ({ ...p, sortBy, sortOrder }));
            }}
          />
        </div>

        <div className="col-span-3 md:col-span-2">
          <button
            onClick={() => setDateOpen(true)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-full"
          >
            <Calendar size={16} />
            Date
          </button>
        </div>

        <div className="col-span-3 md:col-span-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
    </>
  );
}