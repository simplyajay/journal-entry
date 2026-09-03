import { useCallback, useMemo } from "react";
import { useJevFormContext } from "../useJevFormContext";
import { FORM_SECTION_CLASS } from "../JevForm";
import { getJournalSectionFields } from "../_fields";
import { accountingEntriesDefaultValues } from "../useJevFormBase";
import { InputRenderer } from "@/components/common/field/RHFInputRenderer";
import type { JournalType } from "../_types";

const JournalSection = () => {
  const { form, journalType } = useJevFormContext();
  const { clearErrors, getValues, reset } = form;

  const handleJournalTypeChange = useCallback((value: string) => {
    const {
      journalEntryVoucherNumber,
      journalEntryVoucherDate,
      description,
      accountingEntries,
    } = getValues();

    clearErrors();
    reset({
      journalType: value as JournalType,
      journalEntryVoucherNumber,
      journalEntryVoucherDate,
      description,
      accountingEntries: accountingEntries ?? accountingEntriesDefaultValues,
      supportingDocuments: [],
    });
  }, [clearErrors, getValues, reset]);

  const sectionFields = useMemo(
    () => getJournalSectionFields(journalType, handleJournalTypeChange),
    [journalType, handleJournalTypeChange],
  );

  return (
    <div className={FORM_SECTION_CLASS}>
      {sectionFields.map((field) => (
        <div key={field.name} className="min-w-0 flex-1">
          <InputRenderer field={field} form={form} />
        </div>
      ))}
    </div>
  );
};

export default JournalSection;
