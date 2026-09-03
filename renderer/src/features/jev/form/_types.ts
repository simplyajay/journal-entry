// the domain and IPC shapes come from the shared module that the
// Electron main process also compiles against.
// Only genuinely form-shaped types are declared here.
export type {
  Cents,
  CivilDate,
  JournalType,
  SupportingDocumentType,
  AccountEntry,
  SupportingDocumentEntry,
  JournalEntryVoucherSummary,
  JournalEntryVoucherDetail,
  PaginatedJevSummaries,
  CreateJournalEntryVoucherDTO,
} from "@shared/types/jev";
