import { z } from "zod";
import type { JournalType, SupportingDocumentType } from "./types";

const AccountEntrySchema = z
  .object({
    accountCode: z.string().nonempty("Please enter account code."),
    accountName: z.string().nonempty("Please enter account name."),
    debit: z.union([z.nan(), z.number(), z.undefined()]).transform((val) => {
      if (val === undefined) return undefined;
      if (typeof val === "number") return isNaN(val) ? undefined : val;
    }),
    credit: z.union([z.nan(), z.number(), z.undefined()]).transform((val) => {
      if (val === undefined) return undefined;
      if (typeof val === "number") return isNaN(val) ? undefined : val;
    }),
  })
  .superRefine((data, ctx) => {
    const { debit, credit } = data;

    const hasDebit = debit !== undefined;
    const hasCredit = credit !== undefined;

    if (!hasDebit && !hasCredit) {
      ctx.addIssue({
        code: "custom",
        path: ["debit"],
        message: "Enter debit or credit.",
      });
      return;
    }

    if (hasDebit && hasCredit) {
      ctx.addIssue({
        code: "custom",
        path: ["debit"],
        message: "Only debit or credit.",
      });

      return;
    }

    if (hasDebit && debit! < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["debit"],
        message: "Only debit or credit.",
      });
    }

    if (hasCredit && credit! < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["credit"],
        message: "Amount must be 0 or greater.",
      });
    }
  });

const SupportingDocumentSchema = z.object({
  type: z.enum<SupportingDocumentType[]>([
    "ar",
    "bur",
    "inv",
    "lr",
    "or",
    "po",
    "rcd",
    "ris",
  ]),
  number: z.string().nonempty("Enter document number."),
  date: z.date("Select date"),
});

const CKDJSupportingDocumentSchema = SupportingDocumentSchema.extend({
  type: z.enum<SupportingDocumentType[]>(["bur", "po", "inv", "ar", "or"], {
    error: "Select Document",
  }),
});

const CDJSupportingDocumentSchema = SupportingDocumentSchema.extend({
  type: z.enum<SupportingDocumentType[]>(["bur"], { error: "Select Document" }),
});

const CRJSupportingDocumentSchema = SupportingDocumentSchema.extend({
  type: z.enum<SupportingDocumentType[]>(["rcd"], { error: "Select Document" }),
});

const MSIJSupportingDocumentSchema = SupportingDocumentSchema.extend({
  type: z.enum<SupportingDocumentType[]>(["ris"], { error: "Select Document" }),
});

const GJSupportingDocumentSchema = SupportingDocumentSchema.extend({
  type: z.enum<SupportingDocumentType[]>(["lr"], { error: "Select Document" }),
});

const BaseSchema = z.object({
  journalType: z.enum<JournalType[]>(["ckdj", "cdj", "crj", "gj", "msij"]),
  journalEntryVoucherNumber: z.string().nonempty("Please enter JEV Number."),
  journalEntryVoucherDate: z.date("Select Date"),
  accountingEntries: z.array(AccountEntrySchema).min(2, "Enter atleast 2 accounts"),
  description: z.string().nonempty("Please enter description."),
});

const CKDJSchema = BaseSchema.extend({
  journalType: z.literal<JournalType>("ckdj"),
  disbursementVoucherNumber: z.string().nonempty("Please enter DV number."),
  disbursementVoucherDate: z.date("Select Date"),
  payeeName: z.string().nonempty("Please enter Payee name."),
  checkNumber: z.string().nonempty("Please enter Check number."),
  checkDate: z.date("Select Date"),
  supportingDocuments: z.array(CKDJSupportingDocumentSchema).optional(),
});

const CDJSchema = BaseSchema.extend({
  journalType: z.literal<JournalType>("cdj"),
  disbursementVoucherNumber: z.string().nonempty("Please enter DV number."),
  disbursementVoucherDate: z.date("Select Date"),
  payeeName: z.string().nonempty("Please enter Payee name."),
  debitAuthorityNumber: z.string().nonempty("Please enter ADA number."),
  debitAuthorityDate: z.date("Select Date"),
  supportingDocuments: z.array(CDJSupportingDocumentSchema).optional(),
});

const CRJSchema = BaseSchema.extend({
  journalType: z.literal<JournalType>("crj"),
  supportingDocuments: z.array(CRJSupportingDocumentSchema).optional(),
});

const MSIJSchema = BaseSchema.extend({
  journalType: z.literal<JournalType>("msij"),
  supportingDocuments: z.array(MSIJSupportingDocumentSchema).optional(),
});

const GJSchema = BaseSchema.extend({
  journalType: z.literal<JournalType>("gj"),
  payeeName: z.string().optional(),
  supportingDocuments: z.array(GJSupportingDocumentSchema).optional(),
});

export const JournalEntrySchema = z
  .discriminatedUnion(
    "journalType",
    [CKDJSchema, CDJSchema, CRJSchema, MSIJSchema, GJSchema],
    { error: "Select Journal" },
  )
  .superRefine((data, ctx) => {
    const totals = data.accountingEntries.reduce(
      (acc, entry) => ({
        debit:
          acc.debit +
          (typeof entry.debit === "number" && !isNaN(entry.debit) ? entry.debit : 0),
        credit:
          acc.credit +
          (typeof entry.credit === "number" && !isNaN(entry.credit) ? entry.credit : 0),
      }),
      { debit: 0, credit: 0 },
    );

    if (totals.debit !== totals.credit) {
      ctx.addIssue({
        code: "custom",
        path: ["accountingEntries"],
        message: "Debit and credit must be balanced.",
      });
    }
  });

export type AccountingEntrySchemaType = z.infer<typeof AccountEntrySchema>;

export type SupportingDocumentSchemaType = z.infer<typeof SupportingDocumentSchema>;

export type JournalEntrySchemaType = z.infer<typeof JournalEntrySchema>;
