import { Search, FolderPlus } from "lucide-react";

import React from "react";
import FolderFiltersDialog from "./folderFilters";
import {
  FolderParams,
  FolderQueryParams,
  SortBy,
  SortOrder,
} from "@/types/types";
import CreateFolder from "./createFolder";
import { FolderBulkActions, FoldersSortOptions } from "@/src/lib/constant";
import Button from "../../common/button";
import { FilterIconOutlined } from "../../common/icon";
import { Input } from "../../common/input";
import Select from "../../common/select";

interface Props {
  setCreateFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createFolderOpen: boolean;

  params: FolderParams;
  setParams: React.Dispatch<React.SetStateAction<any>>;
  checkedItems: any;
  setCheckedItems: React.Dispatch<React.SetStateAction<any>>;
}

export default function FolderActions({
  setCreateFolderOpen,
  createFolderOpen,
  params,
  setParams,
  setCheckedItems,
  checkedItems,
}: Props) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [bulkAction, setBulkAction] = React.useState("");
  console.log(bulkAction);

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
            onChange={(val: string) => setBulkAction(val)}
            className="min-w-full rounded-lg "
            containerClassName="w-auto"
            iconClassName="text-gray-500"
            disabled={!checkedItems.length}
          />
        </div>
        <Button className="button-gradient px-6 col-span-2 md:col-span-3" disabled={!checkedItems.length || !bulkAction}>Apply</Button>

        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setCreateFolderOpen(true)}
        >
          <FolderPlus size={18}/>
          Create Folder
        </Button>

        <div className="col-span-3">
          <Select
            options={FoldersSortOptions}
            value={`${params.sortBy ?? "lastModified"}:${
              params.sortOrder ?? "desc"
            }`}
            onChange={(val) => {
              const [sortBy, sortOrder] = String(val).split(":") as [
                SortBy,
                SortOrder
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
      <CreateFolder
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
      />
      <FolderFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          lastModifiedFrom: params.lastModifiedFrom ?? null,
          lastModifiedTo: params.lastModifiedTo ?? null,
          sizeBucket: params.sizeBucket ?? null,
          status: params.status ?? null,
        }}
        onApply={(next: FolderQueryParams) =>
          setParams((p: any) => ({ ...p, ...next }))
        }
        onReset={() =>
          setParams((p: any) => ({
            ...p,
            lastModifiedFrom: null,
            lastModifiedTo: null,
            sizeBucket: null,
            status: null,
          }))
        }
      />
    </>
  );
}
