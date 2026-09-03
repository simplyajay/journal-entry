import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { JevFormContext } from "./useJevFormContext";
import type { JournalEntrySchemaType } from "./_schema";

export const JevFormProvider = ({
  children,
  form,
}: {
  children: React.ReactNode;
  form: UseFormReturn<JournalEntrySchemaType>;
}) => {
  const journalType = useWatch({ control: form.control, name: "journalType" });

  return (
    <JevFormContext.Provider value={{ form, journalType }}>
      {children}
    </JevFormContext.Provider>
  );
};
