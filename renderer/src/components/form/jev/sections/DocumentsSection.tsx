import { useMemo } from "react";
import { JevTable } from "@/components/common/jev/JevTable";
import { useFieldArray } from "react-hook-form";
import { getSupportingDocumentSectionFields } from "@/features/journal/fields";
import { useJevFormContext } from "../JevFormContext";
import type { SupportingDocumentEntry } from "@/features/journal/types";
import type {
  JournalEntrySchemaType,
  SupportingDocumentSchemaType,
} from "@/features/journal/schema";

const defaultSupportingDocument: SupportingDocumentEntry = {
  type: "ar",
  number: "",
  description: "",
  date: new Date(Date.now()),
};

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
      className={`w-full flex flex-col border border-gray-300 rounded-lg ${!journalType ? "bg-muted" : ""}`}
    >
      <div className="w-full flex justify-center p-2 border">
        <h2 className="text-gray-800 text-xl font-semibold">Supporting Documents</h2>
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
        defaultRow={defaultSupportingDocument}
        isOptional
      />
    </div>
  );
};

export default DocumentsSection;
