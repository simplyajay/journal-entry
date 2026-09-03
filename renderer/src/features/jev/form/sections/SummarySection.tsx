import { useMemo } from "react";
import { useJevFormContext } from "../useJevFormContext";
import { getSummarySectionFields } from "../_fields";
import { FORM_SECTION_CLASS } from "../JevForm";
import { InputRenderer } from "@/components/common/field/RHFInputRenderer";

const SummarySection = () => {
  const { form, journalType } = useJevFormContext();

  const sectionFields = useMemo(
    () => getSummarySectionFields(journalType),
    [journalType],
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

export default SummarySection;
