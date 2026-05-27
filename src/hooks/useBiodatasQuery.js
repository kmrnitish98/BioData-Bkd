/**
 * useBiodatasQuery.js — React Query hook for the public biodata list.
 *
 * Why React Query instead of useEffect + useState?
 *  1. Automatic background refetch on tab focus (stale-while-revalidate)
 *  2. Shared cache — if two components need the same page, one request
 *  3. Built-in deduplication, retry, loading/error states
 *  4. Pagination state colocated with fetch state
 *  5. Easy to prefetch next page
 *
 * Usage:
 *   const { biodatas, total, isLoading, error, page, setPage, setSearch } =
 *     useBiodatasQuery();
 *
 * Architecture note:
 *  ExplorePage is the primary consumer. When the backend adds proper
 *  pagination support, ONLY getPublicBiodatas() needs to change —
 *  this hook and ExplorePage are already structured correctly.
 */

import { useState, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPublicBiodatas } from '../api/biodata';
import { QUERY_KEYS } from '../constants/queryKeys';
import { CACHE, PAGINATION, TIMEOUTS } from '../constants/limits';
import { useDebounce } from './useDebounce';

/**
 * @param {{ initialPage?: number, initialSearch?: string, initialFilter?: string }} options
 */
export const useBiodatasQuery = ({
  initialPage   = 1,
  initialSearch = '',
  initialFilter = 'All',
} = {}) => {
  const [page,   setPage]   = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);

  // Debounce search — don't fire a request on every keystroke
  const debouncedSearch = useDebounce(search, TIMEOUTS.SEARCH_DEBOUNCE_MS);

  // Reset to page 1 when search or filter changes
  const handleSearch = useCallback((q) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleFilter = useCallback((f) => {
    setFilter(f);
    setPage(1);
  }, []);

  const queryKey = QUERY_KEYS.biodata.public({
    page,
    search: debouncedSearch,
    filter,
  });

  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      getPublicBiodatas({
        page,
        limit:  PAGINATION.EXPLORE_PAGE_SIZE,
        search: debouncedSearch,
        filter,
        signal,
      }),
    staleTime:      CACHE.PUBLIC_BIODATAS_STALE_MS,
    gcTime:         CACHE.GC_TIME_MS,
    placeholderData: keepPreviousData,  // keeps old data visible while new page loads
    retry: 1,
  });

  return {
    // Data
    biodatas:   query.data?.data       ?? [],
    total:      query.data?.total      ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    hasMore:    query.data?.hasMore    ?? false,

    // State
    isLoading:  query.isLoading,
    isFetching: query.isFetching,   // true when refetching (page change, background)
    error:      query.error,

    // Pagination
    page,
    setPage,

    // Filters
    search,
    setSearch: handleSearch,
    filter,
    setFilter: handleFilter,
  };
};
