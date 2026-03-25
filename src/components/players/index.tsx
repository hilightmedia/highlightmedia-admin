"use client";

import { Check, Pencil, RefreshCcw, Wifi, WifiOff, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "../common/table";
import { useMemo, useState } from "react";
import PlayerActions from "./components/playerActions";
import { formatDate, formatSeconds, formatTime } from "@/src/lib/util";
import SelectPlaylist from "./components/selectPlaylist";
import { PlayerQueryParams } from "@/types/types";
import CreatePlayer, { PlayerEntity } from "./components/createPlayer";
import EmptyState from "../common/emptyState";
import { isEmpty } from "lodash";

type PlaylistOption = { label: string; value: number };

const Players = ({ status }: { status: string }) => {
  const queryClient = useQueryClient();

  const [params, setParams] = useState<PlayerQueryParams>({
    sortBy: "lastActive",
    sortOrder: "desc",
    search: "",
    status: null,
  });

  const queryParams = useMemo(() => {
    const search =
      typeof params.search === "string" && params.search.trim().length > 0
        ? params.search.trim()
        : undefined;

    return {
      sortBy: params.sortBy ?? "lastActive",
      sortOrder: params.sortOrder ?? "desc",
      status: status === "all" ? (params.status ?? undefined) : status,
      search,
    };
  }, [params, status]);

  const {
    data: players,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["players", queryParams],
    queryFn: () =>
      axiosInstance
        .get("/players", { params: queryParams })
        .then((res) => res.data.players),
  });

  const { data: playlistOptions } = useQuery({
    queryKey: ["playlist-options"],
    queryFn: () =>
      axiosInstance.get("/playlist/list").then((res) => {
        const list = res.data.playlist ?? [];
        const opts: PlaylistOption[] = list.map((p: any) => ({
          label: p.name,
          value: p.id,
        }));
        return opts;
      }),
  });

  const [pendingPlaylistByPlayer, setPendingPlaylistByPlayer] = useState<
    Record<number, number>
  >({});

  const updatePlaylistMutation = useMutation({
    mutationFn: (input: { playerId: number; playlistId: number }) =>
      axiosInstance.post(`/players/${input.playerId}/update-playlist`, {
        playlistId: input.playlistId,
      }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setPendingPlaylistByPlayer((m) => {
        const next = { ...m };
        delete next[vars.playerId];
        return next;
      });
    },
  });

  const [createPlayerOpen, setCreatePlayerOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<PlayerEntity | null>(null);

  const closeModal = () => {
    setCreatePlayerOpen(false);
    setEditPlayer(null);
  };

  const columns = [
    {
      header: "Name",
      key: "name",
      cellClassName: "min-w-[130px]",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          <button className="hover:underline cursor-pointer text-left">
            {item.name}
          </button>
          {item.linked ? (
            <span className="flex items-center gap-1 text-xs font-medium">
              <Check className="w-3 h-3 bg-primary text-white text-xs font-medium p-0.5 rounded-full" />{" "}
              Linked
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium">
              <X className="w-3 h-3 bg-primary text-white text-xs font-medium p-0.5 rounded-full" />{" "}
              Not Linked
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Playlist",
      key: "playlist",
      cellClassName: "min-w-[180px]",
      render: (item: any) => {
        const currentId =
          typeof item.playlistId === "number" ? item.playlistId : null;
        const pendingId =
          typeof pendingPlaylistByPlayer[item.id] === "number"
            ? pendingPlaylistByPlayer[item.id]
            : null;
        const value = pendingId ?? currentId ?? "";
        return (
          <SelectPlaylist
            options={playlistOptions ?? []}
            value={value}
            onChange={(val: number) =>
              setPendingPlaylistByPlayer((m) => ({ ...m, [item.id]: val }))
            }
          />
        );
      },
    },
    {
      header: "Device Code",
      key: "deviceCode",
      cellClassName: "min-w-[130px]",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.deviceCode}
        </div>
      ),
    },
    {
      header: "Device Key",
      key: "deviceKey",
      cellClassName: "min-w-[130px]",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.deviceKey}
        </div>
      ),
    },
    {
      header: "Status",
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
                className="p-0.5 bg-green-500 rounded-full"
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
      cellClassName: "min-w-[130px]",
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
      cellClassName: "min-w-[130px]",
      render: (item: any) => (
        <span>{formatSeconds(item?.sessionDurationSec || 0)}</span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (item: any) => {
        const currentId =
          typeof item.playlistId === "number" ? item.playlistId : null;
        const pendingId =
          typeof pendingPlaylistByPlayer[item.id] === "number"
            ? pendingPlaylistByPlayer[item.id]
            : null;

        const changed =
          pendingId !== null &&
          currentId !== null &&
          Number(pendingId) !== Number(currentId);
        const saving =
          updatePlaylistMutation.isPending &&
          updatePlaylistMutation.variables?.playerId === item.id;

        return (
          <div className="inline-flex gap-4 items-center text-[#667085]">
            <button
              type="button"
              onClick={() =>
                setEditPlayer({
                  id: item.id,
                  name: item.name,
                  location: item.location,
                  playlistId:
                    typeof item.playlistId === "number"
                      ? item.playlistId
                      : null,
                  deviceKey: item.deviceKey,
                })
              }
            >
              <Pencil size={18} />
            </button>

            <button
              type="button"
              disabled={!changed || saving}
              onClick={() => {
                if (!changed || pendingId === null) return;
                updatePlaylistMutation.mutate({
                  playerId: item.id,
                  playlistId: pendingId,
                });
              }}
              className={
                !changed || saving ? "opacity-40 cursor-not-allowed" : ""
              }
            >
              {changed ? <RefreshCcw size={18} /> : null}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto h-[calc(100vh-100px)]">
      <PlayerActions
        setCreatePlayerOpen={setCreatePlayerOpen}
        createPlayerOpen={createPlayerOpen}
        params={params}
        setParams={setParams}
      />

      {!isEmpty(players) ? (
        <Table
          data={players ?? []}
          columns={columns}
          maxHeight="h-auto"
          loading={isLoading}
          error={Boolean(error)}
          onRetry={() => refetch()}
          showEmpty
          emptyMessage="No players found."
        />
      ) : (
        <EmptyState
          image="/emptyFolder.svg"
          buttonAction={() => setCreatePlayerOpen(true)}
          message="Create a folder to get started"
        />
      )}

      <CreatePlayer
        open={createPlayerOpen || Boolean(editPlayer)}
        onClose={closeModal}
        player={editPlayer}
      />
    </section>
  );
};

export default Players;
