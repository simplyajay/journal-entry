import { useMemo } from "react";
import { EditableTable } from "@/components/common/table/EditableTable";
import { TableRow, TableCell } from "@/components/common/ui/table";
import { useFieldArray, useWatch } from "react-hook-form";
import { getAccountEntrySectionFields } from "../_fields";
import { useJevFormContext } from "../JevFormContext";
import { formatNumber } from "@/components/common/lib/utils";
import type { AccountEntry } from "@/components/form/jev/_types";
import type { TableColumn } from "@/components/common/table/EditableTable";
import type {
  AccountingEntrySchemaType,
  JournalEntrySchemaType,
} from "@/components/form/jev/_schema";

const defaultAccountEntry: AccountEntry = {
  accountCode: "",
  accountName: "",
  debit: undefined,
  credit: undefined,
};

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

  const accountSectionFields = getAccountEntrySectionFields(journalType);

  const totals = useMemo(() => {
    return (
      accountingEntries?.reduce(
        (acc, entry) => {
          const debit =
            typeof entry.debit === "number" && !isNaN(entry.debit)
              ? entry.debit
              : 0;
          const credit =
            typeof entry.credit === "number" && !isNaN(entry.credit)
              ? entry.credit
              : 0;
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
    (errors.accountingEntries as any)?.message ??
    errors.accountingEntries?.root?.message;

  return (
    <div className="border-ring/50 flex w-full flex-col rounded-md border">
      <div
        className={`flex w-full justify-center rounded-t-md p-2 ${!journalType ? "bg-muted/10" : ""}`}
      >
        <h2
          className={`text-xl font-semibold ${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
        >
          Accounts and Explanation
        </h2>
      </div>
      <EditableTable<AccountingEntrySchemaType, JournalEntrySchemaType>
        name="accountingEntries"
        columns={
          accountSectionFields as TableColumn<AccountingEntrySchemaType>[]
        }
        fields={accountEntries}
        form={form}
        append={appendAccount}
        remove={removeAccount}
        disabled={!journalType}
        defaultRow={defaultAccountEntry}
        customErrorPaths={["accountingEntries"]}
        footerClass="bg-transparent"
        footerContent={
          <>
            <TableRow className="font-gray-700 !hover:bg-transparent border-b-0 text-lg font-medium">
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
                <p className={`${isNotBalance ? "text-red-500" : ""}`}>
                  {formatNumber(totals.credit)}
                </p>
              </TableCell>
            </TableRow>
            {balanceErrorMessage && (
              <TableRow className="pt-0">
                <TableCell colSpan={2} />
                <TableCell colSpan={2}>
                  <p className="font-poppins-300 text-lg text-red-500">
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
