import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JournalEntrySchema } from "@/components/form/jev/_schema";
import type { SubmitHandler } from "react-hook-form";
import type { JournalEntrySchemaType } from "@/components/form/jev/_schema";
import type { JournalEntryVoucherDTO } from "./_types";

export const useJevForm = () => {
  const form = useForm<JournalEntrySchemaType>({
    resolver: zodResolver(JournalEntrySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      journalType: undefined,
      accountingEntries: [
        {
          accountCode: "",
          accountName: "",
          debit: undefined,
          credit: undefined,
        },
        {
          accountCode: "",
          accountName: "",
          debit: undefined,
          credit: undefined,
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<JournalEntrySchemaType> = async (data) => {
    const finalizedData: JournalEntryVoucherDTO = {
      ...data,
      createdBy: "test",
    };
    const result = await window.api.createJev(finalizedData);

    if (result.success) {
      console.log("[onSubmit] Created JEV, id:", result.data);
    } else {
      console.error("[onSubmit] Failed to create JEV:", result.error);
    }
  };

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

  return { onSubmit, form, scrollToFirstError };
};
