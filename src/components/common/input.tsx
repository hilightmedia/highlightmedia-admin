"use client";

import React from "react";
import { cn } from "@/src/lib/util";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-black/80",
          "placeholder:text-black/30",
          "focus:outline-none focus:ring-2 focus:ring-[#EA6535]/30 focus:border-[#EA6535]/40",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
