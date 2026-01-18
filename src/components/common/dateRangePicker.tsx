"use client";

import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/src/lib/util";
import { Dialog, DialogContent } from "@/src/components/common/dialog";

type Mode = "date" | "range";
type Value = Date | [Date, Date] | null;

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (value: Value) => void;

  title?: string;
  initialMode?: Mode;
  initialValue?: Value;

  className?: string;

  disablePastDates?: boolean;
  minDate?: Date;
};

export default function DateRangePickerModal({
  open,
  onClose,
  onApply,
  title = "Select Date/Range",
  initialMode = "date",
  initialValue = null,
  className = "",
  disablePastDates = false,
  minDate,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [value, setValue] = useState<Value>(initialValue);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setValue(initialValue);
  }, [open, initialMode, initialValue]);

  const effectiveMinDate = useMemo(() => {
    if (minDate) return minDate;
    if (!disablePastDates) return undefined;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [disablePastDates, minDate]);

  const canApply = useMemo(() => {
    if (!value) return false;

    if (mode === "date") {
      if (!(value instanceof Date)) return false;
      if (!effectiveMinDate) return true;
      return value >= effectiveMinDate;
    }

    if (!Array.isArray(value)) return false;
    const [start, end] = value;
    if (!(start instanceof Date) || !(end instanceof Date)) return false;
    if (!effectiveMinDate) return true;
    return start >= effectiveMinDate && end >= effectiveMinDate;
  }, [value, mode, effectiveMinDate]);

  return (
    <Dialog open={open} >
      <DialogContent
        className={cn("w-[360px] max-w-[92vw] p-6 gap-3", className)}
      >
        <div className="text-center text-sm font-semibold text-black/90">
          {title}
        </div>

        <div className="mt-1 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => {
              setMode("date");
              if (Array.isArray(value)) setValue(value[0] ?? null);
            }}
            className={cn(
              "rounded-full px-4 py-1 text-xs",
              mode === "date"
                ? "bg-[#e86b3c] text-white"
                : "text-black/50 hover:bg-black/5",
            )}
          >
            Select Date
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("range");
              if (value instanceof Date) setValue([value, value]);
            }}
            className={cn(
              "rounded-full px-4 py-1 text-xs",
              mode === "range"
                ? "bg-[#e86b3c] text-white"
                : "text-black/50 hover:bg-black/5",
            )}
          >
            Custom Range
          </button>
        </div>

        <Calendar
          className="ui-calendar"
          value={value as any}
          onChange={(v) => setValue(v as any)}
          selectRange={mode === "range"}
          minDate={effectiveMinDate}
          tileDisabled={({ date, view }) => {
            if (!effectiveMinDate) return false;
            if (view !== "month") return false;
            return date < effectiveMinDate;
          }}
          prev2Label={null}
          next2Label={null}
          prevLabel={<ChevronLeft className="h-4 w-4 text-black/60" />}
          nextLabel={<ChevronRight className="h-4 w-4 text-black/60" />}
          formatShortWeekday={(_l, d) =>
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()]
          }
        />

        <div className="mt-1 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md bg-[#EEF2F7] text-sm font-medium text-black/70"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canApply}
            onClick={() => onApply(value)}
            className={cn(
              "h-9 rounded-md text-sm font-medium text-white inline-flex items-center justify-center gap-2",
              canApply ? "bg-[#e86b3c]" : "bg-[#e86b3c]/60 cursor-not-allowed",
            )}
          >
            <Check className="h-4 w-4" />
            Set date
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
