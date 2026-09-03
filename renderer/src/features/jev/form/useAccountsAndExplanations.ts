import { useMemo } from "react";
import { MOCK_ACCOUNTS_AND_EXPLANATIONS } from "./_mockAccounts";
import type { ComboOption } from "@/components/common/field/_types";

// Supplies the option lists for the Account Code / Account Name comboboxes.
// Backed by mock data for now; the source can move to an IPC call later
// without changing the callers.
export const useAccountsAndExplanations = () => {
  return useMemo(() => {
    const rows = MOCK_ACCOUNTS_AND_EXPLANATIONS;

    // `data` carries the whole row so picking an option can also fill the
    // sibling column (code <-> name) via the combobox's pairing logic.
    const codeOptions: ComboOption[] = rows.map((row) => ({
      label: row.accountCode,
      value: row.accountCode,
      data: row,
    }));

    const nameOptions: ComboOption[] = rows.map((row) => ({
      label: row.accountName,
      value: row.accountName,
      data: row,
    }));

    return { codeOptions, nameOptions };
  }, []);
};
