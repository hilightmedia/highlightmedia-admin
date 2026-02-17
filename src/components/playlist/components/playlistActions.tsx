import React from "react";
import { Search, Plus } from "lucide-react";
import { PlaylistParams, PlaylistQueryParams, SortByPlaylist, SortOrder } from "@/types/types";
import { PlaylistBulkActions, PlaylistSortOptions } from "@/src/lib/constant";
import Button from "../../common/button";
import { FilterIconOutlined } from "../../common/icon";
import { Input } from "../../common/input";
import Select from "../../common/select";
import PlaylistFiltersDialog from "./playlistfilters";
import CreatePlaylist from "./createPlaylist";
import PopupConfirm from "../../common/popupConfirm";
import { isEmpty } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import BulkAddFilesToPlaylistsDialog from "./addFilesMultiple";

type Props = {
  setCreatePlaylistOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createPlaylistOpen: boolean;
  checkedItems: number[];
  setCheckedItems: React.Dispatch<React.SetStateAction<number[]>>;
  params: PlaylistParams;
  setParams: React.Dispatch<React.SetStateAction<any>>;
};

export default function PlaylistActions({
  setCreatePlaylistOpen,
  createPlaylistOpen,
  params,
  setParams,
  checkedItems,
  setCheckedItems,
}: Props) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [bulkAction, setBulkAction] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [addFilesOpen, setAddFilesOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const ids = React.useMemo(
    () => Array.from(new Set((checkedItems ?? []).map(Number).filter((n) => Number.isFinite(n) && n > 0))),
    [checkedItems],
  );

  const { mutate: bulkDelete, isPending: deleting } = useMutation({
    mutationFn: (playlistIds: number[]) => axiosInstance.post(`/playlist/bulk-delete`, { playlistIds }),
    onSuccess: async () => {
      setCheckedItems([]);
      setBulkAction("");
      await queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });

  const handleApply = () => {
    if (!bulkAction || isEmpty(ids)) return;

    if (bulkAction === "delete") {
      setConfirmOpen(true);
      return;
    }

    if (bulkAction === "add") {
      setAddFilesOpen(true);
      return;
    }
  };

  const handleDeleteConfirm = () => {
    bulkDelete(ids);
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative flex-1 col-span-6 md:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={params.search ?? ""}
            onChange={(e) => setParams((p: any) => ({ ...p, search: e.target.value }))}
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={PlaylistBulkActions}
            value={bulkAction}
            onChange={(val) => setBulkAction(val)}
            className="min-w-full rounded-lg"
            containerClassName="w-auto"
            iconClassName="text-gray-500"
            disabled={isEmpty(ids)}
          />
        </div>

        <Button
          className="button-gradient px-6 col-span-2 md:col-span-3"
          disabled={!bulkAction || isEmpty(ids)}
          onClick={handleApply}
        >
          Apply
        </Button>

        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setCreatePlaylistOpen(true)}
        >
          <Plus size={18} />
          Create Playlist
        </Button>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={PlaylistSortOptions}
            value={`${params.sortBy ?? "lastModified"}:${params.sortOrder ?? "desc"}`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [SortByPlaylist, SortOrder];
              setParams((p: any) => ({ ...p, sortBy, sortOrder }));
            }}
            className="min-w-full rounded-lg"
            containerClassName="w-auto"
            iconClassName="text-gray-500"
          />
        </div>

        <Button className="primary px-6 flex gap-2 items-center col-span-3" onClick={() => setFiltersOpen(true)}>
          <FilterIconOutlined /> Filters
        </Button>
      </div>

      <CreatePlaylist open={createPlaylistOpen} onClose={() => setCreatePlaylistOpen(false)} />

      <PlaylistFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          lastModifiedFrom: params.lastModifiedFrom ?? null,
          lastModifiedTo: params.lastModifiedTo ?? null,
          durationBucket: params.durationBucket ?? null,
          durationFrom: params.durationFrom ?? null,
          durationTo: params.durationTo ?? null,
        }}
        onApply={(next: PlaylistQueryParams) => setParams((p: any) => ({ ...p, ...next }))}
        onReset={() =>
          setParams((p: any) => ({
            ...p,
            lastModifiedFrom: null,
            lastModifiedTo: null,
            durationBucket: null,
            durationFrom: null,
            durationTo: null,
          }))
        }
      />

      <PopupConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Playlists"
        message="Are you sure you want to delete selected playlists?"
        confirmText="Delete"
        loading={deleting}
      />

      <BulkAddFilesToPlaylistsDialog
        open={addFilesOpen}
        onClose={() => {
          setAddFilesOpen(false);
          setBulkAction("");
        }}
        playlistIds={ids}
        onAdded={() => {
          setCheckedItems([]);
          setBulkAction("");
          queryClient.invalidateQueries({ queryKey: ["playlists"] });
          queryClient.invalidateQueries({ queryKey: ["playlists-list"] });
        }}
      />
    </>
  );
}
