import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JournalEntrySchema } from "./_schema";
import { MIN_ACCOUNT_ROWS } from "../_constants";
import type { DefaultValues } from "react-hook-form";
import type { JournalEntrySchemaType } from "./_schema";

export const accountingEntriesDefaultValues = Array.from(
  { length: MIN_ACCOUNT_ROWS },
  () => ({
    accountCode: "",
    accountName: "",
    debit: undefined,
    credit: undefined,
  }),
);

export const EMPTY_JEV_FORM_VALUES = {
  journalType: undefined,
  description: "",
  journalEntryVoucherNumber: "",
  accountingEntries: accountingEntriesDefaultValues,
} as DefaultValues<JournalEntrySchemaType>;

type UseJevFormBaseParams = {
  defaultValues?: DefaultValues<JournalEntrySchemaType>;
};

export const useJevFormBase = ({
  defaultValues,
}: UseJevFormBaseParams = {}) => {
  const form = useForm<JournalEntrySchemaType>({
    resolver: zodResolver(JournalEntrySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      ...EMPTY_JEV_FORM_VALUES,
      ...defaultValues,
    } as DefaultValues<JournalEntrySchemaType>,
  });

  const scrollToFirstError = () => {
    setTimeout(() => {
      const firstInvalid = document.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );

      if (!firstInvalid) return;

      const rect = firstInvalid.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (!isVisible) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };

  return { form, scrollToFirstError };
};
