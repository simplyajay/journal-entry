import { useJevFormContext } from "../JevFormContext";
import { ckdj_cdjSectionFields } from "@/features/journal/fields";
import { JevInput } from "@/components/common/jev/JevInput";
import { FORM_SECTION_CLASS } from "../JevForm";

const CkdjCdjSection = () => {
  const {
    form: {
      register,
      control,
      clearErrors,
      formState: { errors },
    },
    journalType,
  } = useJevFormContext();

  const ckdj_cdj_fields = ckdj_cdjSectionFields(journalType);

  return (
    !(journalType !== "ckdj" && journalType !== "cdj") && (
      <div className={FORM_SECTION_CLASS}>
        {ckdj_cdj_fields.map((field, index) => (
          <div key={index} className="flex-1 min-w-0">
            <JevInput
              fieldName={field.name}
              label={field.label}
              type={field.type}
              register={register}
              control={control}
              errors={errors}
              placeholder={field.placeholder}
              clearErrors={clearErrors}
              options={field.options}
            />
          </div>
        ))}
      </div>
    )
  );
};

export default CkdjCdjSection;
