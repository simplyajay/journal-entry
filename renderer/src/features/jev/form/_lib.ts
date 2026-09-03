import { fromCents, toCents } from "@/lib/money";
import type { DefaultValues } from "react-hook-form";
import type { JournalEntrySchemaType } from "./_schema";
import type {
  CivilDate,
  CreateJournalEntryVoucherDTO,
  JournalEntryVoucherDetail,
} from "./_types";

const toDate = (value: CivilDate | undefined): Date | undefined => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const mapJevDetailToFormValues = (
  detail: JournalEntryVoucherDetail,
): DefaultValues<JournalEntrySchemaType> =>
  ({
    journalType: detail.journalType,
    journalEntryVoucherNumber: detail.journalEntryVoucherNumber,
    journalEntryVoucherDate: toDate(detail.journalEntryVoucherDate),
    description: detail.description,
    payeeName: detail.payeeName,
    disbursementVoucherNumber: detail.disbursementVoucherNumber,
    disbursementVoucherDate: toDate(detail.disbursementVoucherDate),
    debitAuthorityNumber: detail.debitAuthorityNumber,
    debitAuthorityDate: toDate(detail.debitAuthorityDate),
    checkNumber: detail.checkNumber,
    checkDate: toDate(detail.checkDate),
    accountingEntries: detail.accountingEntries.map((entry) => ({
      accountCode: entry.accountCode,
      accountName: entry.accountName,
      debit: fromCents(entry.debit),
      credit: fromCents(entry.credit),
    })),
    supportingDocuments: detail.supportingDocuments?.map((doc) => ({
      type: doc.type,
      number: doc.number,
      date: toDate(doc.date),
    })),
  }) as DefaultValues<JournalEntrySchemaType>;

// ounterpart to the mapper above -- the form works in pesos, the
// wire and the database work in centavos, and this is the only crossing point.
export const mapFormValuesToCreateDTO = (
  values: JournalEntrySchemaType,
  meta: { createdBy: string; ownerId: string },
): CreateJournalEntryVoucherDTO => ({
  ...values,
  ...meta,
  accountingEntries: values.accountingEntries.map((entry) => ({
    accountCode: entry.accountCode,
    accountName: entry.accountName,
    debit: entry.debit === undefined ? undefined : toCents(entry.debit),
    credit: entry.credit === undefined ? undefined : toCents(entry.credit),
  })),
});
