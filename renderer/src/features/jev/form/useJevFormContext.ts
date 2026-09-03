import { createContext, useContext } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { JournalEntrySchemaType } from "./_schema";
import type { JournalType } from "./_types";

export type JevFormContextType = {
  form: UseFormReturn<JournalEntrySchemaType>;
  journalType: JournalType | undefined;
};

export const JevFormContext = createContext<JevFormContextType | null>(null);

export const useJevFormContext = () => {
  const ctx = useContext(JevFormContext);

  if (!ctx)
    throw new Error("useJevFormContext must be used inside JevFormProvider");

  return ctx;
};
