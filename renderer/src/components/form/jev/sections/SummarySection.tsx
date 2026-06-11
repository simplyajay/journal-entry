import { useJevFormContext } from "../JevFormContext";
import { JevInput } from "@/components/common/jev/JevInput";
import { summarySectionFields } from "@/features/journal/fields";
import { FORM_SECTION_CLASS } from "../JevForm";

const SummarySection = () => {
  const {
    form: {
      register,
      control,
      clearErrors,
      formState: { errors },
    },
    journalType,
  } = useJevFormContext();

  const summary_fields = summarySectionFields(journalType);

  return (
    <div className={FORM_SECTION_CLASS}>
      {summary_fields.map((field, index) => (
        <div key={index} className="flex-1 min-w-0">
          <JevInput
            fieldName={field.name}
            label={field.label}
            type={field.type}
            register={register}
            control={control}
            errors={errors}
            disabled={!journalType}
            placeholder={field.placeholder}
            clearErrors={clearErrors}
            options={field.options}
          />
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
