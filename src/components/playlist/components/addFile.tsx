import React from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder as FolderIcon, ArrowLeft, X } from "lucide-react";
import axiosInstance from "@/src/helpers/axios";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../common/dialog";
import Table from "../../common/table";
import Button from "../../common/button";
import { Input } from "../../common/input";
import Checkbox from "../../common/checkBox";

type FolderRow = { id: number; name: string };

type FileRow = {
  id: number;
  name: string;
  fileType: string;
  fileKey: string;
  url: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  playlistId: number;
  defaultDurationSec?: number;
  onAdded?: () => void;
};

export default function AddFilesToPlaylistDialog({
  open,
  onClose,
  playlistId,
  defaultDurationSec = 10,
  onAdded,
}: Props) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedFolderId, setSelectedFolderId] = React.useState<number | null>(
    null
  );
  const [checkedFileIds, setCheckedFileIds] = React.useState<number[]>([]);
  const [folderSearch, setFolderSearch] = React.useState("");
  const [fileSearch, setFileSearch] = React.useState("");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!open) return;
    setStep(1);
    setSelectedFolderId(null);
    setCheckedFileIds([]);
    setFolderSearch("");
    setFileSearch("");
  }, [open]);

  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["picker-folders"],
    enabled: open,
    queryFn: () =>
      axiosInstance
        .get(`/media/get-folders`)
        .then((res) => (res.data.clients ?? []) as FolderRow[]),
  });

  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["picker-files", selectedFolderId],
    enabled: open && step === 2 && Number.isFinite(selectedFolderId as any),
    queryFn: () =>
      axiosInstance
        .get(`/media/${selectedFolderId}/get-files`)
        .then((res) => (res.data.fileUrlUpdate ?? []) as FileRow[]),
  });

  const filteredFolders = React.useMemo(() => {
    const s = folderSearch.trim().toLowerCase();
    if (!s) return folders;
    return folders.filter((f) => f.name.toLowerCase().includes(s));
  }, [folders, folderSearch]);

  const filteredFiles = React.useMemo(() => {
    const s = fileSearch.trim().toLowerCase();
    if (!s) return files;
    return files.filter((f) => f.name.toLowerCase().includes(s));
  }, [files, fileSearch]);

  const allSelectedOnPage =
    filteredFiles.length > 0 &&
    filteredFiles.every((f) => checkedFileIds.includes(f.id));

  const toggleSelectAllOnPage = (checked: boolean) => {
    const ids = filteredFiles.map((f) => f.id);
    setCheckedFileIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...ids]));
      return prev.filter((id) => !ids.includes(id));
    });
  };

  const { mutate: addFiles, isPending } = useMutation({
    mutationFn: (fileIds: number[]) =>
      axiosInstance.post(`/playlist/${playlistId}/bulk-add-files`, {
        playlistId,
        items: fileIds.map((id) => ({
          fileId: id,
          duration: defaultDurationSec,
        })),
      }),
    onSuccess: () => {
      onAdded?.();
       queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      onClose();
    },
  });

  const folderColumns = [
    {
      header: "",
      key: "icon",
      cellClassName: "w-[56px]",
      render: () => (
        <div className="w-[40px] h-[40px] rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer">
          <FolderIcon className="w-5 h-5 text-gray-600" />
        </div>
      ),
    },
    {
      header: "Destination Folder",
      key: "name",
      render: (item: FolderRow) => (
        <div className="flex flex-col cursor-pointer">
          <span className="font-medium text-gray-900">{item.name}</span>
          <span className="text-xs text-gray-500">Click to view files</span>
        </div>
      ),
    },
  ];

  const fileColumns = [
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
      render: (item: FileRow) => (
        <Checkbox
          className="border-[#EA6535]"
          checked={checkedFileIds.includes(item.id)}
          onCheckedChange={(checked) => {
            setCheckedFileIds((prev) =>
              checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)
            );
          }}
        />
      ),
    },
    {
      header: "Thumbnail",
      key: "thumbnail",
      render: (item: FileRow) =>
        item.fileType?.includes("image") ? (
          <Image
            src={item.url}
            alt={item.name}
            width={70}
            height={50}
            className="rounded-lg h-[50px] w-[70px] object-cover"
          />
        ) : (
          <div className="w-[70px] h-[50px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
            N/A
          </div>
        ),
    },
    {
      header: "Name",
      key: "name",
      render: (item: FileRow) => (
        <div className="flex flex-col">
          <span
            className="font-medium text-gray-900 truncate max-w-[240px]"
            title={item.name}
          >
            {item.name}
          </span>
          <span className="text-xs text-gray-500">
            {item.fileType?.includes("/")
              ? item.fileType.split("/")[0]
              : item.fileType || "N/A"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[860px] w-[92%] rounded-xl p-6 gap-4 bg-white">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-left">
            {step === 1 ? "Select Destination Folder" : "Select Files"}
          </DialogTitle>
          <DialogDescription className="font-normal">
            {step === 1
              ? "Choose a folder to browse and select files."
              : "Select one or more files to add to the playlist."}
          </DialogDescription>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5"
          >
            <X />
          </button>
        </DialogHeader>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search folders..."
                value={folderSearch}
                onChange={(e) => setFolderSearch(e.target.value)}
              />
            </div>

            <Table
              data={filteredFolders}
              columns={folderColumns as any}
              maxHeight="h-[420px]"
              tableOverflow="y"
              onRowClick={(item: FolderRow) => {
                setSelectedFolderId(item.id);
                setCheckedFileIds([]);
                setStep(2);
              }}
              emptyMessage={foldersLoading ? "Loading..." : "No folders found"}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-white border border-black/10 text-black"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled
                className="rounded-lg opacity-60 cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                onClick={() => {
                  setStep(1);
                  setSelectedFolderId(null);
                  setCheckedFileIds([]);
                  setFileSearch("");
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to folders
              </button>

              <div className="flex items-center gap-3 w-full md:max-w-[420px]">
                <Input
                  placeholder="Search files..."
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                />
              </div>
            </div>

            <Table
              data={filteredFiles}
              columns={fileColumns as any}
              maxHeight="h-[420px]"
              tableOverflow="y"
              emptyMessage={filesLoading ? "Loading..." : "No files found"}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium text-gray-900">
                  {checkedFileIds.length}
                </span>
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
                  disabled={checkedFileIds.length === 0 || isPending}
                  onClick={() => addFiles(checkedFileIds)}
                >
                  {isPending ? "Adding..." : "Add Files"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
