import { Badge, Check, Pencil, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import FolderActions from "./components/folderActions";
import Table from "../common/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FolderParams, Folders } from "@/types/types";
import CreateFolder from "./components/createFolder";
import { isEmpty } from "lodash";
import useDebounce from "@/src/hooks/useDebounce";
import Checkbox  from "../common/checkBox";
import EmptyState from "../common/emptyState";
import PopupConfirm from "../common/popupConfirm";
import { formatBytes } from "@/src/lib/util";

const Folder = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<FolderParams>({
    sortBy: "lastModified",
    sortOrder: "desc",
    search: "",
    lastModifiedFrom: null,
    lastModifiedTo: null,
    sizeBucket: null,
    status: null,
  });

  const { data: folders, refetch } = useQuery({
    queryKey: ["folders"],
    queryFn: () =>
      axiosInstance
        .get("/media/folders", { params })
        .then((res) => res.data.media),
  });
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const initialConfirmState = { open: false, id: null };
  const [confirmOpen, setConfirmOpen] = useState(initialConfirmState);

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.post(`/media/delete-folder`, { folderId: id }),
    onSuccess: () => {
      queryClient.setQueryData(["folders"], (old: any[] | undefined) => {
        if (!old) return old;
        return old.filter((f) => f.id !== confirmOpen.id);
      });

      setConfirmOpen(initialConfirmState);
    },
  });

  const handleDelete = () => {
    if (confirmOpen.id) {
      mutate(confirmOpen.id);
    }
  };

  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const [editFolder, setEditFolder] = useState<Folders | null>(null);

  const router = useRouter();
  const columns = [
    {
      header: "",
      key: "checkbox",
      cellClassName: "p-0 text-center",
      render: (item: any) => (
        <Checkbox
          className="border-[#EA6535]"
          checked={checkedItems.includes(item.id)}
          onCheckedChange={(checked) => {
            setCheckedItems(
              checked
                ? [...checkedItems, item.id]
                : checkedItems.filter((id) => id !== item.id)
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
      header: "Folder Name",
      key: "name",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          <button
            className="hover:underline cursor-pointer text-left"
            onClick={() => router.push(`/media/${item.id}`)}
          >
            {item.name}
          </button>
          <span className="flex items-center gap-1 text-xs font-medium">
            <Check className="w-3 h-3 bg-primary text-white text-xs font-medium p-0.5 rounded-full" />{" "}
            Approved
          </span>
        </div>
      ),
    },
    {
      header: "File Size",
      key: "items",
      render: (item: any) => (
        <span>{formatBytes(item.folderSize)}</span>
      ),
    },
    {
      header: "Last Modified",
      key: "lastModified",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.lastModified ? (
            <>
              <span>{new Date(item.lastModified).toLocaleDateString()}</span>
              <span>{new Date(item.lastModified).toLocaleTimeString()}</span>
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      header: "Validity Period",
      key: "validityStatus",
      render: (item: any) => {
        const validityStatusColor =
          item.validityStatus === "completed"
            ? "bg-green-100 text-green-600"
            : item.validityStatus === "running"
            ? "bg-[#F9F5FF] text-[#6941C6]"
            : "bg-red-100 text-red-600";
        const badgeColor =
          item.validityStatus === "completed"
            ? "bg-green-600"
            : item.validityStatus === "running"
            ? "bg-[#6941C6]"
            : "bg-red-600";
        return (
          <span
            className={`py-0.5 inline-flex items-center gap-1 px-3 rounded-full text-sm capitalize ${validityStatusColor}`}
          >
            <Badge color={badgeColor} fill={badgeColor} className="h-2 w-2" />{" "}
            {item.validityStatus}
          </span>
        );
      },
    },
    {
      header: "Validity Date",
      key: "validityDate",
      render: (item: any) => (
        <div className="inline-flex flex-col items-center text-xs">
          {item.validityStart && item.validityEnd ? (
            <>
              <span>{new Date(item.validityStart).toLocaleDateString()}</span>
              to
              <span>{new Date(item.validityEnd).toLocaleDateString()}</span>
            </>
          ) : (
            <span>No Expiry</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item: any) => (
        <span
          className={
            item.status === "active" ? "text-[#EA6535]" : "text-[#BCBCBC]"
          }
        >
          {item.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (item: any) => (
        <div className="inline-flex gap-4 items-center text-[#667085]">
          <button
            onClick={() =>
              setEditFolder({
                id: item.id,
                name: item.name,
                start_date: item?.validityStart || null,
                end_date: item?.validityEnd || null,
              })
            }
          >
            <Pencil size={18} />
          </button>
          <button onClick={() => setConfirmOpen({ open: true, id: item.id })}>
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];
  const debouncedSearch = useDebounce(params.search, 400);

  useEffect(() => {
    refetch();
  }, [
    refetch,
    params.sortBy,
    params.sortOrder,
    params.lastModifiedFrom,
    params.lastModifiedTo,
    params.sizeBucket,
    params.status,
    debouncedSearch,
  ]);

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <FolderActions
        params={params}
        setParams={setParams}
        createFolderOpen={createFolderOpen}
        setCreateFolderOpen={setCreateFolderOpen}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
      />
      {isEmpty(folders) ? (
        <EmptyState
          image="/emptyFolder.svg"
          buttonAction={() => setCreateFolderOpen(true)}
          message="Create a folder to get started"
        />
      ) : (
        <Table data={folders || []} columns={columns} maxHeight="h-auto" />
      )}
      <CreateFolder
        open={editFolder ? true : false}
        onClose={() => setEditFolder(null)}
        folder={editFolder}
      />
      <PopupConfirm
        open={confirmOpen.open}
        onClose={() => setConfirmOpen(initialConfirmState)}
        onConfirm={handleDelete}
        title="Delete Folder"
        message="Are you sure you want to delete this folder?"
        confirmText="Delete"
        loading={isPending}
      />
    </section>
  );
};

export default Folder;
