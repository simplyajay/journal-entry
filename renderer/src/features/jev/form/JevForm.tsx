import { FormProvider } from "react-hook-form";
import { Button } from "@/components/common/ui/button";
import { Loader2 } from "lucide-react";
import { JevFormProvider } from "./JevFormContext";
import JournalSection from "./sections/JournalSection";
import CkdjCdjSection from "./sections/CkdjCdjSection";
import AccountsSection from "./sections/AccountsSection";
import SummarySection from "./sections/SummarySection";
import DocumentsSection from "./sections/DocumentsSection";
import type { ReactNode } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { JournalEntrySchemaType } from "./_schema";

export const FORM_SECTION_CLASS =
  "w-full flex flex-col md:flex-row items-stretch md:gap-5";

type JevFormProps = {
  form: UseFormReturn<JournalEntrySchemaType>;
  onSubmit: SubmitHandler<JournalEntrySchemaType>;
  onInvalid?: () => void;
  title: string;
  headerLeft?: ReactNode;
  loading?: boolean;
  submitLabel?: string;
};

const JevForm = ({
  form,
  onSubmit,
  onInvalid,
  title,
  headerLeft,
  loading = false,
  submitLabel = "Submit",
}: JevFormProps) => {
  const { handleSubmit } = form;

  return (
    <div>
      <FormProvider {...form}>
        <JevFormProvider form={form}>
          <form
            noValidate
            className="w-full bg-[#ffffff]"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            <div className="flex w-full flex-col gap-8 rounded-lg p-2">
              <div className="relative flex w-full items-center justify-center">
                {headerLeft && (
                  <div className="absolute left-0">{headerLeft}</div>
                )}
                <h1 className="text-lg font-semibold text-gray-600">{title}</h1>
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
                      <p>{submitLabel}</p>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </JevFormProvider>
      </FormProvider>
    </div>
  );
};

export default JevForm;
