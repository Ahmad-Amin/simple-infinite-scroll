import { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios'
import { debounce } from "lodash";

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
  dependency: any;
  searchQuery?: string;
  debounceDelay?: number;  // New optional parameter for debounce timing
}

export function useInfiniteScroll<T>({
  url,
  limit = 10,
  initialData = [],
  dependency,
  searchQuery,
  debounceDelay = 500,  // Default set here, customizable via props
}: UseInfiniteScrollProps<T>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<string | null>(null);  // New state for error handling
  const listRef = useRef<HTMLDivElement | null>(null);

  const debouncedFetchData = useRef(
    debounce(async (query: string, url: string) => {
      if (loading) return;
      try {
        setLoading(true);
        const response = await axios.get<PaginationResponse<T>>(
          `${url}?page=${page}&limit=${limit}&search=${query}`
        );
        if (response.status === 200) {
          if (page === 1) {
            setData(response.data.results);
          } else {
            setData((prevData) => [...prevData, ...response.data.results]);
          }
          setTotalPages(response.data.pagination.totalPages);
        } else {
          console.error("Fetch error:", response);
          setError("Failed to fetch data.");  // Setting error state
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch data.");  // Setting error state
      } finally {
        setLoading(false);
      }
    }, debounceDelay)
  );

  const fetchData = useCallback(
    (query?: string, url?: string) => {
      if (!query) query = searchQuery;
      debouncedFetchData.current(query as string, url as string);
    },
    [searchQuery, debouncedFetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, dependency, page]);  // Ensure 'page' is a dependency

  const handleScroll = useCallback(() => {
    if (loading || page >= totalPages) return;

    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop <= clientHeight * 1.1) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, page, totalPages]);

  return { listRef, data, loading, error, handleScroll, fetchData };
}