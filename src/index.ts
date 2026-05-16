import { useState, useEffect, useRef, useCallback } from "react";

type PaginationResponse<T> = {
  results: T[];
  pagination: {
    totalPages: number;
  };
};

interface UseInfiniteScrollProps<T> {
  url: string;
  limit?: number;
  initialData?: T[];
  dependency?: any;
  searchQuery?: string;
  debounceDelay?: number;
  authToken?: string;
  headers?: Record<string, string>;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

export function useInfiniteScroll<T>({
  url,
  limit = 10,
  initialData = [],
  dependency,
  searchQuery = "",
  debounceDelay = 500,
  authToken,
  headers = {},
}: UseInfiniteScrollProps<T>) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  // Always-fresh fetch implementation; called through the stable debounced wrapper
  const fetchImplRef = useRef<(query: string, fetchUrl: string, currentPage: number) => Promise<void>>();
  fetchImplRef.current = async (query: string, fetchUrl: string, currentPage: number) => {
    if (loadingRef.current) return;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(
        `${fetchUrl}?page=${currentPage}&limit=${limit}&search=${query}`,
        { headers: requestHeaders }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json: PaginationResponse<T> = await response.json();
      setData((prev) =>
        currentPage === 1 ? json.results : [...prev, ...json.results]
      );
      setTotalPages(json.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  // Stable debounced trigger — never recreated so debounce state is preserved across renders
  const debouncedFetch = useRef(
    debounce((query: string, fetchUrl: string, currentPage: number) => {
      fetchImplRef.current?.(query, fetchUrl, currentPage);
    }, debounceDelay)
  );

  // Cancel any pending debounced call on unmount
  useEffect(() => {
    const d = debouncedFetch.current;
    return () => d.cancel();
  }, []);

  const fetchData = useCallback(
    (query?: string, fetchUrl?: string) => {
      debouncedFetch.current(
        query ?? searchQuery,
        fetchUrl ?? url,
        pageRef.current
      );
    },
    [searchQuery, url]
  );

  // Reset and re-fetch from page 1 when the data source changes
  useEffect(() => {
    pageRef.current = 1;
    setPage(1);
    setData([]);
    setError(null);
    debouncedFetch.current(searchQuery, url, 1);
  }, [dependency, searchQuery, url]);

  // Fetch subsequent pages as the user scrolls (page > 1 only; page 1 handled above)
  useEffect(() => {
    if (page <= 1) return;
    pageRef.current = page;
    debouncedFetch.current(searchQuery, url, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleScroll = useCallback(() => {
    if (loadingRef.current || page >= totalPages) return;
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop <= clientHeight * 1.1) {
        setPage((prev) => prev + 1);
      }
    }
  }, [page, totalPages]);

  return { listRef, data, loading, error, handleScroll, fetchData };
}
