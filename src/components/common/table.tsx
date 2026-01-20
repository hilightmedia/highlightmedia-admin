"use client";

import React from "react";
import { isEmpty } from "lodash";
import { cn } from "@/src/lib/util";
import Image from "next/image";

type TableOverflow = "x" | "y" | "both" | "none";

export type TableColumn<T> = {
  header: React.ReactNode;
  key: string;
  render: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  rowKey?: (item: T, index: number) => string | number;
  rowClassName?: string;
  stickyHeader?: boolean;

  tableWrapperClassName?: string;
  containerClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;

  // ✅ empty state is now optional (disabled by default)
  showEmpty?: boolean; // default false
  emptyMessage?: string;

  onRowClick?: (item: T, index: number) => void;

  // ✅ new
  loading?: boolean;
  error?: boolean; // if true, show error mockup (no message)
  onRetry?: () => void;
  retryLabel?: string;

  // mockup images (put in /public)
  loadingImgSrc?: string;
  errorImgSrc?: string;
  emptyImgSrc?: string;

  // optional titles (no error message allowed)
  loadingTitle?: string;
  emptyTitle?: string;
  errorTitle?: string;
};

type Props<T> = TableProps<T> & {
  tableOverflow?: TableOverflow;
  maxHeight?: string;

  tableRef?: React.RefObject<HTMLTableElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;

  getRowProps?: (
    item: T,
    index: number
  ) => React.HTMLAttributes<HTMLTableRowElement>;
};

function StateCard({
  imgSrc,
  title,
  subtitle,
  children,
}: {
  imgSrc: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4 w-full h-[400px] text-black/60">
      <div className="relative w-[220px] h-[160px]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-1 max-w-[520px]">
        <p className="text-base font-medium text-black/70">{title}</p>
        {subtitle ? (
          <p className="text-sm text-center text-black/40">{subtitle}</p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

export default function Table<T>({
  data,
  columns,
  rowKey,
  rowClassName,
  stickyHeader = true,
  tableWrapperClassName = "",
  containerClassName = "",
  tableClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  emptyMessage = "",

  // ✅ new
  showEmpty = false,
  loading = false,
  error = false,
  onRetry,
  retryLabel = "Retry",

  loadingImgSrc = "/mockups/loading.png",
  errorImgSrc = "/mockups/error.png",
  emptyImgSrc = "/mockups/empty.png",

  loadingTitle = "Loading",
  emptyTitle = "No data found",
  errorTitle = "Something went wrong",

  onRowClick,
  tableOverflow = "x",
  maxHeight = "h-[500px]",
  tableRef,
  containerRef,
  getRowProps,
}: Props<T>) {
  // ✅ Loading state
  if (loading) {
    return (
      <StateCard
        imgSrc={loadingImgSrc}
        title={loadingTitle}
        subtitle="Please wait…"
      />
    );
  }

  // ✅ Error state (NO message)
  if (error) {
    return (
      <StateCard imgSrc={errorImgSrc} title={errorTitle}>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 px-4 py-2 rounded-lg border border-primary text-primary bg-white"
          >
            {retryLabel}
          </button>
        ) : null}
      </StateCard>
    );
  }

  // ✅ Empty state (optional)
  if (showEmpty && isEmpty(data)) {
    return (
      <StateCard
        imgSrc={emptyImgSrc}
        title={emptyTitle}
        subtitle={emptyMessage || undefined}
      />
    );
  }

  // If empty state is disabled, render an empty container (or you can return null)
  if (isEmpty(data)) {
    return null;
  }

  const overflowClass =
    tableOverflow === "x"
      ? "overflow-x-auto overflow-y-hidden"
      : tableOverflow === "y"
      ? "overflow-y-auto overflow-x-hidden"
      : tableOverflow === "both"
      ? "overflow-auto"
      : "overflow-hidden";

  return (
    <div className={cn("w-full", containerClassName)}>
      <div
        ref={containerRef}
        className={cn(
          "border border-black/10 rounded-xl overflow-hidden",
          maxHeight,
          overflowClass,
          tableWrapperClassName
        )}
      >
        <table
          ref={tableRef}
          className={cn("min-w-full divide-y divide-black/10", tableClassName)}
        >
          <thead
            className={cn(
              stickyHeader && "sticky top-0 z-10",
              "border-b border-black/10 bg-white",
              theadClassName
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-black/40",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={cn("divide-y divide-black/10", tbodyClassName)}>
            {data.map((item, index) => {
              const extraRowProps = getRowProps?.(item, index) ?? {};
              const { className, ...rest } = extraRowProps;

              return (
                <tr
                  key={rowKey ? rowKey(item, index) : index}
                  className={cn(rowClassName, className)}
                  onClick={() => onRowClick?.(item, index)}
                  {...rest}
                >
                  {columns.map((col) => (
                    <td
                      key={`${col.key}-${index}`}
                      className={cn("px-4 py-3 text-sm", col.cellClassName)}
                    >
                      {col.render(item, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
