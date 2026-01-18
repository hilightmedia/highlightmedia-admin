"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/util";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/common/dialog"; // adjust path if needed

import Button from "@/src/components/common/button"; // adjust path if needed
import GradientIconContainer from "@/src/components/common/gradientIconContainer"; // adjust path if needed

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;

  title?: React.ReactNode;
  message?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  contentClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  preventCloseWhileLoading?: boolean;
};

export default function PopupConfirm({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  disabled = false,
  icon,
  contentClassName = "",
  confirmButtonClassName = "",
  cancelButtonClassName = "",
  preventCloseWhileLoading = true,
}: Props) {
  const blockClose = preventCloseWhileLoading && loading;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !blockClose) onClose();
      }}
    >
      <DialogContent
        className={cn(
          "max-w-[500px] w-[90%] rounded-xl p-6 gap-3 bg-white",
          contentClassName
        )}
      >
        <DialogHeader className="flex flex-col gap-3">
          <GradientIconContainer>
            {icon ?? <AlertTriangle />}
          </GradientIconContainer>

          <DialogTitle className="text-left">
            {title}
            {message ? (
              <DialogDescription className="mt-2 font-normal">
                {message}
              </DialogDescription>
            ) : null}
          </DialogTitle>

          <button
            type="button"
            onClick={() => {
              if (blockClose) return;
              onClose();
            }}
            className={cn(
              "absolute top-5 right-5",
              blockClose && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Close"
          >
            <X />
          </button>
        </DialogHeader>

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            onClick={() => {
              if (blockClose) return;
              onClose();
            }}
            disabled={disabled || loading}
            className={cn(
              "w-full max-w-[400px] rounded-lg bg-white border-primary border text-black",
              cancelButtonClassName
            )}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            loading={loading}
            disabled={disabled || loading}
            className={cn(
              "w-full max-w-[400px] rounded-lg",
              confirmButtonClassName
            )}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
