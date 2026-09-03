import { useMemo } from "react";
import { useJevFormContext } from "../useJevFormContext";
import { getCkdjCdjSectionFields } from "../_fields";
import { FORM_SECTION_CLASS } from "../JevForm";
import { InputRenderer } from "@/components/common/field/RHFInputRenderer";

const CkdjCdjSection = () => {
  const { form, journalType } = useJevFormContext();

  const sectionFields = useMemo(
    () => getCkdjCdjSectionFields(journalType),
    [journalType],
  );

  if (journalType !== "ckdj" && journalType !== "cdj") return null;

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

export default CkdjCdjSection;
