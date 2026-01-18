import { FolderPlusIcon, Plus, Search } from "lucide-react";

import React from "react";
import { PlaylistFilesQueryParams, SortBy, SortOrder } from "@/types/types";
import {
  FolderBulkActions,
  PlaylistFilesSortOptions,
} from "@/src/lib/constant";
import { useQueryClient } from "@tanstack/react-query";
import PlaylistFilesFiltersDialog from "./playlistFileFilters";
import AddFilesToPlaylistDialog from "./addFile";
import AddSubPlaylistsToPlaylistDialog from "./addSubPlaylist";
import Button from "../../common/button";
import { Input } from "../../common/input";
import Select from "../../common/select";
import { FilterIconOutlined } from "../../common/icon";

interface Props {
  playlistId: number;
  params: PlaylistFilesQueryParams;
  setParams: React.Dispatch<React.SetStateAction<any>>;
  checkedItems: any;
  setCheckedItems: React.Dispatch<React.SetStateAction<any>>;
  addFileOpen: boolean;
  setAddFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlaylistFileActions({
  params,
  setParams,
  setCheckedItems,
  checkedItems,
  playlistId,
  addFileOpen,
  setAddFileOpen,

}: Props) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [bulkAction, setBulkAction] = React.useState("");

  const [addSubPlaylistOpen, setAddSubPlaylistOpen] = React.useState(false);
  const queryClient = useQueryClient();
  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative flex-1 col-span-6  md:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={params.search ?? ""}
            onChange={(e) =>
              setParams((p: any) => ({ ...p, search: e.target.value }))
            }
          />
        </div>

        <div className="col-span-3 md:col-span-3">
          <Select
            options={FolderBulkActions}
            value={bulkAction}
            onChange={(val) => setBulkAction(val)}
            className="min-w-full rounded-lg "
            containerClassName="w-auto"
            iconClassName="text-gray-500"
          />
        </div>
        <Button className="button-gradient px-6 col-span-2 md:col-span-3">
          Apply
        </Button>

        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setAddFileOpen(true)}
        >
          <Plus size={18} />
          Add Files
        </Button>
        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setAddSubPlaylistOpen(true)}
        >
          <FolderPlusIcon size={18} />
          Add SubPlaylist
        </Button>

        <div className="col-span-3">
          <Select
            options={PlaylistFilesSortOptions}
            value={`${params.sortBy ?? "lastModified"}:${
              params.sortOrder ?? "desc"
            }`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [
                SortBy,
                SortOrder,
              ];
              setParams((p: any) => ({ ...p, sortBy, sortOrder }));
            }}
            className="min-w-full rounded-lg"
            containerClassName="w-auto"
            iconClassName="text-gray-500"
          />
        </div>

        <Button
          className="primary px-6 flex gap-2 items-center col-span-3"
          onClick={() => setFiltersOpen(true)}
        >
          <FilterIconOutlined /> Filters
        </Button>
      </div>

      <PlaylistFilesFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          search: params.search ?? "",
          sortBy: params.sortBy ?? "lastModified",
          sortOrder: params.sortOrder ?? "desc",

          lastModifiedFrom: params.lastModifiedFrom ?? null,
          lastModifiedTo: params.lastModifiedTo ?? null,

          sizeBucket: params.sizeBucket ?? null,
          type: params.type ?? null,
          durationBucket: params.durationBucket ?? null,
        }}
        onApply={(next) =>
          setParams((p: any) => ({
            ...p,
            ...next,
          }))
        }
        onReset={() =>
          setParams((p: any) => ({
            ...p,
            search: "",
            sortBy: "lastModified",
            sortOrder: "desc",
            lastModifiedFrom: null,
            lastModifiedTo: null,
            sizeBucket: null,
            type: null,
            durationBucket: null,
          }))
        }
      />
      <AddFilesToPlaylistDialog
        playlistId={playlistId}
        open={addFileOpen}
        onClose={() => setAddFileOpen(false)}
      />
      <AddSubPlaylistsToPlaylistDialog
        playlistId={playlistId}
        open={addSubPlaylistOpen}
        onClose={() => setAddSubPlaylistOpen(false)}
      />
    </>
  );
}
