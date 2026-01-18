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
import { DurationBucket, PlaylistQueryParams } from "@/types/types";
import Button from "../../common/button";
import { Input } from "../../common/input";

type Props = {
  open: boolean;
  onClose: () => void;
  value: PlaylistQueryParams;
  onApply: (next: PlaylistQueryParams) => void;
  onReset: () => void;
};

const chipBase =
  "border border-gray-300 rounded-full text-xs px-3 py-2 cursor-pointer select-none";
const chipActive = "border-primary";

type DateRangeValue = {
  lastModifiedFrom: string | null;
  lastModifiedTo: string | null;
};

export default function PlaylistFiltersDialog({
  open,
  onClose,
  value,
  onApply,
  onReset,
}: Props) {
  const [draft, setDraft] = React.useState<PlaylistQueryParams>(value);

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

  const lastModifiedRange: DateRangeValue = {
    lastModifiedFrom: draft.lastModifiedFrom ?? null,
    lastModifiedTo: draft.lastModifiedTo ?? null,
  };

  const isLast7Selected = isRangeSelected(7, undefined, lastModifiedRange);
  const isLast30Selected = isRangeSelected(30, undefined, lastModifiedRange);
  const isLast6MonthsSelected = isRangeSelected(undefined, 6, lastModifiedRange);

  const durationOpts: Array<{ label: string; value: DurationBucket | null }> = [
    { label: "All", value: null },
    { label: "0 - 3 min", value: "0-3" },
    { label: "5 - 10 min", value: "5-10" },
    { label: "10+ min", value: "10+" },
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[520px] w-[92%] rounded-xl p-6 gap-5 bg-white">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-left">Filters</DialogTitle>
          <DialogDescription className="font-normal">
            Apply filters to narrow down playlists.
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

        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Duration</div>
          <div className="flex flex-wrap gap-2">
            {durationOpts.map((opt) => (
              <span
                key={String(opt.value)}
                className={`${chipBase} ${(draft.durationBucket ?? null) === opt.value ? chipActive : ""}`}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    durationBucket: opt.value,
                  }))
                }
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>


        <div className="flex gap-3 mt-5">
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
