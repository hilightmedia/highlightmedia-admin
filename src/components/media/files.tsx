import { Check, Folder, Pencil, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "../common/table";
import Image from "next/image";
import Checkbox from "../common/checkBox";
import { useRouter } from "next/router";
import { useState } from "react";
import FileActions from "./components/fileActions";
import { formatDate, formatTime } from "@/src/lib/util";
import { get, isEmpty } from "lodash";
import { FileParams } from "@/types/types";
import useDebounce from "@/src/hooks/useDebounce";
import EditFileName from "./components/editFileName";
import EmptyState from "../common/emptyState";
import PopupConfirm from "../common/popupConfirm";
import Breadcrumbs from "../common/breadCrumbs";

const Files = () => {
  const [params, setParams] = useState<FileParams>({
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
    from: null,
    to: null,
    sizeBucket: null,
    status: null,
    fileType: null,
  });
  const router = useRouter();
  const folderId =
    router.isReady && typeof router.query.id === "string"
      ? Number(router.query.id)
      : NaN;

  const enabled = router.isReady && Number.isFinite(folderId);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(params.search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["media", folderId, { ...params, search: debouncedSearch }],
    enabled: enabled,
    queryFn: () =>
      axiosInstance
        .get(`/media/${folderId}/media`, { params })
        .then((res) => res.data),
  });

  const media = get(data, "media", []);
  const folder = get(data, "folder", "");

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return axiosInstance.post(`/media/delete-file`, { fileId: id });
    },

    // onMutate: async (id: number) => {
    //   await queryClient.cancelQueries({ queryKey: ["media", folderId] });

    //   const prev = queryClient.getQueriesData<any[]>({
    //     queryKey: ["media", folderId],
    //   });

    //    queryClient.setQueriesData<any[]>(
    //     { queryKey: ["media", folderId], exact: false },
    //     (old) => (old ? old.filter((f) => f.id !== id) : old),
    //   );

    //   return { prev };
    // },

    // onError: (err, id, ctx) => {
    //   console.error("delete failed:", err);
    //   if (ctx?.prev) {
    //     for (const [key, data] of ctx.prev) queryClient.setQueryData(key, data);
    //   }
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", folderId] });
      setConfirmOpen(initialConfirmState);
    },
  });

  const handleDelete = () => {
    if (confirmOpen.id) {
      
      mutate(confirmOpen.id);
    }
  };

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const initialConfirmState = { open: false, id: null };

  const [confirmOpen, setConfirmOpen] = useState(initialConfirmState);
  const [editFileName, setEditFileName] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
                : checkedItems.filter((id) => id !== item.id),
            );
          }}
        />
      ),
    },
    {
      header: "Thumbnail",
      key: "thumbnail",
      render: (item: any) =>
        item.fileType && item.fileType.includes("image") ? (
          <Image
            src={item.url}
            alt={item.name}
            width={70}
            height={50}
            className="rounded-lg h-[50px] w-[70px] object-cover cursor-pointer"
          />
        ) : (
          <Folder size={60} />
        ),
    },
    {
      header: "File Name",
      key: "name",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          <button
            className="hover:underline cursor-pointer text-left truncate max-w-[200px]"
            // onClick={() => router.push(`/media/${item.id}`)}
            title={item.name}
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
      header: "File Type",
      key: "fileType",
      render: (item: any) => (
        <span className="capitalize">
          {item.fileType ? item.fileType.split("/")[0] : "N/A"}
        </span>
      ),
    },
    {
      header: "File Size",
      key: "items",
      render: (item: any) => (
        <span>{(Number(item.fileSize) || 0).toFixed(2)} MB</span>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.createdAt ? (
            <>
              <span>{formatDate(item.createdAt)}</span>
              <span>{formatTime(item.createdAt)}</span>
            </>
          ) : (
            <span className="text-[#BCBCBC]">N/A</span>
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
              setEditFileName({
                id: item.id,
                name: item.name,
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
  console.log(confirmOpen, "confirmOpen");
  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <FileActions
        setCheckedItems={setCheckedItems}
        checkedItems={checkedItems}
        folderId={Number(router.query.id)}
        params={params}
        setParams={setParams}
        uploadFileOpen={uploadFileOpen}
        setUploadFileOpen={setUploadFileOpen}
      />
      {!isLoading && (
        <Breadcrumbs
          items={[{ label: folder, href: `/media/${folderId}` }]}
          homeHref="/media"
          homeLabel={<Folder className="w-4 h-4" />}
        />
      )}

      {isEmpty(media) ? (
        <EmptyState
          image="/emptyFolder.svg"
          buttonAction={() => setUploadFileOpen(true)}
          message="Add files into your folder"
        />
      ) : (
        <Table data={media} columns={columns} maxHeight="h-auto" />
      )}
      {editFileName && (
        <EditFileName
          open={editFileName ? true : false}
          onClose={() => setEditFileName(null)}
          file={editFileName}
          folderId={folderId}
        />
      )}
      <PopupConfirm
        open={confirmOpen.open}
        onClose={() => setConfirmOpen(initialConfirmState)}
        onConfirm={handleDelete}
        title="Move to Trash"
        message="Are you sure you want to move this file to trash?"
        confirmText="Delete"
        loading={isPending}
      />
    </section>
  );
};

export default Files;
