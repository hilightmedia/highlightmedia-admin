"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { FilePen, X } from "lucide-react";

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

type Props = {
  open: boolean;
  onClose: () => void;
  playlistFileIds: number[];
  defaultDurationSec?: number;
  onSuccess?: () => Promise<void> | void;
};

export default function BulkEditDurationDialog({
  open,
  onClose,
  playlistFileIds,
  defaultDurationSec = 30,
  onSuccess,
}: Props) {
  const [duration, setDuration] = useState<number>(defaultDurationSec);

  useEffect(() => {
    if (!open) return;
    setDuration(defaultDurationSec);
  }, [open, defaultDurationSec]);

  const payload = useMemo(() => {
    const d = Math.floor(Number(duration));
    return {
      playlistFileIds,
      duration: Number.isFinite(d) && d > 0 ? d : 0,
    };
  }, [playlistFileIds, duration]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstance.post("/playlist/bulk-edit-duration", payload),
    onSuccess: async () => {
      await onSuccess?.();
      onClose();
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!playlistFileIds?.length) return alert("No selected items");

    const d = Math.floor(Number(duration));
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
            Edit Duration
            <DialogDescription className="mt-2 font-normal">
              Update duration for <b>{playlistFileIds.length}</b> selected item(s)
            </DialogDescription>
          </DialogTitle>

          <button onClick={onClose} className="absolute top-5 right-5">
            <X />
          </button>
        </DialogHeader>

        <form className="flex flex-col gap-5 w-full" onSubmit={submit}>
          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">Duration (sec)</label>
            <Input
              type="number"
              min={1}
              step={1}
              placeholder="Enter duration"
              className="w-full"
              value={String(duration ?? "")}
              onChange={(e) =>
                setDuration(e.target.value === "" ? 0 : Number(e.target.value))
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
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
