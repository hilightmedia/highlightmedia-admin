import { GripVertical } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import axiosInstance from "@/src/helpers/axios";
import { formatBytes, formatDate, formatSeconds, formatTime } from "@/src/lib/util";
import useDebounce from "@/src/hooks/useDebounce";

import PlaylistFileActions from "./components/playlistFileActions";
import { MoveToType, PlaylistFilesQueryParams } from "@/types/types";
import MoveTo from "./components/moveTo";
import ToggleMode from "./components/toggleMode";
import Breadcrumbs from "../common/breadCrumbs";
import Checkbox from "../common/checkBox";
import ThreeDotMenu from "../common/threeDotMenu";
import Table from "../common/table";
import { PlaylistOutlined } from "../common/icon";
import PopupConfirm from "../common/popupConfirm";
import { isEmpty } from "lodash";
import EmptyState from "../common/emptyState";

type ConfirmState = { open: boolean; id: number | null };

const PlaylistItem = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [params, setParams] = useState<PlaylistFilesQueryParams>({
    sortBy: "playOrder",
    sortOrder: "asc",
    search: "",
    lastModifiedFrom: null,
    lastModifiedTo: null,
    sizeBucket: null,
    durationBucket: null,
    type: null,
  });

  const playListId =
    router.isReady && typeof router.query.id === "string"
      ? Number(router.query.id)
      : NaN;

  const enabled = router.isReady && Number.isFinite(playListId);

  const [confirmOpen, setConfirmOpen] = useState<ConfirmState>({
    open: false,
    id: null,
  });

  const initialMoveState = { id: 0, name: "", playOrder: 1, length: 0 };
  const [moveOpen, setMoveOpen] = useState<MoveToType>(initialMoveState);

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const debouncedSearch = useDebounce(params.search, 500);

  const [reorderMode, setReorderMode] = useState(false);

  const [addFileOpen, setAddFileOpen] = useState(false);

  const queryKey = useMemo(
    () => ["playlist", playListId, { ...params, search: debouncedSearch }],
    [playListId, params, debouncedSearch],
  );

  const tableRef = useRef<HTMLDivElement | null>(null);
  const { data: playlist, isLoading } = useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlist/${playListId}`, {
        params: { ...params, search: debouncedSearch },
      });
      return res.data.playlist;
    },
  });

  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    setItems(playlist?.items || []);
  }, [playlist?.items]);

  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) =>
      axiosInstance.delete(`/playlist/playlistFile/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playlist", playListId],
        exact: true,
      });
      setConfirmOpen({ open: false, id: null });
    },
  });

  const handleDelete = () => {
    if (confirmOpen.id != null) deleteFile(confirmOpen.id);
  };

  const { mutate: moveItem } = useMutation({
    mutationFn: async (payload: {
      playlistFileId: number;
      playOrder: number;
    }) => axiosInstance.post("/playlist/move-item", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playlist", playListId],
      });
    },
  });

  const { mutate: duplicateItem } = useMutation({
    mutationFn: async (payload: { playlistFileId: number }) =>
      axiosInstance.post("/playlist/add-file", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playlist", playListId],
      });
    },
  });

  const dragFromIndexRef = useRef<number | null>(null);

  const reorderArray = (arr: any[], from: number, to: number) => {
    const next = [...arr];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);

    // keep playOrder consistent with UI order (1-based)
    return next.map((it, idx) => ({ ...it, playOrder: idx + 1 }));
  };

  const getRowProps = (item: any, index: number) => {
    if (!reorderMode) return {};

    return {
      draggable: true,
      onDragStart: () => {
        dragFromIndexRef.current = index;
      },
      onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault(); // allow drop
      },
      onDrop: () => {
        const from = dragFromIndexRef.current;
        const to = index;

        if (from == null || from === to) return;

        const newList = reorderArray(items, from, to);
        setItems(newList);

        const moved = newList[to];
        const playlistFileId = moved.playlistFileId ?? moved.id;
        const newOrder = to + 1;

        if (Number.isFinite(playlistFileId)) {
          moveItem({
            playlistFileId: Number(playlistFileId),
            playOrder: newOrder,
          });
        }

        dragFromIndexRef.current = null;
      },
      onDragEnd: () => {
        dragFromIndexRef.current = null;
      },
      className: "cursor-grab active:cursor-grabbing",
    } as React.HTMLAttributes<HTMLTableRowElement>;
  };

  const columns = useMemo(
    () => [
      {
        header: "",
        key: "selectOrDrag",
        cellClassName: "p-0 text-center w-[48px]",
        render: (item: any) =>
          reorderMode ? (
            <div className="w-full flex items-center justify-center text-[#EA6535]">
              <GripVertical size={18} />
            </div>
          ) : (
            <Checkbox
              className="border-[#EA6535]"
              checked={checkedItems.includes(item.id)}
              onCheckedChange={(checked) => {
                setCheckedItems((prev) =>
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
          (item.url && item.type.split("/")[0] === "image") ? (
            <Image
              src={item.url}
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
        header: "Name",
        key: "name",
        cellClassName: "max-w-[200px]",
        render: (item: any) => (
          <div className="flex flex-col gap-1">
            <button
              className="hover:underline cursor-pointer text-left truncate"
              onClick={() => {
                if (item.type === "subPlaylist")
                  router.push(`/playlist/${item.subPlaylistId}`);
                else router.push(`/media/${item.fileId}`);
              }}
            >
              {item.name}
            </button>
          </div>
        ),
      },
      {
        header: "Type",
        key: "type",
        render: (item: any) => (
          <span className="capitalize">
            {item.type?.split("/")[0] || "N/A"}
          </span>
        ),
      },
      {
        header: "Item Details",
        key: "duration",
        cellClassName: "min-w-[180px]",
        render: (item: any) => (
          <>
            <span>Duration - {formatSeconds(item?.duration || 0)}</span>
            <br />
            <span>Size - {formatBytes(+item?.size || 0)}</span>
          </>
        ),
      },
      {
        header: "Play order",
        key: "playOrder",
        render: (item: any) => (
          <span className="capitalize">{item?.playOrder ?? 0}</span>
        ),
      },
      {
        header: "Count",
        key: "logsCount",
        render: (item: any) => (
          <span className="capitalize">{item?.logsCount ?? 0}</span>
        ),
      },
      {
        header: "Last modified",
        key: "lastModified",
        render: (item: any) => (
          <div className="inline-flex gap-1 flex-col items-center">
            {item.lastModified ? (
              <>
                <span>{formatDate(item.lastModified)}</span>
                <span>{formatTime(item.lastModified)}</span>
              </>
            ) : (
              <span className="text-xs">N/A</span>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        key: "actions",
        render: (item: any) => (
          <div className="inline-flex gap-4 items-center text-[#667085]">
            <ThreeDotMenu
              containerRef={tableRef}
              options={[
                {
                  label: "Move",
                  onClick: () =>
                    setMoveOpen({
                      id: item.playlistFileId,
                      name: item.name,
                      playOrder: item.playOrder,
                      length: items.length || 0,
                    }),
                },
                {
                  label: "Duplicate",
                  onClick: () => duplicateItem(item.playlistFileId),
                },
                {
                  label: "Delete",
                  onClick: () =>
                    setConfirmOpen({ open: true, id: item.playlistFileId }),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [checkedItems, router, reorderMode, items.length],
  );

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <PlaylistFileActions
        playlistId={playListId}
        params={params}
        setParams={setParams}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
        addFileOpen={addFileOpen}
        setAddFileOpen={setAddFileOpen}
        defaultDuration={playlist?.defaultDuration || 30}
      />

      {!isLoading && (
        <div className="flex items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: playlist?.name, href: `/playlist/${playlist?.id}` },
            ]}
            homeHref="/playlist"
            homeLabel={<PlaylistOutlined className="w-4 h-4" />}
          />

          <ToggleMode
            reorderMode={reorderMode}
            setReorderMode={setReorderMode}
            setCheckedItems={setCheckedItems}
          />
        </div>
      )}
      {isEmpty(playlist?.items) ? (
        <EmptyState
          image="/emptyFolder.svg"
          buttonAction={() => setAddFileOpen(true)}
          message="Add Files to this playlist"
        />
      ) : (
        <Table
          data={reorderMode ? playlist.items : items}
          columns={columns}
          maxHeight="h-auto"
          getRowProps={getRowProps}
          containerRef={tableRef}
        />
      )}

      <PopupConfirm
        open={confirmOpen.open}
        onClose={() => setConfirmOpen({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete File"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        loading={isDeleting}
      />

      <MoveTo
        open={moveOpen?.id ? true : false}
        onClose={() => setMoveOpen(initialMoveState)}
        file={moveOpen}
        playlistId={playListId}
      />
    </section>
  );
};

export default PlaylistItem;
