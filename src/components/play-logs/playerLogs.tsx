"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import EmptyState from "@/src/components/common/emptyState";
import useDebounce from "@/src/hooks/useDebounce";
import { formatSeconds } from "@/src/lib/util";
import { PlayerLogItem, PlayerLogsParams } from "@/types/types";
import PlayerLogsActions from "./components/playersLogAction";
import { Wifi, WifiOff } from "lucide-react";

type Response = {
  items: PlayerLogItem[];
};

export default function PlayerLogsPage() {
  const [params, setParams] = useState<PlayerLogsParams>({
    sortBy: "lastActive",
    sortOrder: "desc",
    search: "",
  });

  const debouncedSearch = useDebounce(params.search ?? "", 400);

  const queryParams = useMemo(
    () => ({
      ...params,
      search: debouncedSearch,
    }),
    [params, debouncedSearch],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["player-logs", queryParams],
    queryFn: () =>
      axiosInstance
        .get("/analytics/player-logs", { params: queryParams })
        .then((r) => r.data as Response),
  });

  const items = data?.items ?? [];

  const columns = useMemo(
    () => [
      {
        header: "Player",
        key: "name",
        render: (item: PlayerLogItem) => (
          <span className="min-w-[150px]">{item.name}</span>
        ),
      },
      {
        header: "Session Start",
        key: "sessionStart",
        render: (item: PlayerLogItem) => {
          if (!item.sessionStart) return "-";
          const d = new Date(item.sessionStart);
          return (
            <div className="text-xs">
              <div>{d.toLocaleDateString()}</div>
              <div>{d.toLocaleTimeString()}</div>
            </div>
          );
        },
      },
      {
        header: "Session End",
        key: "sessionEnd",
        render: (item: PlayerLogItem) => {
          if (!item.sessionEnd) return "-";
          const d = new Date(item.sessionEnd);
          return (
            <div className="text-xs">
              <div>{d.toLocaleDateString()}</div>
              <div>{d.toLocaleTimeString()}</div>
            </div>
          );
        },
      },
      {
        header: "Status",
        key: "status",
         render: (item: any) => {
        const statusColor = item.status === "Online" ? "bg-green-100" : "bg-red-100";
        return (
          <span className={`py-1 inline-flex items-center gap-1 px-3 rounded-full text-sm capitalize ${statusColor}`}>
            {item.status === "Online" ? (
              <Wifi color="#fff" size={15} className="p-0.5 bg-green-500 rounded-full" />
            ) : (
              <WifiOff color="#fff" size={15} className="p-0.5 bg-red-500 rounded-full" />
            )}
            {item.status}
          </span>
        );
      },
      },
      {
        header: "Last Active",
        key: "lastActive",
        render: (item: PlayerLogItem) => {
          if (!item.lastActive) return "-";
          const d = new Date(item.lastActive);
          return (
            <div className="text-xs">
              <div>{d.toLocaleDateString()}</div>
              <div>{d.toLocaleTimeString()}</div>
            </div>
          );
        },
      },
      {
        header: "Total Run Time",
        key: "totalRunTimeSec",
        render: (item: PlayerLogItem) =>
          formatSeconds(item.totalRunTimeSec),
      },
    ],
    [],
  );

  const showEmpty = !isLoading && items.length === 0;

  return (
    <section className="p-6 flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center gap-4">
        {" "}
        <div className="text-sm text-black/50">
          Total Players - {items.length}{" "}
        </div>{" "}
      </div>
      <PlayerLogsActions
        params={params}
        setParams={setParams}
        data={items}
      />

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No player logs found" />
      ) : (
        <Table
          data={items}
          columns={columns as any}
          loading={isLoading}
        />
      )}
    </section>
  );
}