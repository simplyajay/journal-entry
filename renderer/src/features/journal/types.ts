import type { FieldPath } from "react-hook-form";
import type { InputType } from "@/components/common/jev/JevInput";
import type { SupportingDocumentSchemaType, JournalEntrySchemaType } from "./schema";

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

//allowed supporting documents
type AllowedSupportingDocuments = {
  ckdj: "po" | "bur" | "or" | "inv" | "ar";
  cdj: "bur";
  crj: "rcd";
  msij: "ris";
  gj: "lr";
};

type SupportingDocument = {
  [K in SupportingDocumentType]: {
    type: K;
    number: string;
    date: Date;
  };
}[SupportingDocumentType];

type SupportingDocumentByType<T extends SupportingDocumentType> = Extract<
  SupportingDocument,
  { type: T }
>;

type AllowedDocumentsForJournal<T extends JournalType> = SupportingDocumentByType<
  AllowedSupportingDocuments[T]
>;

export type AccountEntry = {
  accountCode: string;
  accountName: string;
  debit: number | undefined;
  credit: number | undefined;
};

export type SupportingDocumentEntry = {
  type: SupportingDocumentType;
  number: string;
  date: Date;
};

type Base = {
  journalEntryVoucherNumber: string;
  journalEntryVoucherDate: Date;
  accountingEntries: AccountEntry[];
  supportingDocuments: SupportingDocument[];
  description: string;
};

type CKDJ_CDJ = {
  disbursementVoucherNumber: string;
  disbursementVoucherDate: Date;
  payeeName: string;
};

type CKDJ = {
  checkNumber: string;
  checkDate: Date;
};

type CDJ = {
  debitAuthorityNumber: string;
  debitAuthorityDate: Date;
};

type GJ = {
  payeeName?: string;
};

type WithDV<T extends JournalType> = T extends "ckdj"
  ? CKDJ_CDJ & CKDJ
  : T extends "cdj"
    ? CKDJ_CDJ & CDJ
    : T extends GJ
      ? { disbursementVoucherNumber: never; disbursementVoucherDate: never }
      : {
          disbursementVoucherNumber: never;
          disbursementVoucherDate: never;
          payeeName: never;
        };

export type JournalEntryVoucherType<T extends keyof AllowedSupportingDocuments> = Base &
  WithDV<T> & {
    journalType: T;
    supportingDocuments: AllowedDocumentsForJournal<T>[];
  };

export type SelectOptions = { label: string; value: string };

export type CommonField = {
  placeholder?: string;
  label?: string;
  error?: string;
  type: InputType;
  disabled?: boolean;
};

export type JournalEntryField = CommonField & {
  name: FieldPath<JournalEntrySchemaType>;
  options?: SelectOptions[];
};

export type SupportingDocumentField = CommonField & {
  name: FieldPath<SupportingDocumentSchemaType>;
  options?: SelectOptions[];
};
