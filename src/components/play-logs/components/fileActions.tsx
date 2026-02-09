"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../common/input";
import Select from "../../common/select";
import { FileLogsSortOptions } from "@/src/lib/constant";
import { FileLogsParams, FileLogsSortBy, SortOrder } from "@/types/types";


type Props = {
  params: FileLogsParams;
  setParams: React.Dispatch<React.SetStateAction<FileLogsParams>>;
};

export default function FileLogsActions({ params, setParams }: Props) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
      <div className="relative col-span-6 md:col-span-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files or clients..."
          className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={params.search ?? ""}
          onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, offset: 0 }))}
        />
      </div>

      <div className="col-span-3 md:col-span-3">
        <Select
          options={FileLogsSortOptions}
          value={`${params.sortBy ?? "lastPlayed"}:${params.sortOrder ?? "desc"}`}
          onChange={(val) => {
            const [sortBy, sortOrder] = String(val).split(":") as [FileLogsSortBy, SortOrder];
            setParams((p) => ({ ...p, sortBy, sortOrder, offset: 0 }));
          }}
          className="min-w-full rounded-lg"
          containerClassName="w-auto"
          iconClassName="text-gray-500"
        />
      </div>
    </div>
  );
}
