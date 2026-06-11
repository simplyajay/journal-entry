import {
  allowedSupportingDocumentsMap,
  journalTypeMap,
  supportingDocumentsMap,
} from "./constants";
import type { JournalEntryField, JournalType } from "./types";
import type { AccountingEntrySchemaType, SupportingDocumentSchemaType } from "./schema";
import type { TableColumn } from "@/components/common/jev/JevTable";

export const getJournalSectionFields = (journal?: JournalType): JournalEntryField[] => [
  {
    name: "journalType",
    placeholder: "Journal",
    label: "Journal",
    type: "select",
    options: Object.entries(journalTypeMap).map(([value, label]) => ({ value, label })),
  },
  {
    name: "journalEntryVoucherNumber",
    placeholder: "JEV No.",
    label: "JEV No.",
    type: "text",
    disabled: !journal,
  },
  {
    name: "journalEntryVoucherDate",
    placeholder: "Select Date",
    label: "JEV Date",
    type: "date-picker",
    disabled: !journal,
  },
];

export const ckdj_cdjSectionFields = (journal?: JournalType): JournalEntryField[] => {
  const baseList: JournalEntryField[] = [
    {
      name: "disbursementVoucherNumber",
      placeholder: "DV No.",
      label: "DV no.",
      type: "text",
      disabled: !journal,
    },
    {
      name: "disbursementVoucherDate",
      placeholder: "Select Date",
      label: "DV Date",
      type: "date-picker",
      disabled: !journal,
    },
  ];

  if (journal === "cdj" || journal === "ckdj") {
    if (journal === "cdj") {
      const cdjFields: JournalEntryField[] = [
        {
          name: "debitAuthorityNumber",
          placeholder: "ADA No.",
          label: "ADA No.",
          type: "text",
          disabled: !journal,
        },
        {
          name: "debitAuthorityDate",
          placeholder: "Select Date",
          label: "ADA Date",
          type: "date-picker",
          disabled: !journal,
        },
      ];
      cdjFields.forEach((field) => baseList.push(field));
    } else {
      const ckdjFields: JournalEntryField[] = [
        {
          name: "checkNumber",
          placeholder: "Check No.",
          label: "Check No.",
          type: "text",
          disabled: !journal,
        },
        {
          name: "checkDate",
          placeholder: "Select Date",
          label: "Check Date",
          type: "date-picker",
          disabled: !journal,
        },
      ];

      ckdjFields.forEach((field) => baseList.push(field));
    }
  }

  return baseList;
};

//acountEntry object
export const getAccountEntrySectionFields = (
  journal?: JournalType,
): TableColumn<AccountingEntrySchemaType>[] => [
  {
    name: "accountCode",
    label: "Account Code",
    type: "text",
    width: "w-[20%]",
    disabled: !journal,
  },
  {
    name: "accountName",
    label: "Account Name",
    type: "text",
    width: "w-[30%]",
    disabled: !journal,
  },
  {
    name: "debit",
    label: "Debit",
    type: "currency",
    width: "w-[17.5%]",
    disabled: !journal,
    getDisabled: (row: AccountingEntrySchemaType) => !!row.credit,
  },
  {
    name: "credit",
    label: "Credit",
    type: "currency",
    width: "w-[17.5%]",
    disabled: !journal,
    getDisabled: (row: AccountingEntrySchemaType) => !!row.debit,
  },
];

//supportingDocument object

export const getSupportingDocumentSectionFields = (
  journalType?: JournalType,
): TableColumn<SupportingDocumentSchemaType>[] => [
  { name: "number", label: "Document No.", type: "text", width: "w-[20%]" },
  {
    name: "type",
    label: "Document",
    type: "select",
    options: journalType
      ? allowedSupportingDocumentsMap[journalType].map((value) => ({
          value,
          label: supportingDocumentsMap[value],
        }))
      : [],
    width: "w-[30%]",
  },
  { name: "description", label: "Description", type: "text", width: "w-[30%]" },
  { name: "date", label: "Document Date", type: "date-picker", width: "w-[15%]" },
];

export const summarySectionFields = (journal?: JournalType): JournalEntryField[] => {
  const baseList: JournalEntryField[] = [
    {
      name: "description",
      placeholder: "Enter description...",
      label: "Description",
      type: "textarea",
    },
  ];

  if (journal === "ckdj" || journal === "cdj" || journal === "gj") {
    const payee: JournalEntryField = {
      name: "payeeName",
      placeholder: "Payee",
      label: "Payee",
      type: "text",
    };
    baseList.push(payee);
  }

  return baseList;
};
