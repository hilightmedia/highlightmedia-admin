"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/src/components/common/input";
import Select from "@/src/components/common/select";
import { FolderLogsSortOptions } from "@/src/lib/constant";
import { FolderLogsParams, FolderLogsSortBy, SortOrder } from "@/types/types";

type Props = {
  params: FolderLogsParams;
  setParams: React.Dispatch<React.SetStateAction<FolderLogsParams>>;
};

export default function FolderLogsActions({ params, setParams }: Props) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
      <div className="relative col-span-6 md:col-span-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search folders..."
          className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={params.search ?? ""}
          onChange={(e) => setParams((p) => ({ ...p, search: e.target.value }))}
        />
      </div>

      <div className="col-span-3 md:col-span-3">
        <Select
          options={FolderLogsSortOptions}
          value={`${params.sortBy ?? "lastPlayed"}:${params.sortOrder ?? "desc"}`}
          onChange={(val) => {
            const [sortBy, sortOrder] = String(val).split(":") as [
              FolderLogsSortBy,
              SortOrder
            ];
            setParams((p) => ({ ...p, sortBy, sortOrder }));
          }}
          className="min-w-full rounded-lg"
          containerClassName="w-auto"
          iconClassName="text-gray-500"
        />
      </div>
    </div>
  );
}
