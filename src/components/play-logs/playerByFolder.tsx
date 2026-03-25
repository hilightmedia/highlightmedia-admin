"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import useDebounce from "@/src/hooks/useDebounce";
import EmptyState from "@/src/components/common/emptyState";
import { useRouter } from "next/router";
import PlayerByFolderActions, {
  DeviceLogItem,
  DeviceLogsParams,
} from "./components/playerByFolderActions";
import { formatSeconds } from "@/src/lib/util";
import { Wifi, WifiOff } from "lucide-react";

type DeviceLogsResponse = {
  message: string;
  items: DeviceLogItem[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
  meta?: {
    totalPlayers?: number;
  };
};

const DeviceLogsSortOptions: Array<{ label: string; value: string }> = [
  { label: "Last Active (Newest)", value: "lastActive:desc" },
  { label: "Last Active (Oldest)", value: "lastActive:asc" },
  { label: "Plays (High → Low)", value: "plays:desc" },
  { label: "Plays (Low → High)", value: "plays:asc" },
  { label: "Total Hours (High → Low)", value: "totalHours:desc" },
  { label: "Total Hours (Low → High)", value: "totalHours:asc" },
  { label: "Name (A → Z)", value: "name:asc" },
  { label: "Name (Z → A)", value: "name:desc" },
  { label: "Status (Online first)", value: "status:desc" },
  { label: "Status (Offline first)", value: "status:asc" },
];

const formatHours = (hours: number) => {
  if (!Number.isFinite(hours)) return "-";
  if (hours <= 0) return "0 Hours";
  if (hours < 1) return `${Math.round(hours * 60)} Mins`;
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} Hours`;
};

const StatusPill = ({ status }: { status: "online" | "offline" }) => {
  const isOnline = status === "online";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
        isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          isOnline ? "bg-green-600" : "bg-gray-400",
        ].join(" ")}
      />
      {isOnline ? "Online" : "Offline"}{" "}
    </span>
  );
};

export default function PlayerByFolderIndex() {
  const LIMIT = 20;

  const [params, setParams] = useState<DeviceLogsParams>({
    sortBy: "lastActive",
    sortOrder: "desc",
    search: "",
    limit: LIMIT,
    startDate: "",
    endDate: "",
  });

  const router = useRouter();

  const folderId =
    router.isReady && typeof router.query.id === "string"
      ? Number(router.query.id)
      : NaN;

  useEffect(() => {
    if (!router.isReady) return;

    const startDate =
      typeof router.query.startDate === "string" ? router.query.startDate : "";

    const endDate =
      typeof router.query.endDate === "string" ? router.query.endDate : "";

    setParams((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  }, [router.isReady, router.query.startDate, router.query.endDate]);

  const debouncedSearch = useDebounce(params.search ?? "", 400);

  const queryParams = useMemo(
    () => ({
      ...params,
      search: debouncedSearch,
      limit: LIMIT,
    }),
    [params, debouncedSearch],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["folder-player-stats", folderId, queryParams],
    enabled: Number.isFinite(folderId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get(`/analytics/folders/${folderId}/player-stats`, {
          params: {
            ...queryParams,
            offset: pageParam,
            limit: LIMIT,
          },
        })
        .then((r) => r.data as DeviceLogsResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore
        ? (lastPage.pagination.offset ?? 0) +
        (lastPage.pagination.limit ?? LIMIT)
        : undefined,
    staleTime: 0,
  });

  const items: DeviceLogItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [data],
  );

  const meta = useMemo(() => data?.pages?.[0]?.meta, [data]);
  const totalPlayers = meta?.totalPlayers ?? items.length;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

const columns = useMemo(
  () => [
    {
      header: "Name",
      key: "playerName",
      render: (item: DeviceLogItem) => (
        <span
          className="truncate min-w-[120px] max-w-[220px] text-left"
        >
          {item.playerName}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item: any) => {
        const statusColor =
          item.status === "Online" ? "bg-green-100" : "bg-red-100";

        return (
          <span
            className={`py-1 inline-flex items-center gap-1 px-3 rounded-full text-sm capitalize ${statusColor}`}
          >
            {item.status === "Online" ? (
              <Wifi
                color="#fff"
                size={15}
                className="p-0.5 bg-green-500 rounded-full"
              />
            ) : (
              <WifiOff
                color="#fff"
                size={15}
                className="p-0.5 bg-red-500 rounded-full"
              />
            )}
            {item.status}
          </span>
        );
      },
    },
    {
      header: "Last Active",
      key: "lastActive",
      render: (item: DeviceLogItem) => {
        if (!item.lastActive)
          return <span className="text-black/40">-</span>;

        const d = new Date(item.lastActive);

        return (
          <div className="inline-flex flex-col text-xs min-w-[110px]">
            <span>{d.toLocaleDateString()}</span>
            <span>{d.toLocaleTimeString()}</span>
          </div>
        );
      },
    },
    {
      header: "No of times played",
      key: "plays",
      render: (item: DeviceLogItem) => (
        <span className="min-w-[80px]">{item.plays}</span>
      ),
    },
    {
      header: "Total hours",
      key: "totalHours",
      render: (item: DeviceLogItem) => (
        <span className="min-w-[100px]">
          {formatSeconds(item?.totalHours || 0)}
        </span>
      ),
    },
    {
      header: "View",
      key: "view",
      render: (item: DeviceLogItem) => (
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-md"
          onClick={() =>
            router.push(
              `/play-logs/player/${item.playerId}?startDate=${params.startDate}&endDate=${params.endDate}`
            )
          }
        >
          View
        </button>
      ),
    },
  ],
  [router, params.startDate, params.endDate]
);

  const showEmpty = !isLoading && items.length === 0;
  const showInitialLoading = isLoading && items.length === 0;

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto h-[calc(100vh-100px)]">
      {" "}
      <div className="flex flex-wrap items-center gap-4">
        {" "}
        <div className="text-sm text-black/50">
          Total Players - {totalPlayers}{" "}
        </div>{" "}
      </div>
      <PlayerByFolderActions
        params={params}
        setParams={setParams}
        data={items}
        sortOptions={DeviceLogsSortOptions}
      />
      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No player logs found" />
      ) : (
        <div>
          <Table
            data={items}
            columns={columns as any}
            maxHeight="h-auto"
            loading={showInitialLoading || (isFetching && items.length === 0)}
          />

          <div ref={sentinelRef} className="h-6" />

          {isFetchingNextPage ? (
            <div className="text-sm font-semibold text-black/40">
              Loading more...
            </div>
          ) : null}

          {!hasNextPage && items.length > 0 ? (
            <div className="text-xs font-semibold text-black/30">
              End of results
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
