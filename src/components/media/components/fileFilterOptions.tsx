import { X } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../common/dialog";

import { FileQueryParams, MediaStatus, SizeBucket } from "@/types/types";
import { isRangeSelected, toYMD } from "@/src/lib/util";
import Button from "../../common/button";
import { Input } from "../../common/input";


type Props = {
  open: boolean;
  onClose: () => void;
  value: FileQueryParams;
  onApply: (next: FileQueryParams) => void;
  onReset: () => void;
};

const chipBase =
  "border border-gray-300 rounded-full text-xs px-3 py-2 cursor-pointer select-none";
const chipActive = "border-primary";

export default function FileFiltersDialog({
  open,
  onClose,
  value,
  onApply,
  onReset,
}: Props) {
  const [draft, setDraft] = React.useState<FileQueryParams>(value);

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
      from: from.toISOString(),
      to: to.toISOString(),
    }));
  };

  const setQuickMonths = (months: number) => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    setDraft((d) => ({
      ...d,
      from: from.toISOString(),
      to: to.toISOString(),
    }));
  };

  // highlight chips when current selected range matches
  const isLast7Selected = isRangeSelected(7, undefined, {
    lastModifiedFrom: draft.from ?? null,
    lastModifiedTo: draft.to ?? null,
  } as any);

  const isLast30Selected = isRangeSelected(30, undefined, {
    lastModifiedFrom: draft.from ?? null,
    lastModifiedTo: draft.to ?? null,
  } as any);

  const isLast6MonthsSelected = isRangeSelected(undefined, 6, {
    lastModifiedFrom: draft.from ?? null,
    lastModifiedTo: draft.to ?? null,
  } as any);

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

        {/* Date Range */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Date Range</div>

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

          <div className="font-medium text-sm mt-2">Custom Date Range</div>
          <div className="flex gap-3">
            <Input
              type="date"
              value={toYMD(draft.from ?? null)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, from: e.target.value }))
              }
            />
            <Input
              type="date"
              value={toYMD(draft.to ?? null)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, to: e.target.value }))
              }
            />
          </div>
        </div>

        {/* File Type */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">File Type</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: null },
              { label: "Images", value: "image" },
              { label: "Videos", value: "video" },
              { label: "PDF", value: "application/pdf" },
            ].map((opt) => (
              <span
                key={String(opt.value)}
                className={`${chipBase} ${
                  (draft.fileType ?? null) === opt.value ? chipActive : ""
                }`}
                onClick={() => setDraft((d) => ({ ...d, fileType: opt.value }))}
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>

        {/* File Size */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">File Size</div>
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

        {/* Status */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Status</div>
          <div className="flex flex-wrap gap-2">
            {(["active", "inactive"] as MediaStatus[]).map((s) => (
              <span
                key={s}
                className={`${chipBase} ${draft.status === s ? chipActive : ""}`}
                onClick={() =>
                  setDraft((d) => ({ ...d, status: d.status === s ? null : s }))
                }
              >
                {s}
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
