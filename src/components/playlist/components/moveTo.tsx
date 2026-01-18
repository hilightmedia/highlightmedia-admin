import { Move } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../common/dialog";
import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { MoveToType } from "@/types/types";
import Button from "../../common/button";
import GradientIconContainer from "../../common/gradientIconContainer";
import { Input } from "../../common/input";

type Props = {
  open: boolean;
  onClose: () => void;
  file: MoveToType;
  playlistId: number;
};

export default function MoveTo({ open, onClose, file, playlistId }: Props) {
  const queryClient = useQueryClient();

  const [activeFile, setActiveFile] = useState<MoveToType | null>(null);
  const [toOrder, setToOrder] = useState<number | "">(1);

  useEffect(() => {
    if (!open) return;
    setActiveFile(file ?? null);
    setToOrder(file?.playOrder ?? 1);
  }, [open, file]);

  const fromOrder = activeFile?.playOrder ?? 1;
  const maxOrder = activeFile?.length ?? 1;


  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (activeFile?.id == null) throw new Error("Missing playlistFileId");

      return axiosInstance.post("/playlist/move-item", {
        playlistFileId: activeFile.id,
        playOrder: toOrder,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      onClose();
    },
  });

  const validate = (value: number) => {
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      return "Please enter a valid whole number";
    }
    if (value < 1) return "playOrder must be >= 1";
    if (value > maxOrder) return `playOrder must be <= ${maxOrder}`;
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newOrder = Number(toOrder);
    const error = validate(newOrder);
    if (error) {
      alert(error);
      return;
    }

    mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-w-[520px] w-[92%] rounded-xl p-6 gap-4 bg-white">
        <DialogHeader className="flex flex-col gap-3">
          <GradientIconContainer>
            <Move />
          </GradientIconContainer>

          <div className="flex flex-col gap-1">
            <DialogTitle className="text-left">Move</DialogTitle>
            <DialogDescription className="font-normal text-left">
              Move {file?.name}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex items-center gap-2 flex-wrap text-sm text-[#344054]">
            <span>Move {file?.name} from</span>

            <Input
              value={fromOrder}
              readOnly
              disabled
              className="w-[56px] h-8 px-2 text-center bg-[#F2F4F7] border border-[#EAECF0]"
            />

            <span>to</span>

            <Input
              type="number"
              min={1}
              max={maxOrder}
              value={toOrder}
              onChange={(e) => {
                const v = e.target.value;

                const clamped = v === "" ? "" : Math.min(Math.max(1, Math.trunc(Number(v))), maxOrder);
                setToOrder(clamped);
              }}
              className="w-[56px] h-8 px-2 text-center border border-[#EAECF0]"
            />

            <span className="text-xs text-[#667085]">
              (1 - {maxOrder})
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-white border-primary border text-black"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isPending}
              className="w-full rounded-lg"
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
