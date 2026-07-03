import { useJevFormContext } from "../JevFormContext";
import { FORM_SECTION_CLASS } from "../JevForm";
import { getJournalSectionFields } from "@/components/form/jev/_fields";
import { InputRenderer } from "@/components/common/field/RHFInputRenderer";

const JournalSection = () => {
  const { form, journalType } = useJevFormContext();

  const sectionFields = getJournalSectionFields(journalType);

  return (
    <div className={FORM_SECTION_CLASS}>
      {sectionFields.map((field, index) => {
        return (
          <div key={index} className="min-w-0 flex-1">
            <InputRenderer field={field} form={form} />
          </div>
        );
      })}
    </div>
  );
};

export default JournalSection;
