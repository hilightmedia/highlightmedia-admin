"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type MenuPosition = {
  top: number;
  left: number;
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
  const [mounted, setMounted] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });

  const open = typeof visible === "boolean" ? visible : internalOpen;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (typeof visible !== "boolean") setInternalOpen(next);
      onOpenChange?.(next);
    },
    [visible, onOpenChange]
  );

  const triggerIcon = useMemo(() => icon ?? <MoreVertical size={18} />, [icon]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!open) return;

    const triggerEl = buttonRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const menuWidth = menuEl?.offsetWidth ?? 160;
    const menuHeight = menuEl?.offsetHeight ?? 120;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let nextDropUp = false;

    if (autoPlacement) {
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      nextDropUp = spaceBelow < menuHeight + offsetPx && spaceAbove > spaceBelow;
    }

    let top = nextDropUp
      ? triggerRect.top - menuHeight - offsetPx
      : triggerRect.bottom + offsetPx;

    let left = triggerRect.right - menuWidth;

    if (left < 8) left = 8;
    if (left + menuWidth > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - menuWidth - 8);
    }

    if (top < 8) top = 8;
    if (top + menuHeight > viewportHeight - 8) {
      top = Math.max(8, viewportHeight - menuHeight - 8);
    }

    setDropUp(nextDropUp);
    setPosition({ top, left });
  }, [open, autoPlacement, offsetPx]);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = rootRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);

      if (!insideTrigger && !insideMenu) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(updatePosition);
    const scrollTarget =
      containerRef?.current ??
      (document.scrollingElement as HTMLElement | null) ??
      window;

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    if (scrollTarget && scrollTarget !== window) {
      (scrollTarget as EventTarget).addEventListener("scroll", onScroll, {
        passive: true,
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      if (scrollTarget && scrollTarget !== window) {
        (scrollTarget as EventTarget).removeEventListener("scroll", onScroll);
      }
    };
  }, [open, updatePosition, containerRef]);

  const handleSelect = (opt: ThreeDotMenuOption) => {
    if (opt.disabled) return;
    opt.onClick?.();
    if (closeOnSelect) setOpen(false);
  };

  return (
    <>
      <div ref={rootRef} className={cn("inline-flex", triggerClassName)}>
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            const next = !open;
            setOpen(next);
            if (!open) requestAnimationFrame(updatePosition);
          }}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-1 text-[#667085] hover:bg-black/5 focus:outline-none",
            iconClassName
          )}
        >
          {triggerIcon}
        </button>
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={cn(
              "fixed z-[9999] min-w-[160px] overflow-hidden rounded-md border border-black/10 bg-white shadow-lg",
              menuClassName
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
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
                    opt.disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "",
                    opt.className
                  )}
                >
                  {opt.icon ? <span className="inline-flex">{opt.icon}</span> : null}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}