import { useEffect } from "react";
import { Button } from "../../common/ui/button";
import { accountingEntriesDefaultValues, useJevForm } from "./useJevForm";
import { useWatch } from "react-hook-form";
import { JevFormProvider } from "./JevFormContext";
import JournalSection from "./sections/JournalSection";
import CkdjCdjSection from "./sections/CkdjCdjSection";
import AccountsSection from "./sections/AccountsSection";
import SummarySection from "./sections/SummarySection";
import DocumentsSection from "./sections/DocumentsSection";
import ActionDialog from "@/components/common/dialog/ActionDialog";
import { Loader2 } from "lucide-react";

export const FORM_SECTION_CLASS =
  "w-full flex flex-col md:flex-row items-stretch md:gap-5";

const JevForm = () => {
  const {
    onSubmit,
    form,
    scrollToFirstError,
    showDialog,
    setShowDialog,
    loading,
  } = useJevForm();

  const { handleSubmit, control, clearErrors, reset } = form;

  const journalType = useWatch({ control, name: "journalType" });

  useEffect(() => {
    clearErrors();
    reset({
      journalType,
      accountingEntries: accountingEntriesDefaultValues,
    });
  }, [journalType]);

  return (
    <>
      <JevFormProvider form={form}>
        <form
          noValidate
          className="w-full bg-[#ffffff]"
          onSubmit={handleSubmit(onSubmit, scrollToFirstError)}
        >
          <div className="flex w-full flex-col gap-8 rounded-lg p-2">
            <div className="flex w-full items-center justify-center">
              <h1 className="text-lg font-semibold text-gray-600">
                NEW JOURNAL ENTRY VOUCHER
              </h1>
            </div>

            <JournalSection />
            <CkdjCdjSection />
            <SummarySection />
            <div className="flex w-full flex-col gap-8 pb-4">
              <AccountsSection />
              <DocumentsSection />
              <div className="flex w-full justify-end">
                <Button
                  className="font-manrope self-center p-5 text-gray-800"
                  type="submit"
                  variant="secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 size-6 animate-spin" />
                  ) : (
                    <p>Submit</p>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </JevFormProvider>

      <ActionDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        dialogTitle="Journal Entry Voucher"
        dialogDescription="Successfully created new Journal Entry Voucher."
        dialogFooter={
          <Button
            onClick={() => setShowDialog(false)}
            type="button"
            variant="secondary"
          >
            Close
          </Button>
        }
      />
    </>
  );
};

export default JevForm;
