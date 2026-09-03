import { useMemo } from "react";
import { EditableTable } from "@/components/common/table/EditableTable";
import { TableRow, TableCell } from "@/components/common/ui/table";
import { useFieldArray, useWatch } from "react-hook-form";
import { getAccountEntrySectionFields } from "../_fields";
import { useAccountsAndExplanations } from "../useAccountsAndExplanations";
import { useJevFormContext } from "../useJevFormContext";
import { MIN_ACCOUNT_ROWS } from "../../_constants";
import { formatNumber, toCents } from "@/lib/money";
import type { FieldError, FieldErrors, Path } from "react-hook-form";
import type { AccountEntry } from "../_types";
import type {
  AccountingEntrySchemaType,
  JournalEntrySchemaType,
} from "../_schema";

const accountErrorPaths: Path<JournalEntrySchemaType>[] = ["accountingEntries"];

const defaultAccountEntry: AccountEntry = {
  accountCode: "",
  accountName: "",
  debit: undefined,
  credit: undefined,
};

const getArrayLevelMessage = (
  error: FieldErrors<JournalEntrySchemaType>["accountingEntries"],
): string | undefined =>
  (error as FieldError | undefined)?.message ?? error?.root?.message;

const AccountsSection = () => {
  const { form, journalType } = useJevFormContext();

  const {
    control,
    formState: { errors },
  } = form;

  const {
    fields: accountEntries,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({ control, name: "accountingEntries" });

  const accountingEntries = useWatch({ control, name: "accountingEntries" });

  const { codeOptions, nameOptions } = useAccountsAndExplanations();

  const accountSectionFields = useMemo(
    () =>
      getAccountEntrySectionFields(journalType).map((col) => {
        if (col.name === "accountCode") return { ...col, options: codeOptions };
        if (col.name === "accountName") return { ...col, options: nameOptions };
        return col;
      }),
    [journalType, codeOptions, nameOptions],
  );

  const totals = useMemo(() => {
    const cents = accountingEntries?.reduce(
      (acc, entry) => {
        return {
          debit: acc.debit + toCents(entry.debit),
          credit: acc.credit + toCents(entry.credit),
        };
      },
      { debit: 0, credit: 0 },
    ) ?? { debit: 0, credit: 0 };

    return {
      debit: cents.debit / 100,
      credit: cents.credit / 100,
    };
  }, [accountingEntries]);

  const isNotBalance = totals.credit !== totals.debit;

  const balanceErrorMessage = getArrayLevelMessage(errors.accountingEntries);

  return (
    <div className="border-ring/50 flex w-full flex-col rounded-md border">
      <div
        className={`flex w-full justify-center rounded-t-md p-2 ${!journalType ? "bg-muted/10" : ""}`}
      >
        <h2
          className={`font-semibold ${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
        >
          Accounts and Explanation
        </h2>
      </div>
      <EditableTable<AccountingEntrySchemaType, JournalEntrySchemaType>
        name="accountingEntries"
        columns={accountSectionFields}
        fields={accountEntries}
        form={form}
        append={appendAccount}
        remove={removeAccount}
        disabled={!journalType}
        defaultRow={defaultAccountEntry}
        customErrorPaths={accountErrorPaths}
        minRows={MIN_ACCOUNT_ROWS}
        footerClass="bg-transparent"
        footerContent={
          <>
            <TableRow className="font-gray-700 !hover:bg-transparent border-b-0 text-sm font-medium">
              <TableCell
                colSpan={2}
                className={`${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
              >
                Total
              </TableCell>
              <TableCell
                className={`${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
              >
                <p className={`${isNotBalance ? "text-red-500" : ""}`}>
                  {formatNumber(totals.debit)}
                </p>
              </TableCell>
              <TableCell
                className={`${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
              >
                <p className={`${isNotBalance ? "text-red-500" : "text-sm"}`}>
                  {formatNumber(totals.credit)}
                </p>
              </TableCell>
            </TableRow>
            {balanceErrorMessage && (
              <TableRow className="pt-0">
                <TableCell colSpan={2} />
                <TableCell colSpan={2}>
                  {/* D3: `font-poppins-300` was never a generated class. */}
                  <p className="font-poppins text-sm font-light text-red-500">
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
