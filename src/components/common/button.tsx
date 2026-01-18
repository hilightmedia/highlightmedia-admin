"use client";

import React from "react";
import { cn } from "@/src/lib/util";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({
  className,
  loading,
  disabled,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
        "border border-black/10 bg-primary text-white",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
          <span>Loading</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
