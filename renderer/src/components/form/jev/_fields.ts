import {
  allowedSupportingDocumentsMap,
  journalTypeMap,
  supportingDocumentsMap,
} from "./_constants";
import type { JournalType } from "./_types";
import type {
  AccountingEntrySchemaType,
  JournalEntrySchemaType,
  SupportingDocumentSchemaType,
} from "./_schema";
import type { TableColumn } from "@/components/common/table/EditableTable";
import type { InputField } from "@/components/common/field/_types";

export const getJournalSectionFields = (
  journal?: JournalType,
): InputField<JournalEntrySchemaType>[] => [
  {
    name: "journalType",
    placeholder: "Journal",
    label: "Journal",
    type: "select",
    options: Object.entries(journalTypeMap).map(([value, label]) => ({
      value,
      label,
    })),
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

export const ckdj_cdjSectionFields = (
  journal?: JournalType,
): InputField<JournalEntrySchemaType>[] => {
  const baseList: InputField<JournalEntrySchemaType>[] = [
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
      const cdjFields: InputField<JournalEntrySchemaType>[] = [
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
      const ckdjFields: InputField<JournalEntrySchemaType>[] = [
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

export const getSupportingDocumentSectionFields = (
  journalType?: JournalType,
): TableColumn<SupportingDocumentSchemaType>[] => [
  { name: "number", label: "Document No.", type: "text", width: "w-[30%]" },
  {
    name: "type",
    label: "Description",
    type: "select",
    options: journalType
      ? allowedSupportingDocumentsMap[journalType].map((value) => ({
          value,
          label: supportingDocumentsMap[value],
        }))
      : [],
    width: "w-[40%]",
  },
  {
    name: "date",
    label: "Document Date",
    type: "date-picker",
    width: "w-[25%]",
  },
];

export const summarySectionFields = (
  journal?: JournalType,
): InputField<JournalEntrySchemaType>[] => {
  const baseList: InputField<JournalEntrySchemaType>[] = [
    {
      name: "description",
      placeholder: "Enter description...",
      label: "Description",
      type: "textarea",
    },
  ];

  if (journal === "ckdj" || journal === "cdj" || journal === "gj") {
    const payee: InputField<JournalEntrySchemaType> = {
      name: "payeeName",
      placeholder: "Payee",
      label: "Payee",
      type: "text",
    };
    baseList.push(payee);
  }

  return baseList;
};
