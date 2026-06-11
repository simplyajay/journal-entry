import { useJevFormContext } from "../JevFormContext";
import { FORM_SECTION_CLASS } from "../JevForm";
import { getJournalSectionFields } from "@/features/journal/fields";
import { JevInput } from "@/components/common/jev/JevInput";

const JournalSection = () => {
  const {
    form: {
      register,
      control,
      clearErrors,
      formState: { errors },
    },
    journalType,
  } = useJevFormContext();

  const sectionFields = getJournalSectionFields(journalType);

  return (
    <div className={FORM_SECTION_CLASS}>
      {sectionFields.map((field, index) => (
        <div key={index} className="flex-1 min-w-0">
          <JevInput
            fieldName={`${field.name}`}
            disabled={field.disabled}
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
  );
};

export default JournalSection;
