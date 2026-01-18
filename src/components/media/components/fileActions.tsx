import { Search, Upload } from "lucide-react";

import React from "react";
import {
  FileParams,
  SortBy,
  SortOrder,
} from "@/types/types";
import {  FileBulkActions, FilesSortOptions } from "@/src/lib/constant";
import UploadFile from "./uploadFile";
import { useQueryClient } from "@tanstack/react-query";
import FileFiltersDialog from "./fileFilterOptions";
import Button from "../../common/button";
import { FilterIconOutlined } from "../../common/icon";
import { Input } from "../../common/input";
import Select from "../../common/select";

interface Props {
  folderId: number;
  params: FileParams;
  setParams: React.Dispatch<React.SetStateAction<any>>;
  checkedItems: any;
  setCheckedItems: React.Dispatch<React.SetStateAction<any>>;
  uploadFileOpen: boolean;
  setUploadFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileActions({
  params,
  setParams,
  setCheckedItems,
  checkedItems,
  folderId,
  uploadFileOpen,
  setUploadFileOpen,
}: Props) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [bulkAction, setBulkAction] = React.useState("");
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
            options={FileBulkActions}
            value={bulkAction}
            onChange={(val) => setBulkAction(val)}
            className="min-w-full rounded-lg "
            containerClassName="w-auto"
            iconClassName="text-gray-500"
            disabled={!checkedItems.length}
          />
        </div>
        <Button className="button-gradient px-6 col-span-2 md:col-span-3" disabled={!checkedItems.length}>
          Apply
        </Button>

        <Button
          className="button-gradient px-6 col-span-6 md:col-span-3"
          onClick={() => setUploadFileOpen(true)}
        >
          <Upload size={18} />
          Upload Files
        </Button>

        <div className="col-span-3">
          <Select
            options={FilesSortOptions}
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
      <UploadFile
        open={uploadFileOpen}
        onClose={() => setUploadFileOpen(false)}
        folderId={folderId}
        onUploaded={() =>
          queryClient.invalidateQueries({ queryKey: ["media"] })
        }
      />
      <FileFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          from: params.from ?? null,
          to: params.to ?? null,
          sizeBucket: params.sizeBucket ?? null,
          status: params.status ?? null,
          fileType: params.fileType ?? null,
        }}
        onApply={(next) => setParams((p: any) => ({ ...p, ...next }))}
        onReset={() =>
          setParams((p: any) => ({
            ...p,
            from: null,
            to: null,
            sizeBucket: null,
            status: null,
            fileType: null,
          }))
        }
      />
    </>
  );
}
