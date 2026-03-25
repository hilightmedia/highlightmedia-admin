import { useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface UseInfiniteVirtualListProps {
  count: number;
  scrollRef: React.RefObject<HTMLElement | null>;
  rowHeight: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  overscan?: number;
  threshold?: number;
}

export const useInfiniteVirtualList = ({
  count,
  scrollRef,
  rowHeight,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  overscan = 8,
  threshold = 8,
}: UseInfiniteVirtualListProps) => {
  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  useEffect(() => {
    if (!fetchNextPage) return;

    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;
    if (!hasNextPage || isFetchingNextPage) return;

    if (lastItem.index >= count - threshold) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer,
    count,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold,
  ]);

  return rowVirtualizer;
};