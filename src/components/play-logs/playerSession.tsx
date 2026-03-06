"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import EmptyState from "@/src/components/common/emptyState";
import { useRouter } from "next/router";
import PlayerSessionsActions, {
  PlayerSessionItem,
  PlayerSessionParams,
} from "./components/playerSessionAction";
import { Wifi, WifiOff } from "lucide-react";

const formatSeconds = (sec?: number) => {
  if (!sec || sec <= 0) return "0s";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
};

const StatusPill = ({ status }: { status: "Online" | "Offline" }) => {
  const isOnline = status === "Online";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
        isOnline
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          isOnline ? "bg-green-600" : "bg-gray-400",
        ].join(" ")}
      />
      {status}
    </span>
  );
};

type Response = {
  items: PlayerSessionItem[];
  pagination?: {
    offset?: number;
    limit?: number;
    hasMore?: boolean;
  };
};

export default function PlayerSessionsPage() {
  const LIMIT = 20;
  const router = useRouter();

  const [params, setParams] = useState<PlayerSessionParams>({
    startDate: "",
    endDate: "",
  });

  const playerId =
    router.isReady && typeof router.query.playerId === "string"
      ? Number(router.query.playerId)
      : NaN;

  useEffect(() => {
    if (!router.isReady) return;

    const startDate =
      typeof router.query.startDate === "string"
        ? router.query.startDate
        : "";

    const endDate =
      typeof router.query.endDate === "string"
        ? router.query.endDate
        : "";

    setParams((p) => ({
      ...p,
      startDate,
      endDate,
    }));
  }, [router.isReady, router.query.startDate, router.query.endDate]);

  const queryParams = useMemo(
    () => ({
      ...params,
      limit: LIMIT,
    }),
    [params],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["player-sessions", playerId, queryParams],
    enabled: Number.isFinite(playerId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get(`/analytics/player-logs/${playerId}`, {
          params: {
            ...queryParams,
            offset: pageParam,
            limit: LIMIT,
          },
        })
        .then((r) => r.data as Response),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore
        ? (lastPage.pagination.offset ?? 0) +
        (lastPage.pagination.limit ?? LIMIT)
        : undefined,
  });

  const items: PlayerSessionItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [data],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const columns = useMemo(
    () => [
      {
        header: "Session Start",
        key: "sessionStart",
        render: (item: PlayerSessionItem) => {
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
        render: (item: PlayerSessionItem) => {
          if (!item.sessionEnd) return "-";
          const d = new Date(item.sessionEnd);
          return (
            <div className="text-xs">
              <div>{d.toLocaleDateString()}</div>
              <div>{d.toLocaleTimeString()}</div>
            </div>
          );
        }
      },
      {
        header: "Status",
        key: "status",
        render: (item: any) => {
          const statusColor =
            item.status === "Online" ? "bg-green-100" : "bg-red-100";

          return (
            <span
              className={`py-1 inline-flex items-center gap-1 px-3 rounded-full text-sm ${statusColor}`}
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
        render: (item: PlayerSessionItem) => {
          if (!item.lastActive) return "-";
          const d = new Date(item.lastActive);
          return (
            <div className="text-xs">
              <div>{d.toLocaleDateString()}</div>
              <div>{d.toLocaleTimeString()}</div>
            </div>
          );
        }
      },
      {
        header: "Run Time",
        key: "totalRunTimeSec",
        render: (item: PlayerSessionItem) =>
          formatSeconds(item.totalRunTimeSec),
      },
    ],
    [],
  );

  const showEmpty = !isLoading && items.length === 0;

  return (
    <section className="p-6 flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="text-sm text-black/50">
        Total Players - {items.length}
      </div>

      <PlayerSessionsActions
        params={params}
        setParams={setParams}
        data={items}
      />

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No sessions found" />
      ) : (
        <div>
          <Table
            data={items}
            columns={columns as any}
            maxHeight="h-auto"
            loading={isLoading}
          />

          <div ref={sentinelRef} className="h-6" />

          {isFetchingNextPage && (
            <div className="text-sm text-black/40">
              Loading more...
            </div>
          )}
        </div>
      )}
    </section>
  );
}