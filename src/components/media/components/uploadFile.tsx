import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import axiosInstance from "@/src/helpers/axios";
import Button from "../../common/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../common/dialog";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { formatBytes } from "@/src/lib/util";

type UploadItemStatus = "queued" | "uploading" | "done" | "error" | "canceled";

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: UploadItemStatus;
  error?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  folderId: number;
  maxFiles?: number;
  onUploaded?: (uploadedMedia: any[]) => void;
};

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "application/pdf",
]);

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;



const getVideoDuration = (file: File): Promise<number | null> =>
  new Promise((resolve) => {
    if (!file.type.startsWith("video/")) return resolve(null);
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const d = Number(video.duration);
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) && d >= 0 ? Math.round(d) : null);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    video.src = url;
  });

export default function UploadFile({
  open,
  onClose,
  folderId,
  maxFiles = 10,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setItems([]);
      setIsDragging(false);
      abortRef.current?.abort();
      abortRef.current = null;
    }
  }, [open]);

  const { mutateAsync: uploadFileMutation, isPending: isUploading } = useMutation({
    mutationFn: async ({ item }: { item: UploadItem }) => {
      const controller = new AbortController();
      abortRef.current = controller;

      const duration = await getVideoDuration(item.file);

      const form = new FormData();
      form.append("file", item.file, item.file.name);
      form.append("size", String(item.file.size));
      if (duration != null) form.append("duration", String(duration));
      form.append("type", item.file.type);

      const res = await axiosInstance.post(`/media/${folderId}/upload-media`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        onUploadProgress: (evt) => {
          const total = evt.total ?? item.file.size ?? 0;
          const loaded = evt.loaded ?? 0;
          const pct = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;

          setItems((prev) =>
            prev.map((x) => (x.id === item.id ? { ...x, progress: pct } : x))
          );
        },
      });

      return res.data;
    },
    onSettled: () => {
      abortRef.current = null;
    },
  });

  const canUpload = useMemo(
    () => items.length > 0 && !isUploading,
    [items.length, isUploading]
  );

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);

    const valid = arr.filter((f) => ALLOWED_MIME.has(f.type));
    const invalid = arr.filter((f) => !ALLOWED_MIME.has(f.type));

    if (invalid.length) {
      alert(
        `Some files were skipped (only image/video/pdf allowed):\n${invalid
          .map((f) => f.name)
          .join(", ")}`
      );
    }

    setItems((prev) => {
      const remaining = maxFiles - prev.length;
      const take = valid.slice(0, Math.max(0, remaining));

      if (valid.length > remaining) {
        alert(`Maximum ${maxFiles} files allowed. Extra files were skipped.`);
      }

      return [
        ...prev,
        ...take.map((file) => ({
          id: uid(),
          file,
          progress: 0,
          status: "queued" as const,
        })),
      ];
    });
  };

  const removeItem = (id: string) => {
    if (isUploading) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
    abortRef.current = null;

    setItems((prev) =>
      prev.map((x) =>
        x.status === "uploading" ? { ...x, status: "canceled", error: "Canceled" } : x
      )
    );
  };

  const handleUpload = async () => {
    if (!canUpload) return;

    const uploadedAll: any[] = [];

    for (const item of items) {
      if (item.status === "done") continue;

      setItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, status: "uploading", error: undefined } : x))
      );

      try {
        const data = await uploadFileMutation({ item });

        if (data?.media) uploadedAll.push(data.media);

        setItems((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, status: "done", progress: 100 } : x))
        );
      } catch (err: any) {
        const canceled =
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.message?.toLowerCase?.().includes("canceled");

        setItems((prev) =>
          prev.map((x) =>
            x.id === item.id
              ? {
                  ...x,
                  status: canceled ? "canceled" : "error",
                  error: canceled ? "Canceled" : (err?.response?.data?.message ?? "Upload failed"),
                }
              : x
          )
        );

        if (canceled) break;
      }
    }

    const anyDone = uploadedAll.length > 0 || items.some((x) => x.status === "done");
    if (anyDone) {
      onUploaded?.(uploadedAll);
      setSuccessOpen(true);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
        <DialogContent className="max-w-[650px] w-[92%] min-w-0 rounded-xl p-0 bg-white overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-left text-base">Upload new media</DialogTitle>
              <DialogDescription className="text-sm font-normal">
                Drag & drop files here, or choose files to upload.
              </DialogDescription>
            </div>

            <button type="button" onClick={onClose} className="p-1 shrink-0">
              <X />
            </button>
          </div>

          <div className="p-5 space-y-4 flex flex-col w-full min-w-0">
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={onDrop}
              className={[
                "w-full min-w-0 rounded-xl border border-dashed p-6 text-center",
                isDragging ? "border-primary bg-orange-50" : "border-gray-200",
              ].join(" ")}
            >
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="text-gray-500" />
                <div className="text-sm text-gray-700">
                  Drag & Drop or{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => inputRef.current?.click()}
                  >
                    choose file
                  </button>{" "}
                  to upload
                </div>
                <div className="text-xs text-gray-500">Select image, pdf or mp4</div>
              </div>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
            </div>

            {items.length > 0 ? (
              <div className="space-y-3 flex flex-col w-full min-w-0">
                {items.map((it) => (
                  <div key={it.id} className="border rounded-xl p-3 w-full min-w-0">
                    <div className="flex items-start justify-between gap-3 w-full min-w-0">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div
                          className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                          title={it.file.name}
                        >
                          {it.file.name}
                        </div>

                        <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
                          <span>{formatBytes(it.file.size)}</span>
                          <span className="capitalize">
                            {it.status === "queued" ? "ready" : it.status}
                          </span>
                          {it.status === "error" && it.error ? (
                            <span className="text-red-600">{it.error}</span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 text-gray-500 hover:text-gray-700"
                        onClick={() => removeItem(it.id)}
                        disabled={isUploading}
                        title={isUploading ? "Can't remove while uploading" : "Remove"}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${it.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="p-5 border-t flex items-center justify-end gap-3">
            <Button
              type="button"
              className="bg-transparent text-gray-700"
              onClick={() => (isUploading ? cancelUpload() : onClose())}
            >
              {isUploading ? "Cancel Upload" : "Cancel"}
            </Button>

            <Button
              type="button"
              className="rounded-lg"
              onClick={handleUpload}
              disabled={!canUpload}
              loading={isUploading}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={(next) => !next && setSuccessOpen(false)}>
        <DialogContent className="max-w-[420px] w-[92%] min-w-0 rounded-xl p-6 bg-white">
          <div className="flex flex-col items-center text-center gap-3">
            <Image src="/success.svg" alt="" width={250} height={200} className="w-[250px]" />

            <div className="text-base font-semibold">Uploaded Successfully</div>

            <Button
              type="button"
              className="w-full rounded-lg mt-2"
              onClick={() => {
                setSuccessOpen(false);
                onClose();
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
