import { useState } from "react";
import { JevListFilterContext } from "./useJevListFilters";
import type { ReactNode } from "react";
import type { JevListSearch } from "./useJevListFilters";

const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = new Date().getMonth() + 1;
const DEFAULT_PAGE_SIZE = 25;

// Mounted as the `jev` route element, so it stays alive while the user moves
// between the list and the create/edit/view pages. That's what lets List
// unmount and remount without losing which year/month/page was on screen.
export const JevListFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState<JevListSearch | null>(null);

  return (
    <JevListFilterContext.Provider
      value={{
        year,
        month,
        page,
        pageSize,
        search,
        setYear,
        setMonth,
        setPage,
        setPageSize,
        setSearch,
      }}
    >
      {children}
    </JevListFilterContext.Provider>
  );
};
