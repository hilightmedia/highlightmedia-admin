"use client";

import { X } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../common/dialog";
import Button from "../../common/button";
import { PlayerQueryParams, PlayerStatus } from "@/types/types";

type Props = {
  open: boolean;
  onClose: () => void;
  value: PlayerQueryParams;
  onApply: (next: PlayerQueryParams) => void;
  onReset: () => void;
};

const chipBase =
  "border border-gray-300 rounded-full text-xs px-3 py-2 cursor-pointer select-none";
const chipActive = "border-primary";

export default function PlayerFiltersDialog({
  open,
  onClose,
  value,
  onApply,
  onReset,
}: Props) {
  const [draft, setDraft] = React.useState<PlayerQueryParams>(value);

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[520px] w-[92%] rounded-xl p-6 gap-5 bg-white">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-left">Filters</DialogTitle>
          <DialogDescription className="font-normal">
            Apply filters to narrow down the results.
          </DialogDescription>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5"
          >
            <X />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Status</div>
          <div className="flex flex-wrap gap-2">
            {([null, "Online", "Offline"] as (PlayerStatus | null)[]).map((s) => {
              const label = s === null ? "All" : s;
              const active = (draft.status ?? null) === s;
              return (
                <span
                  key={String(s)}
                  className={`${chipBase} ${active ? chipActive : ""}`}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      status: s,
                    }))
                  }
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full rounded-lg bg-white border-primary border text-black"
          >
            Reset Filters
          </Button>

          <Button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="w-full rounded-lg"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
