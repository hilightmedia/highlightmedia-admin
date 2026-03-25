"use client";

import React, { useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { formatTime } from "@/src/lib/util";
import SiteLayout from "@/src/components/layout/siteLayout";
import { useInfiniteVirtualList } from "@/src/hooks/useInfiniteVirtualList";
import EmptyState from "@/src/components/common/emptyState";

function AlertItem({
    title,
    sub,
    time,
    badge,
}: {
    title: string;
    sub: string;
    time: string;
    badge: string;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-3">
            <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#ff6a00] px-2 py-0.5 text-center text-[11px] font-extrabold text-white">
                    {badge}
                </span>
                <span className="text-xs font-semibold text-black/40">{time}</span>
            </div>

            <div className="flex flex-col">
                <div className="text-[13px] font-semibold text-black/80">{title}</div>
                <div className="text-xs font-medium text-black/40">{sub}</div>
            </div>
        </div>
    );
}

function formatBadgeDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function buildTitle(message: string) {
    const left = (message ?? "").split("|")[0]?.trim();
    return left || "Alert";
}

function buildSub(type: string, daysLeft: number | null, message: string) {
    if (type === "VALIDITY_COMPLETED") return "completed";
    if (typeof daysLeft === "number") return `${daysLeft} days left`;
    const parts = (message ?? "").split("|");
    const sub = parts[1]?.trim();
    return sub || "expiring";
}

type AlertApiItem = {
    id: string;
    type: "VALIDITY_EXPIRING" | "VALIDITY_COMPLETED";
    folderId: number;
    folderName: string;
    at: string;
    message: string;
    daysLeft: number | null;
};

type AlertsResponse = {
    alerts: AlertApiItem[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
};

export default function AlertsPage() {
    const LIMIT = 15;
    const ROW_HEIGHT = 96;
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["alerts", "infinite"],
        initialPageParam: 0,
        queryFn: ({ pageParam }) =>
            axiosInstance
                .get("/media/get-alerts", { params: { offset: pageParam, limit: LIMIT } })
                .then((r) => r.data as AlertsResponse),
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasMore
                ? lastPage.pagination.offset + lastPage.pagination.limit
                : undefined,
    });

    const items = useMemo(
        () => data?.pages.flatMap((page) => page.alerts) ?? [],
        [data]
    );

    const rowVirtualizer = useInfiniteVirtualList({
        count: items.length,
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
                <h1 className="mb-6 text-2xl font-semibold">Alerts</h1>

                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <AlertItem title="Loading..." sub="" time="" badge="—" />
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
                                    <AlertItem
                                        badge={formatBadgeDate(item.at)}
                                        title={buildTitle(item.message)}
                                        sub={buildSub(item.type, item.daysLeft, item.message)}
                                        time={formatTime(item.at)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-black/40 h-1/5 flex items-center justify-center">
                        <EmptyState
                            image="/emptyFolder.svg"
                            message="No alerts at the moment"
                        />
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
}