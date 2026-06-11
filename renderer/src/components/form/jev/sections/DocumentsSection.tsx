import { useMemo } from "react";
import { JevTable } from "@/components/common/jev/JevTable";
import { useFieldArray } from "react-hook-form";
import { getSupportingDocumentSectionFields } from "@/features/journal/fields";
import { useJevFormContext } from "../JevFormContext";
import type {
  JournalEntrySchemaType,
  SupportingDocumentSchemaType,
} from "@/features/journal/schema";

const DocumentsSection = () => {
  const {
    form: {
      register,
      control,
      clearErrors,
      formState: { errors },
    },
    journalType,
  } = useJevFormContext();

  const {
    fields: documentEntries,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({ control, name: "supportingDocuments" });

  const columns = useMemo(
    () => getSupportingDocumentSectionFields(journalType),
    [journalType],
  );

  return (
    <div
      className={`w-full flex flex-col border border-ring/50 rounded-md ${!journalType ? "bg-muted" : ""}`}
    >
      <div className="w-full flex justify-center p-2">
        <h2
          className={`text-xl font-semibold ${!journalType ? "text-muted-foreground" : "text-gray-700"}`}
        >
          Supporting Documents
        </h2>
      </div>
      <JevTable<SupportingDocumentSchemaType, JournalEntrySchemaType>
        name="supportingDocuments"
        columns={columns}
        fields={documentEntries}
        control={control}
        register={register}
        errors={errors}
        clearErrors={clearErrors}
        disabled={!journalType}
        append={appendDocument}
        remove={removeDocument}
        defaultRow={{
          type: "ar",
          number: "",
          date: undefined,
        }}
        isOptional
      />
    </div>
  );
};

export default DocumentsSection;
