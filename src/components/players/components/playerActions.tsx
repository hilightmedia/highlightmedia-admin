"use client";

import { Search, FolderPlus } from "lucide-react";
import React from "react";
import { PlayerQueryParams, PlayerSortBy, SortOrder } from "@/types/types";
import Button from "../../common/button";
import { FilterIconOutlined } from "../../common/icon";
import { Input } from "../../common/input";
import Select from "../../common/select";
import CreatePlayer from "./createPlayer";
import { PlayersSortOptions } from "@/src/lib/constant";
import PlayerFiltersDialog from "./playersFiltersDialog";

interface Props {
  setCreatePlayerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createPlayerOpen: boolean;

  params: PlayerQueryParams;
  setParams: React.Dispatch<React.SetStateAction<PlayerQueryParams>>;
}

export default function PlayerActions({
  setCreatePlayerOpen,
  createPlayerOpen,
  params,
  setParams,
}: Props) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 items-center">
        <div className="relative flex-1 col-span-6 xl:col-span-5">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={params.search ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, search: e.target.value }))
            }
          />
        </div>
 
      <div className="col-span-6 hidden md:block"/>
        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setCreatePlayerOpen(true)}
        >
          <FolderPlus size={18} />
          Create Player
        </Button>

        <div className="col-span-3">
          <Select
            options={PlayersSortOptions}
            value={`${params.sortBy ?? "lastActive"}:${params.sortOrder ?? "desc"}`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [
                PlayerSortBy,
                SortOrder
              ];
              setParams((p) => ({ ...p, sortBy, sortOrder }));
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

      <CreatePlayer open={createPlayerOpen} onClose={() => setCreatePlayerOpen(false)} />

      <PlayerFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          status: params.status ?? null,
        }}
        onApply={(next: PlayerQueryParams) =>
          setParams((p) => ({ ...p, ...next }))
        }
        onReset={() =>
          setParams((p) => ({
            ...p,
            status: null,
          }))
        }
      />
    </>
  );
}
