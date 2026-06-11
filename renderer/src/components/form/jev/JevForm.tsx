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
        className="w-full bg-[#ffffff] rounded-lg"
        onSubmit={handleSubmit(onSubmit, scrollToFirstError)}
      >
        <div className="w-full flex flex-col p-5 gap-5 border shadow-sm rounded-lg">
          <JournalSection />
          <CkdjCdjSection />
          <AccountsSection />
          <DocumentsSection />
          <SummarySection />

          <div className="w-full flex justify-end">
            <Button
              className=" text-lg text-gray-800 p-6"
              type="submit"
              variant="secondary"
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
