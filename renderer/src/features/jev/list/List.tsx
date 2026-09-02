import DataTable from "../../../components/common/table/DataTable";
import SearchDialog from "./search/SearchDialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/pages/contexts/AuthContext";
import { journalTypeMap, months } from "./_constant";
import { Trash2, Edit, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../../../components/common/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/common/ui/select";
import { toDateOnly } from "./search/_schema";
import type { JournalEntryVoucherSummary } from "../form/_types";
import type { DataTableColumn } from "../../../components/common/table/DataTable";
import type { JEVSearchSchemaType } from "./search/_schema";

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
    render: (row) => journalTypeMap[row.journalType],
    width: "w-[15%]",
  },
  { label: "Description", name: "description" },
];

const pageSizes = ["50", "100"];

const List = () => {
  const { currentUser } = useAuth();
  const [jevSummaries, setJevSummaries] = useState<
    JournalEntryVoucherSummary[]
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [years, setYears] = useState<number[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  useEffect(() => {
    const getJevYears = async () => {
      if (!currentUser) return;

      const res = await window.api.jev.getJevYears({
        ownerId: currentUser.organizationId,
      });

      if (res.success) {
        setYears(Array.from(new Set([new Date().getFullYear(), ...res.data])));
      }
    };

    getJevYears();

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
  }, []);

  useEffect(() => {
    const getList = async () => {
      setLoading(true);

      if (!currentUser) return;

      if (keyword) return;

      const res = await window.api.jev.getJevSummaries({
        ownerId: currentUser.organizationId,
        pagination: { page: currentPage, pageSize: pageSize },
        filter: { year, month },
      });

      if (res.success) {
        setJevSummaries(res.data.items);
        setTotalPages(res.data.totalPages);
      }

      setLoading(false);
    };

    getList();
  }, [currentPage, year, month]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleSearch = async (data: JEVSearchSchemaType) => {
    const { keyword: searchKeyword, startDate, endDate } = data;

    setLoading(true);
    if (!currentUser) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await window.api.jev.searchJevSummaries({
      ownerId: currentUser.organizationId,
      keyword: searchKeyword,
      pagination: { page: currentPage, pageSize: pageSize },
      dateRange: { from: toDateOnly(startDate), to: toDateOnly(endDate) },
    });

    if (res.success) {
      setJevSummaries(res.data.items);
      setTotalPages(res.data.totalPages);
      setKeyword(data.keyword);

      console.log(toDateOnly(startDate));
      console.log(toDateOnly(endDate));
      console.log(res.data.items);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full items-center justify-center">
        <h1 className="text-lg font-semibold text-gray-600">
          JOURNAL ENTRY VOUCHERS
        </h1>
      </div>
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
                onClick={() => setKeyword(undefined)}
              >
                <X size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-4 p-1 text-gray-700">
              <div className="flex w-fit items-center justify-center gap-2 self-center">
                <span className="font-manrope text-sm font-semibold">Year</span>
                <Select
                  value={String(year)}
                  onValueChange={(v) => {
                    setYear(Number(v));
                  }}
                >
                  <SelectTrigger id="select-jev-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper">
                    <SelectGroup>
                      {years.map((size, i) => (
                        <SelectItem key={i} value={String(size)}>
                          {size}
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
                    setMonth(Number(v));
                  }}
                >
                  <SelectTrigger id="select-jev-year">
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
          )}

          <div className="min-h-0 flex-1 overflow-auto rounded-sm border">
            <DataTable<JournalEntryVoucherSummary>
              columns={columns}
              getRowId={(row) => row.id}
              rows={jevSummaries}
              rowHoverClass="hover:cursor-pointer hover:bg-gray-50"
              actionEnabled
              stickyHeader
              actionComponent={() => (
                <div className="flex h-full items-center justify-start gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-gray-600 hover:cursor-pointer">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-700">
            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="flex w-fit items-center justify-center gap-2">
                <span className="font-manrope text-sm font-semibold">
                  Items per page
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));

                    if (jevSummaries.length < Number(v)) return;

                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper">
                    <SelectGroup>
                      {pageSizes.map((size, i) => (
                        <SelectItem key={i} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

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
          <SearchDialog
            isOpen={showSearchDialog}
            setOpen={setShowSearchDialog}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default List;
