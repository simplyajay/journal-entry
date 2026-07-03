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
};
