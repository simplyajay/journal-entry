// Single source of truth for the JEV domain, shared by the Electron main
// process and the renderer. Both sides import from here with `import type`,
// so nothing is emitted or bundled -- this file only exists at compile time.
// Read shapes (main -> renderer) mirror what SQLite actually returns.
// Write shapes (renderer -> main) mirror what the form actually sends;

export type CivilDate = string;

/** Timestamp string as stored in SQLite (`datetime('now')` or ISO-8601). */
export type Timestamp = string;

/** Whole centavos. Money is never stored or transported as a float. */
export type Cents = number;

export type JournalType = "ckdj" | "cdj" | "crj" | "msij" | "gj";

export type SupportingDocumentType =
  | "po"
  | "bur"
  | "or"
  | "inv"
  | "ar"
  | "rcd"
  | "ris"
  | "lr";

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE";

export type AuditLog = {
  id: string;
  userId: string;
  action: AuditActionType;
  entityType: "journal_entry";
  entityId: string;
  description: string;
  createdAt: Timestamp;
};

/* -------------------------------------------------------------------------
 * Read shapes: main -> renderer
 * ---------------------------------------------------------------------- */

export type AccountEntry = {
  accountCode: string;
  accountName: string;
  debit?: Cents;
  credit?: Cents;
};

export type SupportingDocumentEntry = {
  type: SupportingDocumentType;
  number: string;
  description: string;
  date: CivilDate;
};

export type JournalEntryVoucherSummary = {
  id: string;
  journalType: JournalType;
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: CivilDate;
  description: string;
  createdAt: Timestamp;
};

export type JournalEntryVoucherDetail = {
  id: string;
  ownerId: string;
  journalType: JournalType;
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: CivilDate;
  disbursementVoucherNumber?: string;
  disbursementVoucherDate?: CivilDate;
  debitAuthorityNumber?: string;
  debitAuthorityDate?: CivilDate;
  checkNumber?: string;
  checkDate?: CivilDate;
  payeeName?: string;
  description: string;
  accountingEntries: AccountEntry[];
  supportingDocuments?: SupportingDocumentEntry[];
  createdBy: string;
  createdAt: Timestamp;
  lastUpdatedBy: string;
  lastUpdatedAt: Timestamp;
};

export type PaginatedJevSummaries = {
  items: JournalEntryVoucherSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/* -------------------------------------------------------------------------
 * Write shapes: renderer -> main
 * ---------------------------------------------------------------------- */

export type CreateAccountEntryDTO = {
  accountCode: string;
  accountName: string;
  debit?: Cents;
  credit?: Cents;
};

export type CreateSupportingDocumentDTO = {
  type: SupportingDocumentType;
  number: string;
  date: Date;
};

export type CreateJournalEntryVoucherDTO = {
  ownerId: string;
  journalType: JournalType;
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: Date;
  disbursementVoucherNumber?: string;
  disbursementVoucherDate?: Date;
  debitAuthorityNumber?: string;
  debitAuthorityDate?: Date;
  checkNumber?: string;
  checkDate?: Date;
  payeeName?: string;
  description: string;
  accountingEntries: CreateAccountEntryDTO[];
  supportingDocuments?: CreateSupportingDocumentDTO[];
  createdBy: string;
};

// The persisted row is re-read on demand; creating only needs to hand back
// the new id (plus the audit entry the caller may want to surface).
export type CreateJevReturn = {
  log: AuditLog;
  jevId: string;
};

/* -------------------------------------------------------------------------
 * Query params
 * ---------------------------------------------------------------------- */

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type FilterParams = {
  year: number;
  /** 1-12, or 0 for "all months". */
  month: number;
};

export type DateRangeParams = {
  from: CivilDate;
  to: CivilDate;
};

export type getJevSummariesByOwnerParams = {
  ownerId: string;
  pagination: PaginationParams;
  filter: FilterParams;
};

export type searchJevSummariesByOwnerParams = {
  ownerId: string;
  keyword: string;
  pagination: PaginationParams;
  dateRange: DateRangeParams;
};

export type getJevByOwnerAndIdParams = {
  ownerId: string;
  jevId: string;
};
