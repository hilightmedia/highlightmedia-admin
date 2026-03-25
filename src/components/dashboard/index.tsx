"use client";

import { cn, formatDate, formatTime, formatSeconds } from "@/src/lib/util";
import React, { useMemo, useState } from "react";
import StatusPill from "./components/statusPill";
import AlertsCard from "./components/alertsCard";
import ClientsPieCard from "./components/clientPie";
import PlayersBarCard from "./components/playersBarCard";
import RecentActivityCard from "./components/RecentActivityCard";
import SidebarCalendarCard from "./components/sideBarCalendarCard";
import StatCard from "./components/statCard";
import Table from "../common/table";
import axiosInstance from "@/src/helpers/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type SortBy = "default" | "name" | "status";

type ApiSummary = {
  totalFolders: number;
  online: number;
  offline: number;
  players: number;
};

type ApiSessionRow = {
  playerId: number;
  name: string;
  sessionStart: string | null;
  sessionEnd: string | null;
  status: "Online" | "Offline";
  lastActive: string | null;
  sessionDurationSec: number;
};

type SessionRow = {
  name: string;
  sessionStart: string;
  sessionEnd: string;
  status: "Online" | "Offline";
  lastActive: string;
  duration: string;
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

  const [sortBy, setSortBy] = useState<SortBy>("default");

  const { data: summaryRes } = useQuery({
    queryKey: ["analytics", "summary", selectedDate],
    queryFn: () =>
      axiosInstance
        .get("/analytics/summary")
        .then((r) => r.data.data as ApiSummary),
  });

  const { data: sessionsRes, isLoading: sessionsLoading } = useQuery({
    queryKey: ["analytics", "recent-sessions", selectedDate, sortBy],
    queryFn: () =>
      axiosInstance
        .get("/analytics/recent-sessions", {
          params: {
            date: selectedDate,
            sortBy: sortBy === "default" ? "lastActive" : sortBy,
            sortOrder: "desc",
          },
        })
        .then((r) => r.data.items as ApiSessionRow[]),
  });

  const rows: SessionRow[] = useMemo(() => {
    const items = sessionsRes ?? [];
    return items.map((s) => ({
      name: s.name,
      sessionStart: s.sessionStart ? formatTime(s.sessionStart) : "-",
      sessionEnd: s.sessionEnd ? formatTime(s.sessionEnd) : "-",
      status: s.status,
      lastActive: s.lastActive
        ? `${formatDate(s.lastActive)} ${formatTime(s.lastActive)}`
        : "-",
      duration: formatSeconds(s.sessionDurationSec),
    }));
  }, [sessionsRes]);

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: SessionRow) => (
        <span className="font-semibold text-black/80">{item.name}</span>
      ),
    },
    {
      key: "sessionStart",
      header: "Session Start",
      render: (item: SessionRow) => item.sessionStart,
    },
    {
      key: "sessionEnd",
      header: "Session End",
      render: (item: SessionRow) => item.sessionEnd,
    },
    {
      key: "status",
      header: "Status",
      render: (item: SessionRow) => <StatusPill status={item.status} />,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (item: SessionRow) => (
        <span className="text-black/60">{item.lastActive}</span>
      ),
    },
    {
      key: "duration",
      header: "Session Duration",
      render: (item: SessionRow) => item.duration,
    },
  ];

  const router = useRouter()

  return (
    <div className="mx-auto w-full max-w-7xl p-4 overflow-x-hidden">
      <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="w-full min-w-0">
          <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              primary
              value={String(summaryRes?.totalFolders ?? 0)}
              label="Clients"
              onClick={() => router.push("/media")}
            />
            <StatCard value={String(summaryRes?.online ?? 0)} label="Online" onClick={()=>router.push("/players?status=Online")} />
            <StatCard
              value={String(summaryRes?.offline ?? 0)}
              label="Offline"
              onClick={()=>router.push("/players?status=Offline")}
            />
            <StatCard
              value={String(summaryRes?.players ?? 0)}
              label="Players"
              onClick={()=>router.push("/players")}
            />
          </div>
          <div className="w-full xs:block lg:hidden mt-10">
            <SidebarCalendarCard
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <div className="mt-10 grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div className="min-w-0 w-full">
              <ClientsPieCard date={selectedDate} />
            </div>
            <div className="min-w-0 w-full">
              <PlayersBarCard date={selectedDate} />
            </div>
          </div>

          <div className="mt-4 flex w-full min-w-0 items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-9 w-[180px] rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-black/70 outline-none"
            >
              <option value="default">Sort by Default</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="mt-3 w-full min-w-0">
            <Table
              data={rows}
              columns={columns as any}
              rowKey={(item, idx) => `${item.name}-${idx}`}
              stickyHeader
              maxHeight="h-[320px]"
              tableOverflow="both"
              containerClassName="w-full min-w-0"
              tableWrapperClassName="bg-white shadow-sm w-full min-w-0"
              tableClassName="bg-white w-full min-w-0"
              rowClassName={cn("hover:bg-black/[0.02] cursor-default")}
              emptyMessage="No sessions yet."
              loading={sessionsLoading}
            />
          </div>
        </div>

        <div className="w-full min-w-0 flex flex-col gap-4">
          <div className="w-full xs:hidden lg:block">
            <SidebarCalendarCard
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <AlertsCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
