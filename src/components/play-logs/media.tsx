"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "@/src/components/common/table";
import useDebounce from "@/src/hooks/useDebounce";
import { formatSeconds, toYMDLocal } from "@/src/lib/util";
import { RenderThumbnail } from "@/src/components/common/thumb";
import EmptyState from "@/src/components/common/emptyState";
import {
  FolderLogsParams,
  FolderLogsResponse,
  FolderLogItem,
} from "@/types/types";
import FolderLogsActions from "./components/mediaActions";
import { useRouter } from "next/router";

export default function MediaLogs() {
  const LIMIT = 20;

  const today = toYMDLocal(new Date());

  const [params, setParams] = useState<FolderLogsParams>({
    sortBy: "lastPlayed",
    sortOrder: "desc",
    search: "",
    limit: LIMIT,
    startDate: today,
    endDate: today,
  });

  const router = useRouter();
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
    queryKey: ["analytics", "folder-logs", queryParams],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get("/analytics/folder-logs", {
          params: {
            ...queryParams,
            offset: pageParam,
            limit: LIMIT,
          },
        })
        .then((r) => r.data as FolderLogsResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore
        ? (lastPage.pagination.offset ?? 0) +
          (lastPage.pagination.limit ?? LIMIT)
        : undefined,
    staleTime: 0,
  });

  const items: FolderLogItem[] = useMemo(
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
        header: "Thumbnail",
        key: "thumbnail",
        render: (item: FolderLogItem) => (
          <RenderThumbnail
            thumbnail={item.thumbnail}
            alt={item.folderName}
            type="folder"
          />
        ),
      },
      {
        header: "Folder Name",
        key: "folderName",
        render: (item: FolderLogItem) => (
          <button
            className="hover:underline cursor-pointer text-left truncate min-w-[150px] max-w-[200px]"
            onClick={() =>
              router.push(
                `/play-logs/media/${item.folderId}?startDate=${params.startDate}&endDate=${params.endDate}`,
              )
            }
          >
            {item.folderName}
          </button>
        ),
      },
      {
        header: "Last Played",
        key: "lastPlayedAt",
        render: (item: FolderLogItem) => {
          if (!item.lastPlayedAt)
            return <span className="text-black/40">-</span>;
          const d = new Date(item.lastPlayedAt);
          return (
            <div className="inline-flex flex-col text-xs min-w-[100px]">
              <span>{d.toLocaleDateString()}</span>
              <span>{d.toLocaleTimeString()}</span>
            </div>
          );
        },
      },
      {
        header: "Total Run Time",
        key: "totalRunTimeSec",
        render: (item: FolderLogItem) => (
          <span className="min-w-[150px]">
            {formatSeconds(item.totalRunTimeSec)}
          </span>
        ),
      },
      {
        header: "Devices",
        key: "devices",
        render: (item: FolderLogItem) => <span>{item.devices}</span>,
      },
      {
        header: "Plays",
        key: "plays",
        render: (item: FolderLogItem) => <span>{item.plays}</span>,
      },
    ],
    [router, params.startDate, params.endDate],
  );

  const showEmpty = !isLoading && items.length === 0;

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="text-sm text-black/50">
        Total Clients - {items.length}
      </div>

      <FolderLogsActions params={params} setParams={setParams} data={items} />

      {showEmpty ? (
        <EmptyState image="/emptyFolder.svg" message="No folder logs found" />
      ) : (
        <div>
          <Table
            data={items}
            columns={columns as any}
            maxHeight="h-auto"
            loading={isLoading || (isFetching && items.length === 0)}
          />

          <div ref={sentinelRef} className="h-6" />

          {isFetchingNextPage && (
            <div className="text-sm text-black/40">Loading more...</div>
          )}

          {!hasNextPage && items.length > 0 && (
            <div className="text-xs text-black/30">End of results</div>
          )}
        </div>
      )}
    </section>
  );
}