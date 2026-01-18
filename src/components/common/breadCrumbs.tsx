"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/util";

type Crumb = {
  label: React.ReactNode;
  href?: string;
};

type Props = {
  items: Crumb[];
  homeHref?: string;
  homeLabel?: React.ReactNode;
  className?: string;
};

export default function Breadcrumbs({
  items,
  homeHref = "/",
  homeLabel = "Home",
  className = "",
}: Props) {
  const all: Crumb[] = [{ label: homeLabel, href: homeHref }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm text-black/60", className)}
    >
      {all.map((item, idx) => {
        const isLast = idx === all.length - 1;

        return (
          <div key={idx} className="flex items-center gap-2">
            {idx !== 0 && <ChevronRight className="h-4 w-4 text-black/30" />}

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:underline text-black/60"
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span className={cn(isLast ? "text-black font-medium" : "")}>
                <span className="inline-flex items-center gap-2">
                  {item.label}
                </span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
