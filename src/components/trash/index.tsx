"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, RotateCcw } from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/src/helpers/axios";
import Button from "../common/button";
import { Input } from "../common/input";
import { cn } from "@/src/lib/util";
import Table, { TableColumn } from "../common/table";
import Checkbox from "../common/checkBox";

type TrashItem = {
  kind: "folder" | "file";
  id: number;
  name: string;
  type: string;
  location: string;
  deletedAtLabel: string;
  thumbnail?: string;
};

export default function Trash() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["trash", search],
    queryFn: async () => {
      const res = await axiosInstance.get("/trash", {
        params: { search: search || undefined },
      });
      return res.data as { items: TrashItem[] };
    },
  });

  const items = data?.items ?? [];

  const checkedKeys = useMemo(
    () => Object.keys(checked).filter((k) => checked[k]),
    [checked],
  );

  const allChecked = useMemo(() => {
    if (items.length === 0) return false;
    return items.every((it) => checked[`${it.kind}:${it.id}`]);
  }, [items, checked]);

  const restoreItem = useMutation({
    mutationFn: async ({
      kind,
      id,
    }: {
      kind: TrashItem["kind"];
      id: number;
    }) => {
      await axiosInstance.post(`/trash/${kind}/${id}/restore`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trash"] }),
  });

  const deleteItem = useMutation({
    mutationFn: async ({
      kind,
      id,
    }: {
      kind: TrashItem["kind"];
      id: number;
    }) => {
      await axiosInstance.delete(`/trash/${kind}/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trash"] }),
  });

  // const restoreAll = useMutation({
  //   mutationFn: async () => {
  //     await axiosInstance.post("/trash/restore-all");
  //   },
  //   onSuccess: () => {
  //     setChecked({});
  //     qc.invalidateQueries({ queryKey: ["trash"] });
  //   },
  // });

  // const emptyAll = useMutation({
  //   mutationFn: async () => {
  //     await axiosInstance.post("/trash/empty");
  //   },
  //   onSuccess: () => {
  //     setChecked({});
  //     qc.invalidateQueries({ queryKey: ["trash"] });
  //   },
  // });

  const applyBulkRestore = async () => {
    for (const key of checkedKeys) {
      const [kind, id] = key.split(":");
      await restoreItem.mutateAsync({ kind: kind as any, id: Number(id) });
    }
    setChecked({});
  };

  const applyBulkDelete = async () => {
    for (const key of checkedKeys) {
      const [kind, id] = key.split(":");
      await deleteItem.mutateAsync({ kind: kind as any, id: Number(id) });
    }
    setChecked({});
  };

  const columns: TableColumn<TrashItem>[] = [
    {
      header: (
        <Checkbox
          checked={allChecked}
          onCheckedChange={(v: boolean) => {
            const next = Boolean(v);
            const map: Record<string, boolean> = {};
            for (const it of items) map[`${it.kind}:${it.id}`] = next;
            setChecked(map);
          }}
        />
      ),
      key: "select",
      headerClassName: "w-[48px]",
      cellClassName: "w-[48px]",
      render: (it) => {
        const key = `${it.kind}:${it.id}`;
        return (
          <Checkbox
            checked={Boolean(checked[key])}
            onCheckedChange={(v: boolean) =>
              setChecked((m) => ({ ...m, [key]: Boolean(v) }))
            }
          />
        );
      },
    },
    {
      header: "Name",
      key: "name",
      render: (it) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-[50px] w-[70px] rounded-lg bg-black/5 overflow-hidden shrink-0",
              !it.thumbnail && "grid place-items-center text-xs text-black/40",
            )}
          >
            {it.thumbnail ? (
              <Image
                src={it.thumbnail}
                alt=""
                width={140}
                height={100}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg h-full w-full flex items-center justify-center text-gray-500">
                N/A
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-medium text-black/90 truncate w-[200px]">
              {it.name}
            </div>
            <div className="text-xs text-black/50">{it.deletedAtLabel}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      key: "type",
      headerClassName: "w-[140px]",
      cellClassName: "w-[140px]",
      render: (it) => (
        <div className="text-sm text-black/60 capitalize">{it.type}</div>
      ),
    },
    {
      header: "Location",
      key: "location",
      headerClassName: "w-[180px]",
      cellClassName: "w-[180px]",
      render: (it) => (
        <div className="text-sm text-black/60">{it.location}</div>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      key: "actions",
      headerClassName: "w-[230px] text-right",
      cellClassName: "w-[230px]",
      render: (it) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => restoreItem.mutate({ kind: it.kind, id: it.id })}
            disabled={restoreItem.isPending}
          >
            <RotateCcw size={16} className="mr-2" />
          </button>

          <button
            onClick={() => deleteItem.mutate({ kind: it.kind, id: it.id })}
            disabled={deleteItem.isPending}
          >
            <Trash2 size={18} color="red" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 w-full flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="text-2xl font-semibold">Trash</div>

      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
        <Input
          placeholder="Search..."
          className="max-w-[360px] bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3 justify-end">
          <Button
            className="primary px-5 h-10 rounded-lg"
            onClick={applyBulkRestore}
            disabled={checkedKeys.length === 0 || restoreItem.isPending}
          >
            <RotateCcw className="h-4 w-4" />
            Restore all items
          </Button>

          <Button
            className="button-gradient px-5 h-10 rounded-lg"
            onClick={applyBulkDelete}
            disabled={checkedKeys.length === 0 || deleteItem.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete Permanently
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-sm text-black/60">Loading...</div>
      ) : (
        <Table
          data={items}
          columns={columns}
          rowKey={(it) => `${it.kind}:${it.id}`}
          emptyMessage="No items in trash."
          containerClassName="bg-white"
          tableWrapperClassName="bg-white"
        />
      )}
    </div>
  );
}
