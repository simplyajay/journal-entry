import DataTable from "@/components/common/table/DataTable";
import SearchDialog from "./search/SearchDialog";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/contexts/useAuth";
import { journalTypeShortLabel } from "../_constants";
import { months } from "./_constants";
import { Trash2, Edit, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJevListFilters } from "./useJevListFilters";
import { Button } from "@/components/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { toDateOnly } from "./search/_schema";
import type { JournalEntryVoucherSummary } from "../form/_types";
import type { DataTableColumn } from "@/components/common/table/DataTable";
import type { JEVSearchSchemaType } from "./search/_schema";
import clsx from "clsx";

const columns: DataTableColumn<JournalEntryVoucherSummary>[] = [
  {
    label: "JEV Date",
    name: "journalEntryVoucherDate",
    render: (row) =>
      new Date(row.journalEntryVoucherDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    width: "w-[20%]",
  },
  { label: "JEV No.", name: "journalEntryVoucherNumber", width: "w-[20%]" },
  {
    label: "Journal",
    name: "journalType",
    render: (row) => journalTypeShortLabel[row.journalType],
    width: "w-[15%]",
  },
  { label: "Description", name: "description" },
];

const pageSizes = ["25", "50", "75", "100"];

const List = () => {
  const currentUser = useCurrentUser();
  const ownerId = currentUser.organizationId;
  const navigate = useNavigate();

  const {
    year,
    month,
    page: currentPage,
    pageSize,
    search,
    setYear,
    setMonth,
    setPage,
    setPageSize,
    setSearch,
  } = useJevListFilters();

  const keyword = search?.keyword;

  const [jevSummaries, setJevSummaries] = useState<
    JournalEntryVoucherSummary[]
  >([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  useEffect(() => {
    const getJevYears = async () => {
      const res = await window.api.jev.getJevYears({ ownerId });

      const available = res.success ? res.data : [];

      // newest first
      setYears(
        Array.from(new Set([new Date().getFullYear(), ...available])).sort(
          (a, b) => b - a,
        ),
      );
    };

    getJevYears();
  }, [ownerId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlF =
        (e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === "f";

      if (isCtrlF && !loading && !showSearchDialog) {
        e.preventDefault();
        setShowSearchDialog(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, showSearchDialog]);

  useEffect(() => {
    let cancelled = false;

    const getList = async () => {
      if (search) return;

      setLoading(true);

      const res = await window.api.jev.getJevSummaries({
        ownerId,
        pagination: { page: currentPage, pageSize: pageSize },
        filter: { year, month },
      });

      if (cancelled) return;

      if (res.success) {
        setError(null);
        setJevSummaries(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      } else {
        setJevSummaries([]);
        setTotalPages(0);
        setTotal(0);
        setError("Could not load journal entry vouchers.");
      }

      setLoading(false);
    };

    getList();

    return () => {
      cancelled = true;
    };
  }, [ownerId, search, currentPage, pageSize, year, month]);

  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      if (!search) return;

      setLoading(true);

      const res = await window.api.jev.searchJevSummaries({
        ownerId,
        keyword: search.keyword,
        pagination: { page: currentPage, pageSize: pageSize },
        dateRange: { from: search.dateFrom, to: search.dateTo },
      });

      if (cancelled) return;

      if (res.success) {
        setError(null);
        setJevSummaries(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      } else {
        setJevSummaries([]);
        setTotalPages(0);
        setTotal(0);
        setError("Search failed. Please try again.");
      }

      setLoading(false);
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [ownerId, search, currentPage, pageSize]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  const handleSearch = async (data: JEVSearchSchemaType) => {
    const { keyword: searchKeyword, dateFrom, dateTo } = data;

    setPage(1);
    setSearch({
      keyword: searchKeyword,
      dateFrom: toDateOnly(dateFrom),
      dateTo: toDateOnly(dateTo),
    });
  };

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = (currentPage - 1) * pageSize + jevSummaries.length;
  const hasRows = jevSummaries.length > 0;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full items-center justify-center">
        <h1 className="text-lg font-semibold text-gray-600">
          JOURNAL ENTRY VOUCHERS
        </h1>
      </div>
      {error && (
        <div className="font-manrope rounded-sm bg-red-50 p-2 text-sm text-red-500">
          {error}
        </div>
      )}
      {loading ? (
        <div className="h-full w-full bg-red-400"></div>
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col gap-2">
          {keyword ? (
            <div className="flex rounded-sm bg-gray-100 px-2 py-1 text-gray-700">
              <div className="flex flex-1 items-center">
                <p>
                  {`Showing results for `}
                  <strong className="text-gray-700">{keyword}</strong>
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPage(1);
                  setSearch(null);
                }}
              >
                <X size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 p-1 text-gray-700">
              <div className="flex items-center justify-start gap-4">
                <div className="flex w-fit items-center justify-center gap-2 self-center">
                  <span className="font-manrope text-sm font-semibold">
                    Year
                  </span>
                  <Select
                    value={String(year)}
                    onValueChange={(v) => {
                      setPage(1);
                      setYear(Number(v));
                    }}
                  >
                    <SelectTrigger id="select-jev-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper">
                      <SelectGroup>
                        {years.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center gap-2 self-center">
                  <span className="font-manrope text-sm font-semibold">
                    Month
                  </span>
                  <Select
                    value={String(month)}
                    onValueChange={(v) => {
                      setPage(1);
                      setMonth(Number(v));
                    }}
                  >
                    <SelectTrigger id="select-jev-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper">
                      <SelectGroup>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={String(m.value)}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="text-gray-700"
                onClick={() => navigate("/main/jev/create")}
              >
                Create JEV
              </Button>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-auto rounded-sm border">
            <DataTable<JournalEntryVoucherSummary>
              columns={columns}
              getRowId={(row) => row.id}
              rows={jevSummaries}
              rowHoverClass="hover:cursor-pointer hover:bg-gray-50"
              emptyMessage={
                keyword
                  ? `No journal entry vouchers match "${keyword}".`
                  : "No journal entry vouchers for this period."
              }
              actionEnabled
              stickyHeader
              actionComponent={(row) => (
                <div className="flex h-full items-center justify-start gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="text-gray-600 outline-hidden hover:cursor-pointer"
                      aria-label="Row actions"
                    >
                      <Edit size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-32">
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => navigate(`/main/jev/view/${row.id}`)}
                      >
                        <Eye size={16} />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => navigate(`/main/jev/edit/${row.id}`)}
                      >
                        <Edit size={16} />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button className="text-red-400 hover:cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </div>

          <div
            className={clsx("flex items-center p-2 text-gray-700", {
              "justify-between": hasRows,
              "justify-end": !hasRows,
            })}
          >
            {hasRows && (
              <span className="text-sm">
                {`Showing ${rangeStart}–${rangeEnd} of ${total}`}
              </span>
            )}
            <div className="flex items-center justify-end gap-2">
              {total > Number(pageSizes[0]) && (
                <div className="flex w-fit items-center justify-center gap-2">
                  <span className="font-manrope text-sm font-semibold">
                    Items per page
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      const next = Number(v);
                      setPageSize(next);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger id="select-rows-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper">
                      <SelectGroup>
                        {pageSizes
                          .filter(
                            (size) =>
                              Number(size) <= total ||
                              Number(size) === pageSize,
                          )
                          .map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex">
                <Button
                  className="flex items-center justify-center gap-2 hover:cursor-pointer"
                  type="button"
                  variant="ghost"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </Button>
                <Button
                  className="flex items-center justify-center gap-2 hover:cursor-pointer"
                  type="button"
                  variant="ghost"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <SearchDialog
        isOpen={showSearchDialog}
        setOpen={setShowSearchDialog}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default List;
