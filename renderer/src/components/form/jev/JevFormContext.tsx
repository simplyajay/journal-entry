import React, { createContext, useContext } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { JournalEntrySchemaType } from "@/components/form/jev/_schema";
import type { JournalType } from "@/components/form/jev/_types";

type JevFormContextType = {
  form: UseFormReturn<JournalEntrySchemaType>;
  journalType: JournalType | undefined;
};

const JevFormContext = createContext<JevFormContextType | null>(null);

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

export const useJevFormContext = () => {
  const ctx = useContext(JevFormContext);

  if (!ctx)
    throw new Error("useJevFormContext must be used inside JevFormProvider");

  return ctx;
};
