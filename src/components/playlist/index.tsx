import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import Table from "../common/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatBytes, formatDate, formatSeconds } from "@/src/lib/util";
import ThreeDotMenu from "../common/threeDotMenu";
import PlaylistActions from "./components/playlistActions";
import useDebounce from "@/src/hooks/useDebounce";
import { isEmpty, set } from "lodash";
import EmptyState from "../common/emptyState";
import Checkbox from "../common/checkBox";
import { PlaylistEntity } from "@/types/types";
import CreatePlaylist from "./components/createPlaylist";
import PopupConfirm from "../common/popupConfirm";

const Playlist = () => {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [params, setParams] = useState<any>({
    sortBy: "lastModified",
    sortOrder: "desc",
    search: "",
    lastModifiedFrom: null,
    lastModifiedTo: null,
    durationBucket: null,
    durationFrom: null,
    durationTo: null,
  });

  const debouncedSearch = useDebounce(params.search, 400);

  const { data: playlist } = useQuery({
    queryKey: ["playlist", { ...params, search: debouncedSearch }],
    queryFn: () =>
      axiosInstance
        .get("/playlist", { params })
        .then((res) => res.data.playlists),
  });
  const initialConfirmState = { open: false, id: null };
  const [confirmOpen, setConfirmOpen] = useState(initialConfirmState);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/playlist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"], exact: true });

      setConfirmOpen(initialConfirmState);
    },
  });

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [editPlaylist, setEditPlaylist] = useState<PlaylistEntity | null>(null);

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
      header: "Name",
      key: "name",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          <button
            className="hover:underline cursor-pointer text-left"
            onClick={() => router.push(`/playlist/${item.id}`)}
          >
            {item.name}
          </button>
        </div>
      ),
    },
    {
      header: "Total Items",
      key: "totalItems",
      render: (item: any) => <span>{item.totalItems || 0}</span>,
    },
    {
      header: "Playlist Details",
      key: "durationSec",
      render: (item: any) => (
        <>
          <span>Duration - {formatSeconds(item?.durationSec || 0)}</span>
          <br />
          <span>Size - {formatBytes(+item?.playlistSize || 0)}</span>
        </>
      ),
    },
    {
      header: "Last Modified",
      key: "lastModified",
      render: (item: any) => (
        <div className="inline-flex gap-1 flex-col items-center">
          {item.lastModified ? (
            <>
              <span>{formatDate(item.lastModified)}</span>
              <span>{formatSeconds(item?.durationSec || 0)}</span>
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
        <div className=" text-[#667085]">
          <ThreeDotMenu
            options={[
              {
                label: "Edit",
                onClick: () => setEditPlaylist(item),
              },
              {
                label: "Delete",
                onClick: () => setConfirmOpen({ open: true, id: item.id }),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <PlaylistActions
        createPlaylistOpen={createPlaylistOpen}
        setCreatePlaylistOpen={setCreatePlaylistOpen}
        params={params}
        setParams={setParams}
        setCheckedItems={setCheckedItems}
        checkedItems={checkedItems}
      />
      {isEmpty(playlist) ? (
        <EmptyState
          image="/emptyFolder.svg"
          buttonAction={() => setCreatePlaylistOpen(true)}
          message="Add Files to this playlist"
        />
      ) : (
        <Table data={playlist} columns={columns} maxHeight="h-auto" />
      )}
      <CreatePlaylist
        open={editPlaylist ? true : false}
        onClose={() => setEditPlaylist(null)}
        playlist={editPlaylist}
      />
        {
          confirmOpen.id && <PopupConfirm
              open={confirmOpen.open}
              onClose={() => setConfirmOpen(initialConfirmState)}
              onConfirm={() => mutate(confirmOpen?.id || 0)}
              title="Delete Playlists"
              message="Are you sure you want to delete this Playlists?"
              confirmText="Delete"
              loading={isPending}
            />
        }
    </section>
  );
};

export default Playlist;
