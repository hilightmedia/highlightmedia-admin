"use client";

import { FilePen, X } from "lucide-react";
import { useMemo, useState } from "react";
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
import DateRangePickerModal from "../../common/dateRangePicker";

type PickerValue = Date | [Date, Date] | null;

type Props = {
  open: boolean;
  onClose: () => void;
  folderIds: number[];
  onDone?: () => void; // optional: clear selection, reset bulk action, etc.
};

export default function BulkEditFolderValidity({
  open,
  onClose,
  folderIds,
  onDone,
}: Props) {
  const queryClient = useQueryClient();

  const [expirable, setExpirable] = useState(true);
  const [dateOpen, setDateOpen] = useState(false);

  // store in ISO for easy Date usage; send YYYY-MM-DD to API
  const [startIso, setStartIso] = useState<string | null>(null);
  const [endIso, setEndIso] = useState<string | null>(null);

  const initialPickerValue: PickerValue = useMemo(() => {
    if (!startIso && !endIso) return null;
    const s = startIso ? new Date(startIso) : null;
    const e = endIso ? new Date(endIso) : null;
    if (s && e) return [s, e];
    if (s) return s;
    if (e) return e;
    return null;
  }, [startIso, endIso]);

  const handleApplyDates = (val: PickerValue) => {
    if (!val) {
      setDateOpen(false);
      return;
    }

    let start: Date | null = null;
    let end: Date | null = null;

    if (val instanceof Date) {
      start = val;
      end = val;
    } else {
      const [a, b] = val;
      if (a && b) {
        start = a <= b ? a : b;
        end = a <= b ? b : a;
      }
    }

    if (!start || !end) {
      setDateOpen(false);
      return;
    }

    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    const e = new Date(end);
    e.setHours(0, 0, 0, 0);

    setStartIso(s.toISOString());
    setEndIso(e.toISOString());
    setDateOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      folderIds: number[];
      validityStart: string | null;
      validityEnd: string | null;
    }) => axiosInstance.post(`/media/bulk/update-folders`, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      onDone?.();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderIds.length) return;

    if (expirable) {
      if (!startIso || !endIso) {
        alert("Please select start and end date");
        return;
      }
      mutate({
        folderIds,
        validityStart: startIso.split("T")[0],
        validityEnd: endIso.split("T")[0],
      });
      return;
    }
    mutate({ folderIds, validityStart: null, validityEnd: null });
  };

  return (
    <>
      <DateRangePickerModal
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        onApply={handleApplyDates}
        disablePastDates
        initialValue={initialPickerValue}
      />

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
      >
        <DialogContent className="max-w-[500px] w-[90%] rounded-xl p-6 gap-3 bg-white">
          <DialogHeader className="flex flex-col gap-3">
            <GradientIconContainer>
              <FilePen />
            </GradientIconContainer>

            <DialogTitle className="text-left">
              Edit Validity
              <DialogDescription className="mt-2 font-normal">
                Update validity for {folderIds.length} selected folder
                {folderIds.length === 1 ? "" : "s"}
              </DialogDescription>
            </DialogTitle>

            <button onClick={onClose} className="absolute top-5 right-5">
              <X />
            </button>
          </DialogHeader>

          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Validity</label>

              <div className="flex gap-5">
                <span
                  className={`border ${
                    !expirable ? "border-primary" : ""
                  } cursor-pointer border-gray-300 rounded-lg text-sm px-4 py-2`}
                  onClick={() => {
                    setExpirable(false);
                    setStartIso(null);
                    setEndIso(null);
                  }}
                >
                  No Expiry
                </span>

                <span
                  className={`border ${
                    expirable ? "border-primary" : ""
                  } cursor-pointer border-gray-300 rounded-lg text-sm px-4 py-2`}
                  onClick={() => {
                    setExpirable(true);
                    setDateOpen(true);
                  }}
                >
                  Custom
                </span>
              </div>

              <p>
                {expirable && startIso && endIso
                  ? `From ${new Date(startIso).toLocaleDateString()} to ${new Date(
                      endIso,
                    ).toLocaleDateString()}`
                  : ""}
              </p>
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
    </>
  );
}
