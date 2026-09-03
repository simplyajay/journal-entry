// TEMP: stand-in for the future `accounts_and_explanations` DB table.
// Only the two columns the comboboxes need; swap for an IPC fetch later.
export type AccountAndExplanation = {
  accountCode: string;
  accountName: string;
};

// Sample chart-of-accounts rows used to drive the Account Code / Name typeaheads.
export const MOCK_ACCOUNTS_AND_EXPLANATIONS: AccountAndExplanation[] = [
  { accountCode: "1010101000", accountName: "Cash - Collecting Officer" },
  { accountCode: "1010102000", accountName: "Petty Cash" },
  {
    accountCode: "1010104000",
    accountName: "Cash in Bank - Local Currency, Current Account",
  },
  { accountCode: "1030101000", accountName: "Accounts Receivable" },
  {
    accountCode: "1040401000",
    accountName: "Due from National Government Agencies",
  },
  { accountCode: "1990101000", accountName: "Other Prepayments" },
  { accountCode: "2010101000", accountName: "Accounts Payable" },
  { accountCode: "2010201000", accountName: "Due to Officers and Employees" },
  { accountCode: "2020101000", accountName: "Due to BIR" },
  { accountCode: "2020102000", accountName: "Due to GSIS" },
  { accountCode: "2020103000", accountName: "Due to Pag-IBIG" },
  { accountCode: "2020104000", accountName: "Due to PhilHealth" },
  { accountCode: "5020101000", accountName: "Traveling Expenses - Local" },
  { accountCode: "5020201000", accountName: "Training Expenses" },
  { accountCode: "5020301000", accountName: "Office Supplies Expenses" },
  { accountCode: "5020402000", accountName: "Electricity Expenses" },
];
