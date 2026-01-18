"use client";

import { FilePen, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../../common/dialog";
import Button from "../../common/button";
import GradientIconContainer from "../../common/gradientIconContainer";
import { Input } from "../../common/input";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreatePlaylist({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;
    setName("");
  }, [open]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstance.post("/playlist/create", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
      onClose();
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return alert("Please enter a name");
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
            Create Playlist
            <DialogDescription className="mt-2 font-normal">
              Create a new playlist
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Create Playlist
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
