"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/util";
import { SelectOption } from "@/types/types";

type Props = {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
};

export default function Select({
  options,
  value,
  onChange,
  className = "",
  containerClassName = "",
  iconClassName = "",
  disabled,
}: Props) {
  return (
    <div className={cn("relative flex w-full", containerClassName)}>
      <select
        disabled={disabled}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-black/10 bg-white",
          "text-sm text-black/70",
          "px-4 pr-10 text-left",
          "focus:outline-none focus:ring-0",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
      >


        {options.map((opt, idx) => (
          <option key={idx} value={String(opt.value)} disabled={opt.disabled}>
            {String(opt.label)}
          </option>
        ))}
      </select>

      <span
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40",
          iconClassName
        )}
      >
        <ChevronDown className="h-4 w-4" />
      </span>
    </div>
  );
}
