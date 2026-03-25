"use client";

import React, { useMemo, useRef } from "react";
import GradientIconContainer from "@/src/components/common/gradientIconContainer";
import SiteLayout from "@/src/components/layout/siteLayout";
import axiosInstance from "@/src/helpers/axios";
import { formatTime } from "@/src/lib/util";
import { ActivityApiItem } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MonitorPlay } from "lucide-react";
import { useInfiniteVirtualList } from "@/src/hooks/useInfiniteVirtualList";


function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center gap-6">
      <GradientIconContainer>
        <MonitorPlay size={25} />
      </GradientIconContainer>
      <div className="flex flex-1 flex-col gap-1">
        <div className="md:text-xl font-semibold text-black/80">{text}</div>
        <div className="text-xs font-semibold text-black/40">{time}</div>
      </div>
    </div>
  );
}

type ActivityResponse = {
  activity: ActivityApiItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

const RecentActivity = () => {
  const LIMIT = 15;
  const ROW_HEIGHT = 88;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["activity", "infinite"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get("/players/get-activity", { params: { offset: pageParam, limit: LIMIT } })
        .then((r) => r.data as ActivityResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.offset + lastPage.pagination.limit
        : undefined,
  });

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.activity) ?? [],
    [data]
  );

  const virtualCount = items.length;

  const rowVirtualizer = useInfiniteVirtualList({
    count: virtualCount,
    scrollRef,
    rowHeight: ROW_HEIGHT,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    overscan: 8,
    threshold: 8,
  });

  return (
    <SiteLayout>
      <div
        ref={scrollRef}
        className="mx-auto h-screen w-full max-w-7xl overflow-y-auto overflow-x-hidden xs:p-6 md:p-8"
      >
        <h1 className="mb-6 text-2xl font-semibold">Recent Activity</h1>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <ActivityItem text="Loading..." time="" />
          </div>
        ) : items.length ? (
          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];

              return (
                <div
                  key={item.id}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ActivityItem
                    text={item.message.split("|")[0].trim()}
                    time={formatTime(item.at)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ActivityItem text="No recent activity" time="" />
          </div>
        )}

        {isFetchingNextPage ? (
          <div className="mt-6 text-sm font-semibold text-black/40">
            Loading more...
          </div>
        ) : null}
      </div>
    </SiteLayout>
  );
};

export default RecentActivity;