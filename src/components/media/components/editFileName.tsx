import { FilePen, X } from "lucide-react";
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
import { FileEdit } from "@/types/types";
import Button from "../../common/button";
import GradientIconContainer from "../../common/gradientIconContainer";
import { Input } from "../../common/input";

type Props = {
  open: boolean;
  onClose: () => void;
  file: FileEdit;
  folderId: number;
};

interface FormData {
  name: string;
  extension: string;
}

export default function EditFileName({ open, onClose, file, folderId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    extension: "",
  });

  const queryClient = useQueryClient();
  const [activefile, setActiveFile] = useState<FileEdit | null>(null);

  useEffect(() => {
    if (open) {
      setActiveFile(file ?? null);
    }
  }, [open, file]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post("/media/edit-file-name", {
        name: formData.name + "." + formData.extension,
        fileId: activefile?.id,
      }),
    // onMutate: async () => {
    //   await queryClient.cancelQueries({ queryKey: ["media", folderId] });

    //   const prev = queryClient.getQueriesData<any[]>({
    //     queryKey: ["media", folderId],
    //   });

    //   queryClient.setQueriesData<any[]>(
    //     { queryKey: ["media", folderId], exact: false },
    //     (old) =>
    //       old
    //         ? old.map((f) =>
    //             f.id === file.id
    //               ? { ...f, name: formData.name + "." + formData.extension }
    //               : f
    //           )
    //         : old
    //   );

    //   return { prev };
    // },

    // onError: (_err, _id, ctx) => {
    //   if (ctx?.prev) {
    //     for (const [key, data] of ctx.prev) {
    //       queryClient.setQueryData(key, data);
    //     }
    //   }
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", folderId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!formData.name) {
      alert("Please enter a name");
      return;
    }
    if (regex.test(formData.name) === false) {
      alert("Only letters, numbers and underscores are allowed in the name");
      return;
    }
    mutate();
  };

  useEffect(() => {
    if (!open) return;
    const fileData: string[] = file?.name.split(".") ?? ["", ""];
    setFormData({
      name: fileData[0] ?? "",
      extension: fileData[1] ?? "",
    });
  }, [open]);

  return (
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
            {" "}
            {"Edit file"}
            <DialogDescription className="mt-2 font-normal">
              {"Edit your file Name"}
            </DialogDescription>
          </DialogTitle>

          <button onClick={onClose} className="absolute top-5 right-5">
            <X />
          </button>
        </DialogHeader>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          <div className="inline-flex flex-col gap-2">
            <label className="font-medium text-sm">File Name</label>
            <Input
              type="name"
              placeholder="Enter your file name"
              className="w-full"
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              {"Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
