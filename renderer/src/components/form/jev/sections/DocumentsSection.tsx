import { useMemo } from "react";
import { EditableTable } from "@/components/common/table/EditableTable";
import { useFieldArray } from "react-hook-form";
import { getSupportingDocumentSectionFields } from "@/components/form/jev/_fields";
import { useJevFormContext } from "../JevFormContext";
import type {
  JournalEntrySchemaType,
  SupportingDocumentSchemaType,
} from "@/components/form/jev/_schema";

const DocumentsSection = () => {
  const { form, journalType } = useJevFormContext();

  const { control } = form;

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
      className={`border-ring/50 flex w-full flex-col rounded-md border ${!journalType ? "bg-muted/10" : ""}`}
    >
      <div className="flex w-full justify-center p-2">
        <h2
          className={`font-semibold ${!journalType ? "text-muted-foreground/80" : "text-gray-700"}`}
        >
          Supporting Documents
        </h2>
      </div>
      <EditableTable<SupportingDocumentSchemaType, JournalEntrySchemaType>
        name="supportingDocuments"
        columns={columns}
        fields={documentEntries}
        form={form}
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
