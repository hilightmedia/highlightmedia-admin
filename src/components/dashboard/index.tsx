import { cn } from "@/src/lib/util";
import React from "react";
import StatusPill from "./components/statusPill";
import AlertsCard from "./components/alertsCard";
import ClientsPieCard from "./components/clientPie";
import PlayersBarCard from "./components/playersBarCard";
import RecentActivityCard from "./components/RecentActivityCard";
import SidebarCalendarCard from "./components/sideBarCalendarCard";
import StatCard from "./components/statCard";
import Table from "../common/table";


type SessionRow = {
  name: string;
  sessionStart: string;
  sessionEnd: string;
  status: "Online" | "Offline";
  lastActive: string;
  duration: string;
};

const Dashboard = () => {
  const rows: SessionRow[] = [
    {
      name: "Anna Nagar_TT",
      sessionStart: "10:00AM",
      sessionEnd: "11:00PM",
      status: "Offline",
      lastActive: "20/10/2025 11:02 PM",
      duration: "13 Hours",
    },
    {
      name: "Simmakal_Theatre",
      sessionStart: "10:00AM",
      sessionEnd: "11:00PM",
      status: "Online",
      lastActive: "-",
      duration: "13 Hours",
    },
    {
      name: "Anna Nagar_TT",
      sessionStart: "10:00AM",
      sessionEnd: "11:00PM",
      status: "Offline",
      lastActive: "20/10/2025 11:02 PM",
      duration: "13 Hours",
    },
    {
      name: "Simmakal_Theatre",
      sessionStart: "10:00AM",
      sessionEnd: "11:00PM",
      status: "Online",
      lastActive: "-",
      duration: "13 Hours",
    },
  ];

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

return (
  <div className="mx-auto w-full max-w-[1240px] p-4 overflow-x-hidden">
    <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Left column */}
      <div className="w-full min-w-0">
        {/* Top stats */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard primary value="23" label="Clients" />
          <StatCard value="12" label="Online" />
          <StatCard value="4" label="Offline" />
          <StatCard value="23" label="Players" />
        </div>

        <div className="mt-10 grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="min-w-0 w-full">
            <ClientsPieCard />
          </div>
          <div className="min-w-0 w-full">
            <PlayersBarCard />
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 flex w-full min-w-0 items-center gap-3">
          <select className="h-9 w-[180px] rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-black/70 outline-none">
            <option>Sort by Default</option>
            <option>Sort by Name</option>
            <option>Sort by Status</option>
          </select>
        </div>

        {/* Table */}
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
          />
        </div>
      </div>

      {/* Right column */}
      <div className="w-full min-w-0 flex flex-col gap-4">
        <SidebarCalendarCard />
        <AlertsCard />
        <RecentActivityCard />
      </div>
    </div>
  </div>
);

};

export default Dashboard;
