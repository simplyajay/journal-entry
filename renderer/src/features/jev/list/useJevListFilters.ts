import { createContext, useContext } from "react";

export type JevListSearch = {
  keyword: string;
  dateFrom: string;
  dateTo: string;
};

export type JevListFilterContextValue = {
  year: number;
  month: number;
  page: number;
  pageSize: number;
  search: JevListSearch | null;
  setYear: (value: number) => void;
  setMonth: (value: number) => void;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  setSearch: (value: JevListSearch | null) => void;
};

export const JevListFilterContext =
  createContext<JevListFilterContextValue | null>(null);

export const useJevListFilters = () => {
  const ctx = useContext(JevListFilterContext);

  if (!ctx)
    throw new Error(
      "useJevListFilters must be used inside JevListFilterProvider",
    );

  return ctx;
};
