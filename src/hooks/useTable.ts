import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

export type SortDir = "asc" | "desc";

interface UseTableOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  initialPageSize?: number;
  initialSort?: { key: keyof T; dir: SortDir };
  filterFn?: (item: T) => boolean;
}

export function useTable<T extends Record<string, any>>({
  data,
  searchKeys,
  initialPageSize = 10,
  initialSort,
  filterFn,
}: UseTableOptions<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort ?? null);
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let result = data;
    if (filterFn) result = result.filter(filterFn);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
      );
    }
    if (sort) {
      result = [...result].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (typeof av === "number" && typeof bv === "number") {
          return sort.dir === "asc" ? av - bv : bv - av;
        }
        return sort.dir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return result;
  }, [data, debouncedSearch, searchKeys, sort, filterFn]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  function toggleSort(key: keyof T) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  return {
    search,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    sort,
    toggleSort,
    data: paginated,
    total,
    isEmpty: total === 0,
  };
}
