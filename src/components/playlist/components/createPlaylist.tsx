"use client";

import { FilePen, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../../common/dialog";
import Button from "../../common/button";
import GradientIconContainer from "../../common/gradientIconContainer";
import { Input } from "../../common/input";
import { PlaylistEntity } from "@/types/types";



type Props = {
  open: boolean;
  onClose: () => void;
  playlist?: PlaylistEntity | null;
};

type FormData = {
  name: string;
  defaultDuration: number;
};

export default function CreatePlaylist({ open, onClose, playlist }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    defaultDuration: 30,
  });

  const queryClient = useQueryClient();
  const [activePlaylist, setActivePlaylist] = useState<PlaylistEntity | null>(null);

  useEffect(() => {
    if (open) setActivePlaylist(playlist ?? null);
  }, [open, playlist]);

  const isEdit = Boolean(activePlaylist?.id);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: activePlaylist?.name ?? "",
      defaultDuration:
        typeof activePlaylist?.defaultDuration === "number" &&
        Number.isFinite(activePlaylist.defaultDuration) &&
        activePlaylist.defaultDuration > 0
          ? activePlaylist.defaultDuration
          : 30,
    });
  }, [open, activePlaylist]);

  const payload = useMemo(() => {
    const dur = Math.floor(Number(formData.defaultDuration));
    return {
      name: formData.name,
      defaultDuration: Number.isFinite(dur) && dur > 0 ? dur : 30,
      playlistId: activePlaylist?.id,
    };
  }, [formData.defaultDuration, formData.name, activePlaylist?.id]);

  const onSuccess = () => {
    if (isEdit) {
      queryClient.setQueryData(["playlist"], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map((p) => {
          if (p.id === activePlaylist?.id) {
            return { ...p, name: payload.name, defaultDuration: payload.defaultDuration };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["playlist", activePlaylist?.id] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    }
    onClose();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post(isEdit ? `/playlist/${activePlaylist?.id}/edit-playlist` : "/playlist/create", payload),
    onSuccess: () => onSuccess(),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a name");

    const d = Math.floor(Number(formData.defaultDuration));
    if (!Number.isFinite(d) || d <= 0) return alert("Please enter a valid duration");

    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[500px] w-[90%] rounded-xl p-6 gap-3 bg-white">
        <DialogHeader className="flex flex-col gap-3">
          <GradientIconContainer>
            <FilePen />
          </GradientIconContainer>

          <DialogTitle className="text-left">
            {isEdit ? "Edit Playlist" : "Create Playlist"}
            <DialogDescription className="mt-2 font-normal">
              {isEdit ? "Edit your playlist" : "Create a new playlist"}
            </DialogDescription>
          </DialogTitle>

          <button onClick={onClose} className="absolute top-5 right-5">
            <X />
          </button>
        </DialogHeader>

        <form className="flex flex-col gap-5 w-full" onSubmit={submit}>
          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Playlist Name</label>
            <Input
              type="name"
              placeholder="Enter your playlist name"
              className="w-full"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Default Duration (sec)</label>
            <Input
              type="number"
              min={1}
              step={1}
              placeholder="Enter default duration"
              className="w-full"
              value={String(formData.defaultDuration ?? "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  defaultDuration: e.target.value === "" ? 0 : Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="w-full max-w-[400px] rounded-lg bg-white border-primary border text-black"
            >
              Cancel
            </Button>

            <Button type="submit" loading={isPending} className="w-full max-w-[400px] rounded-lg">
              {isEdit ? "Edit Playlist" : "Create Playlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
