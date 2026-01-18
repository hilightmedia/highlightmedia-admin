"use client";

import React from "react";
import { cn } from "@/src/lib/util";

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: number;
  ringInsetPct?: number; // optional: control inner ring thickness
};

export default function GradientIconContainer({
  children,
  className = "",
  size = 56,
  ringInsetPct = 10,
}: Props) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-[#FFE0D4]" />

      <div
        className="absolute rounded-full bg-orange-gradient"
        style={{ inset: `${ringInsetPct}%` }}
      />
      <div className="relative z-10 flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
}
