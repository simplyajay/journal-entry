import type { JournalEntrySchemaType } from "./_schema";

export type SupportingDocumentType =
  | "po"
  | "bur"
  | "or"
  | "inv"
  | "ar"
  | "rcd"
  | "ris"
  | "lr";

export type JournalType = "ckdj" | "cdj" | "crj" | "msij" | "gj";

export type AccountEntry = {
  accountCode: string;
  accountName: string;
  debit: number | undefined;
  credit: number | undefined;
};

export type SupportingDocumentEntry = {
  type: SupportingDocumentType;
  number: string;
  description: string;
  date: Date;
};

export type JournalEntryVoucherDTO = JournalEntrySchemaType & {
  createdBy: string;
  ownerId: string;
};

export type JournalEntryVoucherSummary = {
  id: string;
  journalType: JournalType;
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: Date;
  description: string;
  createdAt: Date;
};

export type PaginatedJevSummaries = {
  items: JournalEntryVoucherSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
