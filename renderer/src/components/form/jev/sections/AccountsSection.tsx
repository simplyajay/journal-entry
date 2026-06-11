import { useMemo } from "react";
import { JevTable } from "@/components/common/jev/JevTable";
import { TableRow, TableCell } from "@/components/common/ui/table";
import { useFieldArray, useWatch } from "react-hook-form";
import { getAccountEntrySectionFields } from "@/features/journal/fields";
import { useJevFormContext } from "../JevFormContext";
import { formatNumber } from "@/components/common/lib/utils";
import type { AccountEntry } from "@/features/journal/types";
import type { TableColumn } from "@/components/common/jev/JevTable";
import type {
  AccountingEntrySchemaType,
  JournalEntrySchemaType,
} from "@/features/journal/schema";

const defaultAccountEntry: AccountEntry = {
  accountCode: "",
  accountName: "",
  debit: undefined,
  credit: undefined,
};

const AccountsSection = () => {
  const {
    form: {
      register,
      control,
      clearErrors,
      formState: { errors },
    },
    journalType,
  } = useJevFormContext();

  const {
    fields: accountEntries,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({ control, name: "accountingEntries" });

  const accountingEntries = useWatch({ control, name: "accountingEntries" });

  const accountSectionFields = getAccountEntrySectionFields(journalType);

  const totals = useMemo(() => {
    return (
      accountingEntries?.reduce(
        (acc, entry) => {
          const debit =
            typeof entry.debit === "number" && !isNaN(entry.debit) ? entry.debit : 0;
          const credit =
            typeof entry.credit === "number" && !isNaN(entry.credit) ? entry.credit : 0;
          return {
            debit: acc.debit + debit,
            credit: acc.credit + credit,
          };
        },
        { debit: 0, credit: 0 },
      ) ?? { debit: 0, credit: 0 }
    );
  }, [accountingEntries]);

  const isNotBalance = totals.credit !== totals.debit;

  const balanceErrorMessage =
    (errors.accountingEntries as any)?.message ?? errors.accountingEntries?.root?.message;

  return (
    <div className="w-full flex flex-col border border-ring/50 rounded-md">
      <div
        className={`w-full flex justify-center p-2 rounded-t-md ${!journalType ? "bg-muted" : ""}`}
      >
        <h2
          className={`text-xl font-semibold ${!journalType ? "text-muted-foreground" : "text-gray-700"}`}
        >
          Accounts and Explanation
        </h2>
      </div>
      <JevTable<AccountingEntrySchemaType, JournalEntrySchemaType>
        name="accountingEntries"
        columns={accountSectionFields as TableColumn<AccountingEntrySchemaType>[]}
        fields={accountEntries}
        control={control}
        register={register}
        errors={errors}
        clearErrors={clearErrors}
        append={appendAccount}
        remove={removeAccount}
        disabled={!journalType}
        defaultRow={defaultAccountEntry}
        customErrorPaths={["accountingEntries"]}
        footerClass="bg-transparent"
        footerContent={
          <>
            <TableRow className="text-lg font-gray-700 !hover:bg-transparent border-b-0 font-medium">
              <TableCell colSpan={2} className="text-gray-800">
                Total
              </TableCell>
              <TableCell className="text-gray-800">
                <p className={`${isNotBalance ? "text-red-500" : ""}`}>
                  {formatNumber(totals.debit)}
                </p>
              </TableCell>
              <TableCell className="text-gray-800">
                <p className={`${isNotBalance ? "text-red-500" : ""}`}>
                  {formatNumber(totals.credit)}
                </p>
              </TableCell>
            </TableRow>
            {balanceErrorMessage && (
              <TableRow className="pt-0">
                <TableCell colSpan={2} />
                <TableCell colSpan={2}>
                  <p className="font-poppins-300 text-lg text-red-500 ">
                    {balanceErrorMessage}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </>
        }
      />
    </div>
  );
};

export default AccountsSection;
