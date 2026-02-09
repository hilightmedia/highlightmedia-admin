"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import useDebounce from "@/src/hooks/useDebounce";
import Table from "../common/table";
import EmptyState from "../common/emptyState";
import { formatSeconds } from "@/src/lib/util";
import { RenderThumbnail } from "../common/thumb";
import { FileLogsParams, FileLogsResponse, FileLogItem } from "@/types/types";
import FileLogsActions from "./components/fileActions";

export default function FileLogsPage() {
  const LIMIT = 20;

  const [params, setParams] = useState<FileLogsParams>({
    sortBy: "lastPlayed",
    sortOrder: "desc",
    search: "",
    limit: LIMIT,
    date: undefined,
  });

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
    queryKey: ["analytics", "file-logs", queryParams],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get("/analytics/file-logs", {
          params: {
            ...queryParams,
            offset: pageParam,
            limit: LIMIT,
          },
        })
        .then((r) => r.data as FileLogsResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.offset + lastPage.pagination.limit
        : undefined,
  });

  const items: FileLogItem[] = useMemo(
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
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
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
        render: (item: FileLogItem) => (
          <RenderThumbnail
            thumbnail={
              item.fileType?.startsWith("image/") ? item.signedUrl : ""
            }
            alt={item.fileName}
            type="file"
          />
        ),
      },
      {
        header: "File Name",
        key: "fileName",
        render: (item: FileLogItem) => (
          <div className="flex flex-col">
            <span className="font-semibold text-black/80 truncate min-w-[150px] max-w-[200px]">
              {item.fileName}
            </span>
          </div>
        ),
      },
      {
        header: "Last Played",
        key: "lastPlayedAt",
        render: (item: FileLogItem) => {
          if (!item.lastPlayedAt)
            return <span className="text-black/40">-</span>;
          const d = new Date(item.lastPlayedAt);
          return (
            <div className="inline-flex flex-col text-xs min-w-[150px]">
              <span>{d.toLocaleDateString()}</span>
              <span>{d.toLocaleTimeString()}</span>
            </div>
          );
        },
      },
      {
        header: "Total Run Time",
        key: "totalRunTimeSec",
        render: (item: FileLogItem) => (
          <span className="min-w-[150px] ">
            {formatSeconds(item.totalRunTimeSec)}
          </span>
        ),
      },
      {
        header: "Devices",
        key: "devices",
        render: (item: FileLogItem) => <span>{item.devices}</span>,
      },
      {
        header: "Plays",
        key: "plays",
        render: (item: FileLogItem) => <span>{item.plays}</span>,
      },
    ],
    [],
  );

  const showEmpty = !isLoading && items.length === 0;
  const showInitialLoading = isLoading && items.length === 0;

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <FileLogsActions params={params} setParams={setParams} />

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No file logs found" />
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
