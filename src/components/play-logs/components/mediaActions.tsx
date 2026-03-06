"use client";

import React, { useMemo, useState } from "react";
import { Search, Download, Calendar } from "lucide-react";
import { Input } from "@/src/components/common/input";
import Select from "@/src/components/common/select";
import { FolderLogsSortOptions } from "@/src/lib/constant";
import {
  FolderLogsParams,
  FolderLogsSortBy,
  SortOrder,
  FolderLogItem,
} from "@/types/types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatSeconds, fromYMDLocal, toYMDLocal } from "@/src/lib/util";
import DateRangePickerModal from "@/src/components/common/dateRangePicker";

type Props = {
  params: FolderLogsParams;
  setParams: React.Dispatch<React.SetStateAction<FolderLogsParams>>;
  data: FolderLogItem[];
};

type PickerValue = Date | [Date, Date] | null;



export default function FolderLogsActions({
  params,
  setParams,
  data,
}: Props) {
  const [dateOpen, setDateOpen] = useState(false);

const initialPickerValue: PickerValue = useMemo(() => {
  if (!params.startDate || !params.endDate) return null;

  try {
    const start = fromYMDLocal(params.startDate);
    const end = fromYMDLocal(params.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    return [start, end];
  } catch {
    return null;
  }
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

    setParams((p) => ({
      ...p,
      startDate: toYMDLocal(start),
      endDate: toYMDLocal(end),
    }));

    setDateOpen(false);
  };

  const handleExport = () => {
    const rows = data.map((item) => ({
      Folder: item.folderName,
      LastPlayed: item.lastPlayedAt
        ? new Date(item.lastPlayedAt).toLocaleString()
        : "-",
      TotalRunTime: formatSeconds(item.totalRunTimeSec),
      Devices: item.devices,
      Plays: item.plays,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Folder Logs");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `folder-logs-${Date.now()}.xlsx`);
  };

  return (
    <>
      <DateRangePickerModal
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        onApply={handleApplyDates}
        initialValue={initialPickerValue}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
  {/* Search */}
  <div className="relative sm:col-span-2 lg:col-span-4 min-w-0">
    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    <Input
      placeholder="Search folders..."
      className="pl-10 bg-gray-100 w-full"
      value={params.search ?? ""}
      onChange={(e) =>
        setParams((p) => ({ ...p, search: e.target.value }))
      }
    />
  </div>

  {/* Sort */}
  <div className="sm:col-span-1 lg:col-span-3">
    <Select
      options={FolderLogsSortOptions}
      value={`${params.sortBy ?? "lastPlayed"}:${
        params.sortOrder ?? "desc"
      }`}
      onChange={(val) => {
        const [sortBy, sortOrder] = String(val).split(":") as [
          FolderLogsSortBy,
          SortOrder
        ];
        setParams((p) => ({ ...p, sortBy, sortOrder }));
      }}
    />
  </div>

  {/* Date */}
  <div className="sm:col-span-1 lg:col-span-3">
    <button
      onClick={() => setDateOpen(true)}
      className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 w-full"
    >
      <Calendar size={16} />
      <span className="truncate">
        {params.startDate && params.endDate
          ? `${params.startDate} → ${params.endDate}`
          : "Select Dates"}
      </span>
    </button>
  </div>

  {/* Export */}
  <div className="sm:col-span-2 lg:col-span-2">
    <button
      onClick={handleExport}
      className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg w-full"
    >
      <Download size={16} />
      Export
    </button>
  </div>
</div>
    </>
  );
}