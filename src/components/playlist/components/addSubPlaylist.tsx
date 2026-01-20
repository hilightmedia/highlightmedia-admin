import React from "react";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";

import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../common/dialog";
import Table from "../../common/table";
import Image from "next/image";
import Checkbox from "../../common/checkBox";
import Button from "../../common/button";
import { Input } from "../../common/input";
import { format } from "node:path";
import { formatSeconds } from "@/src/lib/util";

type PlaylistRow = {
  id: number;
  name: string;
  playlistSize: number;
  totalItems: number;
  durationSec: number;
  thumbnail?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  playlistId: number;
  defaultDurationSec?: number;
  onAdded?: () => void;
};

export default function AddSubPlaylistsToPlaylistDialog({
  open,
  onClose,
  playlistId,
  defaultDurationSec = 10,
  onAdded,
}: Props) {
  const [search, setSearch] = React.useState("");
  const [checkedIds, setCheckedIds] = React.useState<number[]>([]);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!open) return;
    setSearch("");
    setCheckedIds([]);
  }, [open]);

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["playlists-list"],
    enabled: open,
    queryFn: () =>
      axiosInstance
        .get(`/playlist`)
        .then((res) => (res.data.playlists ?? []) as PlaylistRow[]),
  });

  const byId = React.useMemo(() => {
    const m = new Map<number, PlaylistRow>();
    for (const p of playlists) m.set(p.id, p);
    return m;
  }, [playlists]);

  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = playlists;

    list = list.filter((p) => p.id !== playlistId);

    if (!s) return list;
    return list.filter((p) => p.name.toLowerCase().includes(s));
  }, [playlists, search, playlistId]);

  const allSelectedOnPage =
    filtered.length > 0 && filtered.every((p) => checkedIds.includes(p.id));

  const toggleSelectAllOnPage = (checked: boolean) => {
    const ids = filtered.map((p) => p.id);
    setCheckedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...ids]));
      return prev.filter((id) => !ids.includes(id));
    });
  };

  const getDurationForSubPlaylist = (id: number) => {
    const p = byId.get(id);
    const d = Number(p?.durationSec ?? 0);
    return Number.isFinite(d) && d > 0 ? Math.floor(d) : defaultDurationSec;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (subIds: number[]) =>
      axiosInstance.post(`/playlist/${playlistId}/bulk-add-sub-playlists`, {
        playlistId,
        items: subIds.map((id) => ({
          subPlaylistId: id,
          duration: getDurationForSubPlaylist(id),
        })),
      }),
    onSuccess: () => {
      onAdded?.();
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      onClose();
    },
  });

  const columns = [
    {
      header: (
        <Checkbox
          className="border-[#EA6535]"
          checked={allSelectedOnPage}
          onCheckedChange={(checked) => toggleSelectAllOnPage(Boolean(checked))}
        />
      ),
      key: "checkbox",
      cellClassName: "p-0 text-center w-[56px]",
      render: (item: PlaylistRow) => (
        <Checkbox
          className="border-[#EA6535]"
          checked={checkedIds.includes(item.id)}
          onCheckedChange={(checked) => {
            setCheckedIds((prev) =>
              checked
                ? [...prev, item.id]
                : prev.filter((id) => id !== item.id),
            );
          }}
        />
      ),
    },
    {
      header: "Thumbnail",
      key: "thumbnail",
      render: (item: any) =>
        item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.name}
            width={500}
            height={500}
            className="rounded-lg h-[50px] w-[70px] object-cover"
          />
        ) : (
          <div className="bg-gray-200 rounded-lg h-[50px] w-[70px] flex items-center justify-center text-gray-500">
            N/A
          </div>
        ),
    },
    {
      header: "SubPlaylist Name",
      key: "name",
      render: (item: PlaylistRow) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-7">{item.name}</span>
        </div>
      ),
    },
    {
      header: "Total Items",
      key: "totalItems",
      render: (item: PlaylistRow) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-7">{item.totalItems}</span>
        </div>
      ),
    },
    {
      header: "Playlist Size",
      key: "playlistSize",
      render: (item: PlaylistRow) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-7">{item.playlistSize} MB</span>
        </div>
      ),
    },
    {
      header: "Duration (sec)",
      key: "durationSec",
      render: (item: PlaylistRow) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-7">{formatSeconds(item.durationSec)}</span>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[860px] w-[92%] rounded-xl p-6 gap-4 bg-white">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-left">Add SubPlaylists</DialogTitle>
          <DialogDescription className="font-normal">
            Select one or more playlists to add as subplaylists.
          </DialogDescription>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5"
          >
            <X />
          </button>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table
          data={filtered}
          columns={columns as any}
          maxHeight="h-[420px]"
          tableOverflow="y"
          emptyMessage={isLoading ? "Loading..." : "No playlists found"}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-900">{checkedIds.length}</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white border border-black/10 text-black"
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="rounded-lg"
              disabled={checkedIds.length === 0 || isPending}
              onClick={() => mutate(checkedIds)}
            >
              {isPending ? "Adding..." : "Add SubPlaylists"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
