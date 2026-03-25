import React, { FormEvent,  useEffect, useState } from "react";
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
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDurationSec?: number;
  playlistFileId: number;
  refetchPlaylist: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any, Error>>;
}

const EditDuration = (props: Props) => {
  const { open, onClose, defaultDurationSec, playlistFileId, refetchPlaylist } =
    props;
  const [duration, setDuration] = useState<number>(defaultDurationSec || 0);

  useEffect(() => {
    if (!open) return;
    setDuration(defaultDurationSec || 0);
  }, [open, defaultDurationSec]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (duration <= 0) return alert("Duration must be greater than 0");
    mutate();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const id = Number(playlistFileId);
      const dur = Math.floor(Number(duration));

      return axiosInstance.post(`/playlist/playlistFile/${id}/edit-duration`, {
        duration: dur,
      });
    },
    onSuccess: async () => {
      await refetchPlaylist();
      onClose();
    },
  });

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
              Update duration for selected item
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

            <Button
              type="submit"
              loading={isPending}
              className="w-full max-w-[400px] rounded-lg"
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDuration;
