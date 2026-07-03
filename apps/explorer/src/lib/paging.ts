// Cursor pagination over the SDK's connection-style pages.
//
// Forward direction maps to (after, first): continue with endCursor while
// hasNextPage. Backward direction maps to (before, last): the page holds the
// *last* N items in ascending order, so for newest-first UIs we reverse rows
// and continue with startCursor while hasPreviousPage.

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PageInfo } from "@iota/sdk-wasm";
import { pageBack, pageFwd } from "./sdk";

/** The GraphQL server rejects larger pages — and the wasm client panics
 *  (traps with `unreachable`) instead of erroring when asked for more. */
export const MAX_PAGE_SIZE = 50;

/** Drain a connection completely in MAX_PAGE_SIZE chunks (hard-capped). */
export async function collectAllPages<T>(
  fetcher: (pagination: ReturnType<typeof pageFwd>) => Promise<{ pageInfo: PageInfo; data: Array<T> }>,
  cap = 500,
): Promise<T[]> {
  const out: T[] = [];
  let cursor: string | undefined;
  for (;;) {
    const page = await fetcher(pageFwd(MAX_PAGE_SIZE, cursor));
    out.push(...page.data);
    if (!page.pageInfo.hasNextPage || page.pageInfo.endCursor == null || out.length >= cap) break;
    cursor = page.pageInfo.endCursor;
  }
  return out;
}

export interface PageShape<T> {
  pageInfo: PageInfo;
  data: Array<T>;
}

export function usePagedList<T>(opts: {
  queryKey: unknown[];
  limit?: number;
  newestFirst?: boolean;
  enabled?: boolean;
  refetchInterval?: number | false;
  fetcher: (pagination: ReturnType<typeof pageFwd>) => Promise<PageShape<T>>;
}) {
  const { queryKey, limit = 25, newestFirst = false, fetcher, enabled, refetchInterval } = opts;
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);

  const q = useQuery({
    queryKey: [...queryKey, limit, cursor ?? null],
    enabled,
    refetchInterval: page === 0 ? refetchInterval : false,
    queryFn: async () => {
      const pagination = newestFirst ? pageBack(limit, cursor) : pageFwd(limit, cursor);
      const res = await fetcher(pagination);
      const rows = newestFirst ? [...res.data].reverse() : res.data;
      const hasMore = newestFirst ? res.pageInfo.hasPreviousPage : res.pageInfo.hasNextPage;
      const nextCursor = newestFirst ? res.pageInfo.startCursor : res.pageInfo.endCursor;
      return { rows, hasMore, nextCursor: nextCursor ?? undefined };
    },
  });

  return {
    ...q,
    rows: q.data?.rows ?? [],
    hasMore: q.data?.hasMore ?? false,
    page,
    next: () => {
      if (q.data?.nextCursor) {
        setCursor(q.data.nextCursor);
        setPage((p) => p + 1);
      }
    },
    reset: () => {
      setCursor(undefined);
      setPage(0);
    },
  };
}
