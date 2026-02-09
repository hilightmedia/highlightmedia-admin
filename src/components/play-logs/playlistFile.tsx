"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import EmptyState from "@/src/components/common/emptyState";
import useDebounce from "@/src/hooks/useDebounce";
import { formatSeconds } from "@/src/lib/util";
import { RenderThumbnail } from "@/src/components/common/thumb";
import Select from "@/src/components/common/select";
import { Input } from "@/src/components/common/input";
import { Search } from "lucide-react";
import { PlaylistFilesLogsItem, PlaylistFilesLogsResponse, PlaylistFilesLogsSortBy, SortOrder } from "@/types/types";
import { PlayListFileLogsSortOptions } from "@/src/lib/constant";



export default function PlaylistFileLogsPage() {
  const LIMIT = 20;

  const [params, setParams] = useState<{ search: string; sortBy: PlaylistFilesLogsSortBy; sortOrder: SortOrder; playlistId?: number }>(
    { search: "", sortBy: "lastPlayed", sortOrder: "desc" },
  );

  const debouncedSearch = useDebounce(params.search ?? "", 400);
  const queryParams = useMemo(
    () => ({ ...params, search: debouncedSearch }),
    [params, debouncedSearch],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteQuery({
      queryKey: ["analytics", "playlist-file-logs", queryParams],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        axiosInstance
          .get("/analytics/playlist-file-logs", {
            params: { ...queryParams, offset: pageParam, limit: LIMIT },
          })
          .then((r) => r.data as PlaylistFilesLogsResponse),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasMore
          ? lastPage.pagination.offset + lastPage.pagination.limit
          : undefined,
    });

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const columns = useMemo(
    () => [
      {
        header: "Thumbnail",
        key: "thumbnail",
        render: (x: PlaylistFilesLogsItem) => (
          <div className="flex items-center gap-3">
            <RenderThumbnail
              thumbnail={x.fileType?.startsWith("image/") ? x.signedUrl : ""}
              alt={x.fileName ?? x.subPlaylistName ?? "Item"}
              type="file"
            />
          </div>
        ),
      },
      {
        header: "Name",
        key: "name",
        render: (x: PlaylistFilesLogsItem) => (
          <div className="flex flex-col">
            <span className="font-semibold text-black/80 truncate min-w-[150px] max-w-[200px]">{x.fileName}</span>
            <span className="font-semibold text-black/80 truncate min-w-[150px] max-w-[200px]">{x.subPlaylistName}</span>
          </div>
        ),
      },
      {
        header: "Last Played",
        key: "lastPlayedAt",
        render: (x: PlaylistFilesLogsItem) =>
          x.lastPlayedAt ? (
            <div className="inline-flex flex-col text-xs min-w-[130px] ">
              <span>{new Date(x.lastPlayedAt).toLocaleDateString()}</span>
              <span>{new Date(x.lastPlayedAt).toLocaleTimeString()}</span>
            </div>
          ) : (
            <span className="text-black/40">-</span>
          ),
      },
      { header: "Run Time", key: "totalRunTimeSec",cellClassName: "min-w-[150px]", render: (x: PlaylistFilesLogsItem) => formatSeconds(x.totalRunTimeSec) },
      { header: "Devices", key: "devices", render: (x: PlaylistFilesLogsItem) => x.devices },
      { header: "Plays", key: "plays", render: (x: PlaylistFilesLogsItem) => x.plays },
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
            placeholder="Search playlist / file / sub playlist..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={params.search}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value }))}
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={PlayListFileLogsSortOptions}
            value={`${params.sortBy}:${params.sortOrder}`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [PlaylistFilesLogsSortBy, SortOrder];
              setParams((p) => ({ ...p, sortBy, sortOrder }));
            }}
            className="min-w-full rounded-lg"
            containerClassName="w-auto"
            iconClassName="text-gray-500"
          />
        </div>
      </div>

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No playlist file logs found" />
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
            <div className="text-sm font-semibold text-black/40">Loading more...</div>
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
