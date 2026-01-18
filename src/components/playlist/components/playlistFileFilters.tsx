import { X } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../common/dialog";

import { isRangeSelected, toYMD } from "@/src/lib/util";
import { DurationBucket, PlaylistFilesQueryParams, SizeBucket } from "@/types/types";
import Button from "../../common/button";
import { Input } from "../../common/input";




type Props = {
  open: boolean;
  onClose: () => void;
  value: PlaylistFilesQueryParams;
  onApply: (next: PlaylistFilesQueryParams) => void;
  onReset: () => void;
};

const chipBase =
  "border border-gray-300 rounded-full text-xs px-3 py-2 cursor-pointer select-none";
const chipActive = "border-primary";

export default function PlaylistFilesFiltersDialog({
  open,
  onClose,
  value,
  onApply,
  onReset,
}: Props) {
  const [draft, setDraft] = React.useState<PlaylistFilesQueryParams>(value);

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
  }, [open, value]);

  const setQuickRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setDraft((d) => ({
      ...d,
      lastModifiedFrom: from.toISOString(),
      lastModifiedTo: to.toISOString(),
    }));
  };

  const setQuickMonths = (months: number) => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    setDraft((d) => ({
      ...d,
      lastModifiedFrom: from.toISOString(),
      lastModifiedTo: to.toISOString(),
    }));
  };

  const isLast7Selected = isRangeSelected(7, undefined, {
    lastModifiedFrom: draft.lastModifiedFrom ?? null,
    lastModifiedTo: draft.lastModifiedTo ?? null,
  } as any);

  const isLast30Selected = isRangeSelected(30, undefined, {
    lastModifiedFrom: draft.lastModifiedFrom ?? null,
    lastModifiedTo: draft.lastModifiedTo ?? null,
  } as any);

  const isLast6MonthsSelected = isRangeSelected(undefined, 6, {
    lastModifiedFrom: draft.lastModifiedFrom ?? null,
    lastModifiedTo: draft.lastModifiedTo ?? null,
  } as any);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[520px] w-[92%] rounded-xl p-6 gap-5 bg-white">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-left">Filters</DialogTitle>
          <DialogDescription className="font-normal">
            Apply filters to narrow down the playlist items.
          </DialogDescription>

          <button type="button" onClick={onClose} className="absolute top-5 right-5">
            <X />
          </button>
        </DialogHeader>

        {/* Last Modified Range */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Last Modified</div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`${chipBase} ${isLast7Selected ? chipActive : ""}`}
              onClick={() => setQuickRange(7)}
            >
              Last 7 days
            </span>

            <span
              className={`${chipBase} ${isLast30Selected ? chipActive : ""}`}
              onClick={() => setQuickRange(30)}
            >
              Last 30 days
            </span>

            <span
              className={`${chipBase} ${isLast6MonthsSelected ? chipActive : ""}`}
              onClick={() => setQuickMonths(6)}
            >
              Last 6 months
            </span>
          </div>

          <div className="font-medium text-sm mt-2">Custom Range</div>
          <div className="flex gap-3">
            <Input
              type="date"
              value={toYMD(draft.lastModifiedFrom ?? null)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, lastModifiedFrom: e.target.value }))
              }
            />
            <Input
              type="date"
              value={toYMD(draft.lastModifiedTo ?? null)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, lastModifiedTo: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Type</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: null },
              { label: "Images", value: "image" },
              { label: "Videos", value: "video" },
              { label: "PDF", value: "application/pdf" },
              { label: "SubPlaylist", value: "subPlaylist" },
            ].map((opt) => (
              <span
                key={String(opt.value)}
                className={`${chipBase} ${(draft.type ?? null) === opt.value ? chipActive : ""}`}
                onClick={() => setDraft((d) => ({ ...d, type: opt.value }))}
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Size</div>
          <div className="flex flex-wrap gap-2">
            {(["0-10", "10-100", "100+"] as SizeBucket[]).map((b) => (
              <span
                key={b}
                className={`${chipBase} ${draft.sizeBucket === b ? chipActive : ""}`}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    sizeBucket: d.sizeBucket === b ? null : b,
                  }))
                }
              >
                {b === "0-10" ? "0 - 10 MB" : b === "10-100" ? "10 - 100 MB" : "100+ MB"}
              </span>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Duration</div>
          <div className="flex flex-wrap gap-2">
            {(["0-3", "5-10", "10+"] as DurationBucket[]).map((b) => (
              <span
                key={b}
                className={`${chipBase} ${draft.durationBucket === b ? chipActive : ""}`}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    durationBucket: d.durationBucket === b ? null : b,
                  }))
                }
              >
                {b === "0-3" ? "0 - 3 min" : b === "5-10" ? "5 - 10 min" : "10+ min"}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
