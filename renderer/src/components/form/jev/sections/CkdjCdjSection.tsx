import { useJevFormContext } from "../JevFormContext";
import { ckdj_cdjSectionFields } from "@/components/form/jev/_fields";
import { FORM_SECTION_CLASS } from "../JevForm";
import { InputRenderer } from "../../../common/field/RHFInputRenderer";

const CkdjCdjSection = () => {
  const { form, journalType } = useJevFormContext();

  const ckdj_cdj_fields = ckdj_cdjSectionFields(journalType);

  return (
    !(journalType !== "ckdj" && journalType !== "cdj") && (
      <div className={FORM_SECTION_CLASS}>
        {ckdj_cdj_fields.map((field, index) => {
          return (
            <div key={index} className="min-w-0 flex-1">
              <InputRenderer field={field} form={form} />
            </div>
          );
        })}
      </div>
    )
  );
};

export default CkdjCdjSection;
