"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import GradientIconContainer from "@/src/components/common/gradientIconContainer";
import SiteLayout from "@/src/components/layout/siteLayout";
import axiosInstance from "@/src/helpers/axios";
import { formatTime } from "@/src/lib/util";
import { ActivityApiItem } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MonitorPlay } from "lucide-react";

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
      lastPage.pagination.hasMore ? lastPage.pagination.offset + lastPage.pagination.limit : undefined,
  });

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.activity) ?? [],
    [data]
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
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-[1240px] overflow-x-hidden xs:p-6 md:p-8">
        <h1 className="mb-6 text-2xl font-semibold">Recent Activity</h1>

        <div className="flex flex-col gap-6">
          {isLoading ? (
            <ActivityItem text="Loading..." time="" />
          ) : items.length ? (
            items.map((x) => (
              <ActivityItem
                key={x.id}
                text={x.message.split("|")[0].trim()}
                time={formatTime(x.at)}
              />
            ))
          ) : (
            <ActivityItem text="No recent activity" time="" />
          )}
        </div>

        <div ref={sentinelRef} className="h-10" />

        {isFetchingNextPage ? (
          <div className="mt-6 text-sm font-semibold text-black/40">Loading more...</div>
        ) : null}
      </div>
    </SiteLayout>
  );
};

export default RecentActivity;
