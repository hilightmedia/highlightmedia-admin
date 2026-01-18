import { Pencil, RefreshCcw, Wifi, WifiOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "../common/table";

import { useRouter } from "next/router";
import { useState } from "react";
import PlayerActions from "./components/playerActions";
import { formatDate, formatTime } from "@/src/lib/util";
import SelectPlaylist from "./components/selectPlaylist";

const Players = () => {
  const { data: players } = useQuery({
    queryKey: ["players"],
    queryFn: () =>
      axiosInstance.get("/players").then((res) => res.data.players),
  });

  const [selected, setSelected] = useState<number | null>(null);

  const router = useRouter();
  const columns = [
    {
      header: "Name",
      key: "name",
      render: (item: any) => (
        <div className="flex flex-col gap-1">{item.name}</div>
      ),
    },
    {
      header: "Playlist",
      key: "playlist",
      render: (item: any) =>  <SelectPlaylist selected={item.playlist} setSelected={setSelected}/>,
    },
    {
      header: "Session Start",
      key: "sessionStart",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.sessionStart ? (
            <>
              <span>{new Date(item.sessionStart).toLocaleDateString()}</span>
              <span>{new Date(item.sessionStart).toLocaleTimeString()}</span>
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      header: "Session End",
      key: "sessionEnd",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.sessionEnd ? (
            <>
              <span>{formatDate(item.sessionEnd)}</span>
              <span>{formatTime(item.sessionEnd)}</span>
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      header: "Staus",
      key: "status",
      render: (item: any) => {
        const statusColor =
          item.status === "Online" ? "bg-green-100" : "bg-red-100";

        return (
          <span
            className={`py-1 inline-flex items-center gap-1 px-3 rounded-full text-sm capitalize ${statusColor}`}
          >
            {item.status === "Online" ? (
              <Wifi
                color="#fff"
                size={15}
                className="p-0.5 bg-green-500 rounded-full "
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
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.lastActive ? (
            <>
              <span>{formatDate(item.lastActive)}</span>
              <span>{formatTime(item.lastActive)}</span>
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      header: "Session Duration",
      key: "sessionDuration",
      render: (item: any) => <span>{item.sessionDurationSec || "-"}</span>,
    },
    {
      header: "Actions",
      key: "actions",
      render: (item: any) => (
        <div className="inline-flex gap-4 items-center text-[#667085]">
          <button>
            <Pencil size={18} />
          </button>
          <button>
            {item.playlistId !== selected && <RefreshCcw size={18}/>}
          </button>
        </div>
      ),
    },
  ];
  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <PlayerActions />
      <Table data={players} columns={columns} maxHeight="h-auto" />
    </section>
  );
};

export default Players;
