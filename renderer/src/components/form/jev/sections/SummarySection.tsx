import { useJevFormContext } from "../JevFormContext";
import { summarySectionFields } from "@/components/form/jev/_fields";
import { FORM_SECTION_CLASS } from "../JevForm";
import { InputRenderer } from "@/components/common/field/RHFInputRenderer";

const SummarySection = () => {
  const { form, journalType } = useJevFormContext();

  const summary_fields = summarySectionFields(journalType);

  return (
    <div className={FORM_SECTION_CLASS}>
      {summary_fields.map((field, index) => {
        return (
          <div key={index} className="min-w-0 flex-1">
            <InputRenderer field={field} form={form} />
          </div>
        );
      })}
    </div>
  );
};

export default SummarySection;
