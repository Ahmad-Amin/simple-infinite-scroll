/// <reference types="react" />
interface UseInfiniteScrollProps<T> {
    url: string;
    limit?: number;
    initialData?: T[];
    dependency: any;
    searchQuery?: string;
    debounceDelay?: number;
    authToken?: string;
    headers?: Record<string, string>;
}
export declare function useInfiniteScroll<T>({ url, limit, initialData, dependency, searchQuery, debounceDelay, authToken, headers, }: UseInfiniteScrollProps<T>): {
    listRef: import("react").MutableRefObject<HTMLDivElement | null>;
    data: T[];
    loading: boolean;
    error: string | null;
    handleScroll: () => void;
    fetchData: (query?: string, url?: string) => void;
};
export {};
