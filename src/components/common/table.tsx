"use client";

import React from "react";
import { isEmpty } from "lodash";
import { cn } from "@/src/lib/util";

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

  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
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
  onRowClick,

  tableOverflow = "x",
  maxHeight = "h-[500px]",
  tableRef,
  containerRef,
  getRowProps,
}: Props<T>) {
  if (isEmpty(data)) {
    return (
      <div className="flex flex-col justify-center items-center p-6 gap-4 w-full h-[400px] text-black/40">
        <p className="text-center">
          {emptyMessage || "No data found."}
        </p>
      </div>
    );
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
