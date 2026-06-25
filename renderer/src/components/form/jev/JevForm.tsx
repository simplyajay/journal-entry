import { useEffect } from "react";
import { Button } from "../../common/ui/button";
import { useJevForm } from "./useJevForm";
import { useWatch } from "react-hook-form";
import { JevFormProvider } from "./JevFormContext";
import JournalSection from "./sections/JournalSection";
import CkdjCdjSection from "./sections/CkdjCdjSection";
import AccountsSection from "./sections/AccountsSection";
import SummarySection from "./sections/SummarySection";
import DocumentsSection from "./sections/DocumentsSection";

export const FORM_SECTION_CLASS =
  "w-full flex flex-col md:flex-row items-stretch md:gap-5";

const JevForm = () => {
  const { onSubmit, form, scrollToFirstError } = useJevForm();

  const { handleSubmit, control, clearErrors } = form;

  const journalType = useWatch({ control, name: "journalType" });

  useEffect(() => {
    clearErrors();
  }, [journalType]);

  return (
    <JevFormProvider form={form}>
      <form
        noValidate
        className="w-full rounded-lg bg-[#ffffff]"
        onSubmit={handleSubmit(onSubmit, scrollToFirstError)}
      >
        <div className="flex w-full flex-col gap-5 rounded-lg border p-5 shadow-sm">
          <JournalSection />
          <CkdjCdjSection />
          <SummarySection />
          <AccountsSection />
          <DocumentsSection />

          <div className="flex w-full justify-end">
            <Button
              className="p-6 text-lg text-gray-800"
              type="submit"
              variant="secondary"
              disabled={!journalType}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </JevFormProvider>
  );
};

export default JevForm;
