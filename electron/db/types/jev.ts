export type JournalType = "ckdj" | "cdj" | "crj" | "msij" | "gj";

export type AccountEntryType = {
  accountCode: string;
  accountName: string;
  debit: number | undefined;
  credit: number | undefined;
};

export type DocumentType = "po" | "bur" | "or" | "inv" | "ar" | "rcd" | "ris" | "lr";

export type CreateDocumentEntryDTO = {
  type: DocumentType;
  number: string;
  date: Date;
};

export type DocumentEntryDTO = CreateDocumentEntryDTO & {
  description: string;
};

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE";

export type AuditLogType = {
  id: string;
  userId: string;
  action: AuditActionType;
  entityType: "journal_entry";
  entityId: string;
  description: string;
  createdAt: Date;
};

export type JournalEntryVoucher = {
  id: string;
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
  accountingEntries: AccountEntryType[];
  supportingDocuments?: DocumentEntryDTO[];
  createdBy: string;
  createdAt: Date;
  lastUpdatedBy: string;
  lastUpdatedAt: Date;
};

export type JournalEntryVoucherSummary = {
  id: string;
  journalType: JournalType;
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: Date;
  description: string;
  createdAt: Date;
};

// CREATE JEV

export type CreateJournalEntryVoucherDTO = Omit<
  JournalEntryVoucher,
  "supportingDocuments" | "id"
> & {
  ownerId: string;
  supportingDocuments?: CreateDocumentEntryDTO[];
};

export type CreateJevReturn = {
  log: AuditLogType;
  jev: JournalEntryVoucher;
};

// GET JEV SUMMARIES

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type FilterParams = {
  year: number;
  month: number;
};

export type DateRangeParams = {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
};

export type PaginatedJevSummaries = {
  items: JournalEntryVoucherSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
