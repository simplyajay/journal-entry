import type { JournalType } from "../form/jev/_types";
import type { SelectMonth } from "./_types";

export const journalTypeMap: Record<JournalType, string> = {
  ckdj: "CKDJ",
  cdj: "CDJ",
  crj: "CRJ",
  msij: "MSIJ",
  gj: "GJ",
};

// 1-indexed to match SQL's month convention (January = 1, December = 12),
// unlike JS's Date.getMonth() which is 0-indexed (January = 0).
export const months: SelectMonth[] = [
  { value: 0, label: "All" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
