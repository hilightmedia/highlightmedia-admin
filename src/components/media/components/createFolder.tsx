"use client";

import { FilePen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/src/helpers/axios";
import { Folders } from "@/types/types";
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
import DateRangePickerModal from "../../common/dateRangePicker";


type Props = {
  open: boolean;
  onClose: () => void;
  folder?: Folders | null;
};

interface FormData {
  name: string;
  start_date?: string | null;
  end_date?: string | null;
}

type PickerValue = Date | [Date, Date] | null;

export default function CreateFolder({ open, onClose, folder }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    start_date: null,
    end_date: null,
  });

  const [expirable, setExpirable] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const queryClient = useQueryClient();
  const [activeFolder, setActiveFolder] = useState<Folders | null>(null);

  useEffect(() => {
    if (open) setActiveFolder(folder ?? null);
  }, [open, folder]);

  const isEdit = Boolean(activeFolder?.id);

  const onSuccess = () => {
    if (isEdit) {
      queryClient.setQueryData(["folders"], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map((f) => {
          if (f.id === activeFolder?.id) {
            return {
              ...f,
              name: formData.name,
              start_date: formData.start_date,
              end_date: formData.end_date,
            };
          }
          return f;
        });
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    }
    onClose();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post(
        isEdit ? "/media/edit-folder" : "/media/folders/create",
        expirable
          ? {
              name: formData.name,
              folderId: activeFolder?.id,
              start_date: formData.start_date?.split("T")[0],
              end_date: formData.end_date?.split("T")[0],
            }
          : { name: formData.name, folderId: activeFolder?.id }
      ),
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter a name");
      return;
    }
    if (expirable) {
      if (!formData.start_date || !formData.end_date) {
        alert("Please enter a start date and end date");
        return;
      }
    }
    mutate();
  };

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: folder?.name ?? "",
      start_date: folder?.start_date ?? null,
      end_date: folder?.end_date ?? null,
    });

    const hasDates = Boolean(folder?.start_date && folder?.end_date);
    setExpirable(hasDates);
    setDateOpen(false);
  }, [open]);

  const initialPickerValue: PickerValue = useMemo(() => {
    if (!formData.start_date && !formData.end_date) return null;

    const s = formData.start_date ? new Date(formData.start_date) : null;
    const e = formData.end_date ? new Date(formData.end_date) : null;

    if (s && e) return [s, e];
    if (s) return s;
    if (e) return e;
    return null;
  }, [formData.start_date, formData.end_date]);

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
        if (a <= b) {
          start = a;
          end = b;
        } else {
          start = b;
          end = a;
        }
      }
    }

    if (!start || !end) {
      setDateOpen(false);
      return;
    }

    const startIso = new Date(start);
    startIso.setHours(0, 0, 0, 0);

    const endIso = new Date(end);
    endIso.setHours(0, 0, 0, 0);

    setFormData((p) => ({
      ...p,
      start_date: startIso.toISOString(),
      end_date: endIso.toISOString(),
    }));

    setDateOpen(false);
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
              {isEdit ? "Edit Folder" : "Create Folder"}
              <DialogDescription className="mt-2 font-normal">
                {isEdit ? "Edit your folder" : "Create a new folder"}
              </DialogDescription>
            </DialogTitle>

            <button onClick={onClose} className="absolute top-5 right-5">
              <X />
            </button>
          </DialogHeader>

          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <div className="inline-flex flex-col gap-2">
              <label className="font-medium text-sm">Folder Name</label>
              <Input
                type="name"
                placeholder="Enter your folder name"
                className="w-full"
                value={formData?.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Validity</label>

              <Input
                type="radio"
                className="hidden"
                checked={expirable}
                onChange={(e) => setExpirable(e.target.checked)}
              />

              <div className="flex gap-5">
                <span
                  className={`border ${
                    !expirable ? "border-primary" : ""
                  } cursor-pointer border-gray-300 rounded-lg text-sm px-4 py-2`}
                  onClick={() => {
                    setExpirable(false);
                    setFormData((p) => ({ ...p, start_date: null, end_date: null }));
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
              <p>{(expirable && formData?.start_date && formData?.end_date) ? `From ${new Date(formData.start_date).toLocaleDateString()} to ${new Date(formData.end_date).toLocaleDateString()}` : ""}</p>
            </div>

            <div className="flex gap-3">
              <Input
                type="radio"
                className="hidden"
                checked={expirable}
                onChange={(e) => setExpirable(e.target.checked)}
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
                {isEdit ? "Edit Folder" : "Create Folder"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
