"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/src/lib/util";

export type ThreeDotMenuOption = {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export type ThreeDotMenuProps = {
  options: ThreeDotMenuOption[];
  visible?: boolean;
  onOpenChange?: (open: boolean) => void;

  icon?: React.ReactNode;

  triggerClassName?: string;
  iconClassName?: string;
  menuClassName?: string;

  closeOnSelect?: boolean;

  containerRef?: React.RefObject<HTMLElement | null>;
  autoPlacement?: boolean;
  offsetPx?: number;
};

export default function ThreeDotMenu({
  options,
  visible,
  onOpenChange,
  icon,
  triggerClassName = "",
  iconClassName = "",
  menuClassName = "",
  closeOnSelect = true,
  containerRef,
  autoPlacement = true,
  offsetPx = 6,
}: ThreeDotMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof visible === "boolean" ? visible : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (typeof visible !== "boolean") setInternalOpen(next);
      onOpenChange?.(next);
    },
    [visible, onOpenChange]
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [dropUp, setDropUp] = useState(false);

  const triggerIcon = useMemo(() => icon ?? <MoreVertical size={18} />, [icon]);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  const computePlacement = useCallback(() => {
    if (!open || !autoPlacement) return;

    const triggerEl = rootRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl) return;

    const container =
      containerRef?.current ??
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement;

    const triggerRect = triggerEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const menuHeight = (menuEl?.offsetHeight ?? 120) + offsetPx;
    const spaceBelow = containerRect.bottom - triggerRect.bottom;
    const spaceAbove = triggerRect.top - containerRect.top;

    setDropUp(spaceBelow < menuHeight && spaceAbove > spaceBelow);
  }, [open, autoPlacement, containerRef, offsetPx]);

  useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(computePlacement);

    const scrollTarget =
      containerRef?.current ??
      (document.scrollingElement as HTMLElement | null) ??
      window;

    const onScroll = () => computePlacement();
    const onResize = () => computePlacement();

    window.addEventListener("resize", onResize);
    (scrollTarget as any).addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      (scrollTarget as any).removeEventListener("scroll", onScroll);
    };
  }, [open, computePlacement, containerRef]);

  const handleSelect = (opt: ThreeDotMenuOption) => {
    if (opt.disabled) return;
    opt.onClick?.();
    if (closeOnSelect) setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative inline-flex", triggerClassName)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-1 text-[#667085] hover:bg-black/5 focus:outline-none",
          iconClassName
        )}
      >
        {triggerIcon}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            "absolute right-0 z-50 min-w-[160px] overflow-hidden rounded-md border border-black/10 bg-white shadow-lg",
            dropUp ? "bottom-full" : "top-full",
            menuClassName
          )}
          style={dropUp ? { marginBottom: offsetPx } : { marginTop: offsetPx }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                role="menuitem"
                disabled={opt.disabled}
                onClick={() => handleSelect(opt)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-black hover:bg-black/5",
                  opt.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                  opt.className
                )}
              >
                {opt.icon ? <span className="inline-flex">{opt.icon}</span> : null}
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
