import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JournalEntrySchema } from "./_schema";
import type { SubmitHandler } from "react-hook-form";
import type { JournalEntrySchemaType } from "./_schema";
import type { JournalEntryVoucherDTO } from "./_types";
import { useAuth } from "@/pages/contexts/AuthContext";
import { useState } from "react";

export const accountingEntriesDefaultValues = [
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
];

export const useJevForm = () => {
  const { currentUser } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<JournalEntrySchemaType>({
    resolver: zodResolver(JournalEntrySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      journalType: undefined,
      description: "",
      journalEntryVoucherNumber: "",
      accountingEntries: accountingEntriesDefaultValues,
    },
  });

  const { reset, setError } = form;

  const onSubmit: SubmitHandler<JournalEntrySchemaType> = async (data) => {
    setLoading(true);

    if (!currentUser) {
      console.error("[onSubmit] Failed to create JEV:", "Unauthorized");
      return;
    }

    const finalizedData: JournalEntryVoucherDTO = {
      ...data,
      createdBy: currentUser.id,
      ownerId: currentUser.organizationId,
    };

    const result = await window.api.jev.createJev(finalizedData);

    if (result.success) {
      setShowDialog(true);
      reset({
        journalType: undefined,
        description: "",
        journalEntryVoucherNumber: "",
        accountingEntries: accountingEntriesDefaultValues,
      });
    } else {
      if (
        result.error.type === "field" &&
        result.error.field === "journalEntryVoucherNumber"
      ) {
        setError(result.error.field, { message: result.error.message });
        scrollToFirstError();
      }
      console.error("[onSubmit] Failed to create JEV:", result.error);
    }

    setLoading(false);
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

  return {
    onSubmit,
    form,
    scrollToFirstError,
    showDialog,
    setShowDialog,
    loading,
  };
};
