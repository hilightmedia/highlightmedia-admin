"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import EmptyState from "@/src/components/common/emptyState";
import useDebounce from "@/src/hooks/useDebounce";
import { formatSeconds } from "@/src/lib/util";
import Select from "@/src/components/common/select";
import { Input } from "@/src/components/common/input";
import { Search } from "lucide-react";
import {
  PlaylistLogsParams,
  PlaylistLogsResponse,
  PlaylistLogItem,
  PlaylistLogSortBy,
  SortOrder,
} from "@/types/types";
import { PlayListLogsSortOptions } from "@/src/lib/constant";
import { useRouter } from "next/router";

export default function PlaylistLogsPage() {
  const LIMIT = 20;

  const [params, setParams] = useState<PlaylistLogsParams>({
    sortBy: "lastPlayed",
    sortOrder: "desc",
    search: "",
  });

  const router = useRouter();
  const debouncedSearch = useDebounce(params.search ?? "", 400);

  const queryParams = useMemo(
    () => ({ ...params, search: debouncedSearch }),
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
    queryKey: ["analytics", "playlist-logs", queryParams],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get("/analytics/playlist-logs", {
          params: { ...queryParams, offset: pageParam, limit: LIMIT },
        })
        .then((r) => r.data as PlaylistLogsResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.offset + lastPage.pagination.limit
        : undefined,
  });

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

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
        header: "Playlist",
        key: "playlistName",
        render: (x: PlaylistLogItem) => (
          <button
            className="hover:underline cursor-pointer text-left truncate min-w-[150px] max-w-[200px]"
            onClick={() => router.push(`/play-logs/playlist/${x.playlistId}`)}
          >
            {x.playlistName}
          </button>
        ),
      },
      {
        header: "Last Played",
        key: "lastPlayedAt",
        render: (x: PlaylistLogItem) =>
          x.lastPlayedAt ? (
            <div className="inline-flex flex-col text-xs min-w-[130px]">
              <span>{new Date(x.lastPlayedAt).toLocaleDateString()}</span>
              <span>{new Date(x.lastPlayedAt).toLocaleTimeString()}</span>
            </div>
          ) : (
            <span className="text-black/40">-</span>
          ),
      },
      {
        header: "Total Run Time",
        key: "totalRunTimeSec",
        cellClassName: "min-w-[150px]",
        render: (x: PlaylistLogItem) => formatSeconds(x.totalRunTimeSec),
      },
      {
        header: "Devices",
        key: "devices",
        render: (x: PlaylistLogItem) => x.devices,
      },
      {
        header: "Plays",
        key: "plays",
        render: (x: PlaylistLogItem) => x.plays,
      },
    ],
    [],
  );

  const showEmpty = !isLoading && items.length === 0;

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative col-span-6 md:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search playlists..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={params.search ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, search: e.target.value }))
            }
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={PlayListLogsSortOptions}
            value={`${params.sortBy ?? "lastPlayed"}:${params.sortOrder ?? "desc"}`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [
                PlaylistLogSortBy,
                SortOrder,
              ];
              setParams((p) => ({ ...p, sortBy, sortOrder }));
            }}
            className="min-w-full rounded-lg"
            containerClassName="w-auto"
            iconClassName="text-gray-500"
          />
        </div>
      </div>

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No playlist logs found" />
      ) : (
        <div>
          <Table
            data={items}
            columns={columns as any}
            maxHeight="h-auto"
            loading={isLoading || (isFetching && items.length === 0)}
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
